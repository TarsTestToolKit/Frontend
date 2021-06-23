
import PageController from "./controller/PageController";
import TestController from "./controller/TestController";
import { confType } from "../midware/type";

const pageConf: Array<confType> = [
    //首页
    ["get", "/", PageController, PageController.index],
];

const apiConf: Array<confType> = [
    ["post", "/doFuncTest", TestController, TestController.doFuncTest],
    ["post", "/doPerfTest", TestController, TestController.doPerfTest],
    ["get", "/getTestHistories", TestController, TestController.getTestHistories],
    ["get", "/getTestDetail", TestController, TestController.getTestDetail],
    ["post", "/isPerfExists", TestController, TestController.isPerfExists]
];

export { pageConf, apiConf };
