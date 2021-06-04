
import { app, initialize } from "../app";
import webConf from '../config/webConf';

const hostname = process.env.HTTP_IP || "0.0.0.0";
const port = process.env.HTTP_PORT || webConf.config.webConf.port;

initialize().then(() => {
    app.listen(port as number, hostname, () => {
        console.log(`server listening at ${hostname}:${port}`);
    });
});

