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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Sentry = __importStar(require("@sentry/node"));
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV ?? 'development',
        tracesSampleRate: 0,
        beforeSend(event) {
            if (event.request) {
                delete event.request.cookies;
                delete event.request.data;
                if (event.request.headers) {
                    delete event.request.headers.authorization;
                    delete event.request.headers.cookie;
                }
            }
            delete event.user;
            return event;
        },
    });
}
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    const config = app.get(config_1.ConfigService);
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.use(express_1.default.json({ limit: '256kb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '256kb' }));
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: config.get('WEB_URL'),
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-Type'],
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    const port = config.get('PORT') ?? 4000;
    await app.listen(port);
    console.log(`Ghar Doc API listening on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map