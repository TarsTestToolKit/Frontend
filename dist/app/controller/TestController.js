"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TestController {
    static async testFunc(ctx) {
        await ctx.redirect("/index.html");
    }
}
exports.default = TestController;
