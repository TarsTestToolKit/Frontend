
import PageController from "./controller/PageController";
import TestController from "./controller/TestController";
import { confType } from "../midware/type";

const pageConf: Array<confType> = [
    //首页
    ["get", "/", PageController, PageController.index],
];

const apiConf: Array<confType> = [
    ["post", "/testFunc", TestController, TestController.testFunc],
    ["post", "/testPerf", TestController, TestController.testPerf],
    ["get", "/histories", TestController, TestController.histories],
    ["get", "/detail", TestController, TestController.detail]
];

export { pageConf, apiConf };