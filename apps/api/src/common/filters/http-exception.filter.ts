import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import type { Response } from 'express';

/** Express/body-parser-style errors (e.g. PayloadTooLargeError) carry their
 *  own real status on `.status`/`.statusCode` but aren't a Nest HttpException
 *  — without this, every one of them got flattened into a generic 500. */
function extractRawStatus(exception: unknown): number | null {
  if (typeof exception !== 'object' || exception === null) return null;
  const raw = (exception as { status?: unknown; statusCode?: unknown }).status ?? (exception as { statusCode?: unknown }).statusCode;
  return typeof raw === 'number' && raw >= 400 && raw < 600 ? raw : null;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('UnhandledException');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rawStatus = extractRawStatus(exception);
    const status = exception instanceof HttpException ? exception.getStatus() : (rawStatus ?? HttpStatus.INTERNAL_SERVER_ERROR);

    const body =
      exception instanceof HttpException
        ? exception.getResponse()
        : rawStatus !== null && exception instanceof Error
          ? { message: exception.message }
          : { message: 'Internal server error' };

    if (status >= 500) {
      // A genuine unexpected error, not a normal 4xx flow-control
      // exception — this must leave a trace somewhere, or it's
      // invisible to everyone once the generic response goes out.
      this.logger.error(exception instanceof Error ? exception.stack : exception);
      if (process.env.SENTRY_DSN) {
        Sentry.captureException(exception);
      }
    }

    response
      .status(status)
      .json(typeof body === 'string' ? { statusCode: status, message: body } : { statusCode: status, ...(body as object) });
  }
}
