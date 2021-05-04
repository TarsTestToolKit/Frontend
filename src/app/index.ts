
import PageController from "./controller/PageController";
import LocaleController from "./controller/LocaleController";
import TestController from "./controller/TestController";
import { confType } from "../midware/type";

const pageConf: Array<confType> = [
    //首页
    ["get", "/", PageController, PageController.index],
    // ["get", "/refresh", TreeController, TreeController.refresh],
];

const apiConf: Array<confType> = [
    ["get", "/get_locale", LocaleController, LocaleController.getLocale],
    ["post", "/testFunc", TestController, TestController.testFunc],
    // ["get", "/view", TreeController, TreeController.view],
    // ["get", "/search", TreeController, TreeController.search]
];

export { pageConf, apiConf };