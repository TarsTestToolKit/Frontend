"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("@tars/rpc");
const apiProxy_1 = require("./proxy/apiProxy");
const path_1 = __importDefault(require("path"));
// const communicator = Communicator.New();
console.log(process.env);
console.log(path_1.default.join(__dirname, '../config/tars.conf'));
if (!process.env.TARS_CONFIG) {
    rpc_1.client.initialize(path_1.default.join(__dirname, '../config/tars.conf'));
}
let apiPrx = rpc_1.client.stringToProxy(apiProxy_1.apitars.apiProxy, 'TarsTestToolKit.BackendApi.apiObj');
exports.default = { apiPrx };
