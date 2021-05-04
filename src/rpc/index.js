const client = require("@tars/rpc/protal.js").client;

const apiProxy = require("./proxy/apiProxy");

const WebConf = require("../config/webConf");

const { RPCClientPrx } = require('./service');

client.initialize(WebConf.client);

module.exports = {
    // RPCClientPrx,

    apiPrx: RPCClientPrx(client, apiProxy, 'taf', 'Patch', 'taf.tafpatch.PatchObj'),
    
    client: client,
};
