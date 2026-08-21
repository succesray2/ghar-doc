"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.set('trust proxy', 1);
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: config.get('WEB_URL'),
        credentials: true,
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    const port = config.get('PORT') ?? 4000;
    await app.listen(port);
    console.log(`Ghar Doc API listening on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map