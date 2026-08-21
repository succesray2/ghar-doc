"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const Sentry = __importStar(require("@sentry/node"));
function extractRawStatus(exception) {
    if (typeof exception !== 'object' || exception === null)
        return null;
    const raw = exception.status ?? exception.statusCode;
    return typeof raw === 'number' && raw >= 400 && raw < 600 ? raw : null;
}
let HttpExceptionFilter = class HttpExceptionFilter {
    logger = new common_1.Logger('UnhandledException');
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rawStatus = extractRawStatus(exception);
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : (rawStatus ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        const body = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : rawStatus !== null && exception instanceof Error
                ? { message: exception.message }
                : { message: 'Internal server error' };
        if (status >= 500) {
            this.logger.error(exception instanceof Error ? exception.stack : exception);
            if (process.env.SENTRY_DSN) {
                Sentry.captureException(exception);
            }
        }
        response
            .status(status)
            .json(typeof body === 'string' ? { statusCode: status, message: body } : { statusCode: status, ...body });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map