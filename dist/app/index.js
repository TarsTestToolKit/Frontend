"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConf = exports.pageConf = void 0;
const PageController_1 = __importDefault(require("./controller/PageController"));
const TestController_1 = __importDefault(require("./controller/TestController"));
const pageConf = [
    //首页
    ["get", "/", PageController_1.default, PageController_1.default.index],
];
exports.pageConf = pageConf;
const apiConf = [
    ["post", "/doFuncTest", TestController_1.default, TestController_1.default.doFuncTest],
    ["post", "/doPerfTest", TestController_1.default, TestController_1.default.doPerfTest],
    ["get", "/getTestHistories", TestController_1.default, TestController_1.default.getTestHistories],
    ["get", "/getTestDetail", TestController_1.default, TestController_1.default.getTestDetail],
    ["post", "/isPerfExists", TestController_1.default, TestController_1.default.isPerfExists]
];
exports.apiConf = apiConf;
