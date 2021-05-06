import { Communicator } from "@tars/rpc";

import { apitars } from "./proxy/apiProxy";

import path from 'path';

const communicator = Communicator.New();
communicator.initialize(path.join(__dirname, '../config/tars.conf'));

let apiPrx = communicator.stringToProxy(apitars.apiProxy, 'TarsTestToolKit.BackendApi.apiObj');

export default { apiPrx };

