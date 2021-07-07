"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = __importDefault(require("../../rpc"));
const apiProxy_1 = require("../../rpc/proxy/apiProxy");
class TestController {
    //函数测试
    static async doFuncTest(ctx) {
        try {
            let ret = await rpc_1.default.apiPrx.doFuncTest();
            ctx.body = ret.response.return.toObject();
        }
        catch (e) {
            ctx.body = e.response.error;
        }
    }
    //性能测试
    static async doPerfTest(ctx) {
        let ctx_body = ctx.request.body;
        try {
            let req = new apiProxy_1.apitars.PerfTestReq();
            req.lang = ctx_body.lang;
            req.servType = ctx_body.servType;
            req.threads = ctx_body.threads;
            //req.cores = ctx_body.cores;
            req.connCnt = ctx_body.connCnt;
            req.reqFreq = ctx_body.reqFreq;
            req.keepAlive = ctx_body.keepAlive;
            req.pkgLen = ctx_body.pkgLen;
            req.warmUp = ctx_body.warmUp;
            req.memo = ctx_body.memo;
            let ret = await rpc_1.default.apiPrx.doPerfTest(req);
            ctx.body = ret.response.return.toObject();
        }
        catch (e) {
            ctx.body = e.response.error;
        }
    }
    //获取历史数据
    static async getTestHistories(ctx) {
        try {
            let req = new apiProxy_1.apitars.QueryTestHistoryReq();
            req.page = Number(ctx.query.page);
            req.pageSize = Number(ctx.query.pageSize);
            let ret = await rpc_1.default.apiPrx.getTestHistories(req);
            ctx.body = ret.response.return.toObject();
        }
        catch (e) {
            //console.log(e)
            ctx.body = e.response.error;
        }
    }
    //获取详细信息
    static async getTestDetail(ctx) {
        try {
            let testID = Number(ctx.query.testID);
            //let testID=-1
            let timestamp = Number(ctx.query.timestamp);
            let showWarmUp = false;
            if (Number(ctx.query.showWarmUp) === 0) {
                showWarmUp = false;
            }
            else if (Number(ctx.query.showWarmUp) === 1) {
                showWarmUp = true;
            }
            let ret = await rpc_1.default.apiPrx.getTestDetail(testID, timestamp, showWarmUp);
            ctx.body = ret.response.return.toObject();
        }
        catch (e) {
            ctx.body = e.response;
            //||{code: -1, msg: 'rpc error'+ e};
        }
    }
    //查询压测是否已存在
    static async isPerfExists(ctx) {
        let ctx_body = ctx.request.body;
        try {
            let req = new apiProxy_1.apitars.IsPerfExistsReq();
            req.servType = ctx_body.servType;
            let ret = await rpc_1.default.apiPrx.isPerfExists(req);
            ctx.body = ret.response.return.toObject();
        }
        catch (e) {
            ctx.body = e.response.error;
        }
    }
}
exports.default = TestController;
