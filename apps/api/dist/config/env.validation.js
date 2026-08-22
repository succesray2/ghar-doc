"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = envValidationSchema;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRES: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES: zod_1.z.string().default('30d'),
    PORT: zod_1.z.coerce.number().default(4000),
    WEB_URL: zod_1.z.string().default('http://localhost:5173'),
});
function envValidationSchema(config) {
    const parsed = envSchema.safeParse(config);
    if (!parsed.success) {
        throw new Error(`Invalid environment variables: ${parsed.error.toString()}`);
    }
    return parsed.data;
}
//# sourceMappingURL=env.validation.js.map