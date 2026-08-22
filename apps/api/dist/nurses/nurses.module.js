"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NursesModule = void 0;
const common_1 = require("@nestjs/common");
const nurses_service_1 = require("./nurses.service");
const nurses_controller_1 = require("./nurses.controller");
let NursesModule = class NursesModule {
};
exports.NursesModule = NursesModule;
exports.NursesModule = NursesModule = __decorate([
    (0, common_1.Module)({
        controllers: [nurses_controller_1.NursesController],
        providers: [nurses_service_1.NursesService],
        exports: [nurses_service_1.NursesService],
    })
], NursesModule);
//# sourceMappingURL=nurses.module.js.map