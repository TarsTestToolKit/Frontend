"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = exports.pageRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const index_1 = require("../app/index");
const noCacheMidware_1 = __importDefault(require("./noCacheMidware"));
//获取路由
const getRouter = (prefix, router, routerConf) => {
    routerConf.forEach(function (conf) {
        try {
            const [method, url, obj, controller, checkRule, validParams] = conf;
            //前置参数合并校验相关中间件
            router.register(prefix + url, [method], [noCacheMidware_1.default, async (ctx, next) => {
                    await controller.call(obj, ctx);
                    await next();
                }]);
        }
        catch (e) {
            console.log(e);
        }
    });
};
//页面类型路由
const pageRouter = new koa_router_1.default();
exports.pageRouter = pageRouter;
getRouter("", pageRouter, index_1.pageConf);
const apiRouter = new koa_router_1.default();
exports.apiRouter = apiRouter;
getRouter("/api", apiRouter, index_1.apiConf);
