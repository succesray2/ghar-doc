import { Body, Controller, Get, HttpCode, HttpStatus, Post, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  SignupPatientSchema,
  SignupDoctorSchema,
  LoginSchema,
  RefreshSchema,
  ChangePasswordSchema,
  type SignupPatientInput,
  type SignupDoctorInput,
  type LoginInput,
  type RefreshInput,
  type ChangePasswordInput,
} from '@ghar-doc/shared';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from './types';

const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post('signup/patient')
  async signupPatient(
    @Body(new ZodValidationPipe(SignupPatientSchema)) body: SignupPatientInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.signupPatient(body, requestContext(req));
    this.setRefreshCookie(res, refreshToken);
    return this.sessionResponse(req, accessToken, refreshToken, user);
  }

  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post('signup/doctor')
  async signupDoctor(
    @Body(new ZodValidationPipe(SignupDoctorSchema)) body: SignupDoctorInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.signupDoctor(body, requestContext(req));
    this.setRefreshCookie(res, refreshToken);
    return this.sessionResponse(req, accessToken, refreshToken, user);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(body, requestContext(req));
    this.setRefreshCookie(res, refreshToken);
    return this.sessionResponse(req, accessToken, refreshToken, user);
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshSchema)) body: RefreshInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const presented =
      (req.cookies?.[REFRESH_COOKIE] as string | undefined) ??
      (this.isMobileClient(req) ? body.refreshToken : undefined) ??
      null;
    if (!presented) {
      return { accessToken: null, user: null };
    }
    const { accessToken, refreshToken, user } = await this.authService.refresh(presented, requestContext(req));
    this.setRefreshCookie(res, refreshToken);
    return this.sessionResponse(req, accessToken, refreshToken, user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body(new ZodValidationPipe(RefreshSchema)) body: RefreshInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const presented =
      (req.cookies?.[REFRESH_COOKIE] as string | undefined) ??
      (this.isMobileClient(req) ? body.refreshToken : undefined) ??
      null;
    await this.authService.logout(presented);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@CurrentUser() user: AuthenticatedUser, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutAll(user.id);
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  async sessions(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.listSessions(user.id);
  }

  // A stolen access token shouldn't get unlimited guesses at the current password.
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(ChangePasswordSchema)) body: ChangePasswordInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.changePassword(user.id, body.currentPassword, body.newPassword);
    // changePassword() revokes every session, including this cookie's.
    res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }

  private isMobileClient(req: Request): boolean {
    return req.headers['x-client-type'] === 'mobile';
  }

  /** Web (no X-Client-Type header) keeps getting exactly today's {accessToken, user} shape.
   *  Mobile clients also get the refreshToken in the body, since they have no httpOnly-cookie
   *  jar to carry it implicitly the way a browser does. */
  private sessionResponse(
    req: Request,
    accessToken: string,
    refreshToken: string,
    user: AuthenticatedUser,
  ) {
    if (this.isMobileClient(req)) {
      return { accessToken, refreshToken, user };
    }
    return { accessToken, user };
  }

  private setRefreshCookie(res: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      // 'lax' works locally (different ports on localhost are same-site).
      // In production the web app and API start out on different Render
      // subdomains (*.onrender.com is on the public suffix list, so they
      // count as different sites to the browser) — cross-site cookies need
      // 'none', which browsers only honor when 'secure' is also true. Still
      // correct once a shared custom domain is connected later.
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/api/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}

/** IP/user-agent for the RefreshToken row — purely device/session context,
 *  never used for any access-control decision. Accurate because main.ts
 *  sets trust proxy. */
function requestContext(req: Request) {
  return { ip: req.ip, userAgent: req.headers['user-agent'] };
}
