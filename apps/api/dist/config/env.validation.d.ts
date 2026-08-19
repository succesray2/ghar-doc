import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    JWT_ACCESS_EXPIRES: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_EXPIRES: z.ZodDefault<z.ZodString>;
    PORT: z.ZodDefault<z.ZodNumber>;
    WEB_URL: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_EXPIRES: string;
    PORT: number;
    WEB_URL: string;
}, {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES?: string | undefined;
    JWT_REFRESH_EXPIRES?: string | undefined;
    PORT?: number | undefined;
    WEB_URL?: string | undefined;
}>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare function envValidationSchema(config: Record<string, unknown>): EnvConfig;
export {};
