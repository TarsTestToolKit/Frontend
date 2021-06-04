"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const webConf_1 = __importDefault(require("../config/webConf"));
const hostname = process.env.HTTP_IP || "0.0.0.0";
const port = process.env.HTTP_PORT || webConf_1.default.config.webConf.port;
app_1.initialize().then(() => {
    app_1.app.listen(port, hostname, () => {
        console.log(`server listening at ${hostname}:${port}`);
    });
});
