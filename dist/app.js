"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const path = __importStar(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const midware_1 = require("./midware");
const webConf_1 = __importDefault(require("./config/webConf"));
const app = new koa_1.default();
exports.app = app;
//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;
// error handler
// onerror(app);
const appInitialize = () => {
    //安全防护
    app.use(koa_helmet_1.default());
    app.use(koa_bodyparser_1.default());
    app.use(koa_static_1.default(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));
    app.use(midware_1.pageRouter.routes());
    app.use(midware_1.apiRouter.routes());
};
const initialize = async () => {
    const dbPath = path.join(__dirname, "./config/config.json");
    Object.assign(webConf_1.default.config, JSON.parse(fs_extra_1.default.readFileSync(dbPath, 'utf-8')));
    console.log(webConf_1.default);
    appInitialize();
};
exports.initialize = initialize;
