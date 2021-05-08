
import * as Koa from "koa";
import rpc from '../../rpc';
import {apitars} from "../../rpc/proxy/apiProxy";

export default class TestController {

    public static async testFunc(ctx: Koa.Context) {

        try {
            let ret = await rpc.apiPrx.doFuncTest();

            ctx.makeResObj(ret.response.return.toObject());

        }catch(e) {
            ctx.makeResObj({code: -1, msg: 'rpc error' + e});
        }
    }

    public static async testPerf(ctx: Koa.Context) {
        try {
            let req = apitars.PerfTestReq.new().readFromObject(ctx.paramsObj);
            let ret = await rpc.apiPrx.doPerfTest(req);

            ctx.makeResObj(ret.response.return.toObject());

        }catch(e) {
            ctx.makeResObj({code: -1, msg: 'rpc error' + e});
        }
    }
}
