"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = __importDefault(require("../../rpc"));
class TestController {
    static async testFunc(ctx) {
        try {
            let ret = await rpc_1.default.apiPrx.doFuncTest();
            ctx.makeResObj(ret.response.return.toObject());
        }
        catch (e) {
            ctx.makeResObj({ code: -1, msg: 'rpc error' + e });
        }
    }
}
exports.default = TestController;
