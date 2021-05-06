import Koa from "koa";
import * as path from "path";
import fs from 'fs-extra';
import bodyparser from "koa-bodyparser";
import staticRouter from "koa-static";
import helmet from "koa-helmet";
import { pageRouter, apiRouter} from "./midware";

import webConf from './config/webConf';

const app = new Koa();

//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;

// error handler
// onerror(app);

const appInitialize = () => {

    //安全防护
    app.use(helmet());

    app.use(bodyparser());

    app.use(staticRouter(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));

    app.use(pageRouter.routes());
    app.use(apiRouter.routes());
};

const initialize = async () => {

    const dbPath = path.join(__dirname, "./config/config.json");

    Object.assign(webConf.config, JSON.parse(fs.readFileSync(dbPath, 'utf-8')));

    console.log(webConf);

    appInitialize();
};

export {app, initialize};