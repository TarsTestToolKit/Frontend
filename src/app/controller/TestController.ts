import * as Koa from "koa";
import rpc from '../../rpc';
import { apitars } from "../../rpc/proxy/apiProxy";

export default class TestController {
    //函数测试
    public static async doFuncTest(ctx: Koa.Context) {
        try {
            let ret = await rpc.apiPrx.doFuncTest();
            ctx.body = ret.response.return.toObject();
        }catch(e) {
            ctx.body = e.response.error;
        }
    }
    //性能测试
    public static async doPerfTest(ctx: Koa.Context) {
        let ctx_body:any = ctx.request.body;
        try {
            let req = new apitars.PerfTestReq();
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
            let ret = await rpc.apiPrx.doPerfTest(req);
            ctx.body = ret.response.return.toObject();
        }catch(e) {
            ctx.body = e.response.error;
        }
    }
    //获取历史数据
    public static async getTestHistories(ctx: Koa.Context) {
        try {
            let req = new apitars.QueryTestHistoryReq();
            req.page = Number(ctx.query.page);
            req.pageSize = Number(ctx.query.pageSize);
            let ret = await rpc.apiPrx.getTestHistories(req);
            ctx.body = ret.response.return.toObject();
        }catch(e) {
            //console.log(e)
            ctx.body = e.response.error;
        }
    }
    //获取详细信息
    public static async getTestDetail(ctx: Koa.Context) {
        try {
            
            let testID = Number(ctx.query.testID);
            //let testID=-1
            let timestamp = Number(ctx.query.timestamp);
            
            let showWarmUp:boolean = false
            if(Number(ctx.query.showWarmUp)===0){
                showWarmUp = false
            }else if(Number(ctx.query.showWarmUp)===1){
                showWarmUp = true
            }
            let ret = await rpc.apiPrx.getTestDetail(testID,timestamp,showWarmUp);
            ctx.body = ret.response.return.toObject();
        }catch(e) {
            ctx.body = e.response;
            //||{code: -1, msg: 'rpc error'+ e};
        }
    }
    //查询压测是否已存在
    public static async isPerfExists(ctx: Koa.Context) {
        let ctx_body:any = ctx.request.body;
        try {
            let req = new apitars.IsPerfExistsReq();
            req.servType = ctx_body.servType;
            let ret = await rpc.apiPrx.isPerfExists(req);
            ctx.body = ret.response.return.toObject();
        }catch(e) {
            ctx.body = e.response.error;
        }
    }
}
