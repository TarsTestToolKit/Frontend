
import * as Koa from "koa";

export default class TestController {

    public static async testFunc(ctx: Koa.Context) {

        await ctx.redirect("/index.html");
    }
}
