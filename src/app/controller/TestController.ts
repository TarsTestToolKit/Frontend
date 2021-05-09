
import * as Koa from "koa";
import rpc from '../../rpc';

export default class TestController {

    public static async testFunc(ctx: Koa.Context) {

        try {
            let ret = await rpc.apiPrx.doFuncTest();

            //ctx.makeResObj(ret.response.return.toObject());
            ctx.body = ret.response.return.toObject();

        }catch(e) {
            ctx.makeResObj({code: -1, msg: 'rpc error' + e});
        }
    }
}
