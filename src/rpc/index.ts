import { client } from "@tars/rpc";

import { apitars } from "./proxy/apiProxy";

import path from 'path';

// const communicator = Communicator.New();

console.log(process.env);
console.log(path.join(__dirname, '../config/tars.conf'));

if (!process.env.TARS_CONFIG) {
    client.initialize(path.join(__dirname, '../config/tars.conf'));
}

let apiPrx = client.stringToProxy(apitars.apiProxy, 'TarsTestToolKit.BackendApi.apiObj');

export default { apiPrx };

