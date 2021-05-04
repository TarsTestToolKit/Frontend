const logger = require('../logger');

const RPCClientPrx = (communicator, proxy, moduleName, interfaceName, servantName, setInfo) => {
    var module = proxy[moduleName];
    var rpcClient = communicator.stringToProxy(module[interfaceName+'Proxy'], servantName, setInfo);
    for(let p in rpcClient){
        if(!rpcClient.hasOwnProperty(p) && p!='getTimeout' && p!='setTimeout'){
            ((p, fun) => {
                rpcClient[p] = (function(p) {
                    let fnName = p;
                    return async function(...args){
                        try{
                            var _args = args;
                            var rst = await (async ()=>{
                                var result = await fun.apply(rpcClient, _args);
                                // logger.info( 'method: ',fnName, ' request: ', _args, ' response: ', JSON.stringify(result.response));
                                var args = result.response.arguments;
                                var rst = {__return: result.response.return};
                                for(var p in args){
                                    if(typeof args[p] == 'object'){
                                        rst[p] = args[p].toObject();
                                    }else{
                                        rst[p] = args[p];
                                    }
                                }

                                // logger.info( 'method: ',fnName, ' request: ', _args, ' response: ', rst);
                                return rst;
                            })();
                            return rst;
                        } catch (e) {
                            logger.error(e);
                            if(e.response){
                                throw new Error(e.response && e.response.error && e.response.error.message);
                            }else{
                                throw(e);
                            }
                        }
                    };
                })(p);
            })(p, rpcClient[p]);

        }
    }
    return rpcClient;
};

//生成rpc结构体
const RPCStruct = function(proxy, moduleName){
    var module = proxy[moduleName];
    var rpcStruct = {};
    for(var p in module){
        if(module.hasOwnProperty(p)){
            if(typeof module[p] == 'function'){
                if(new module[p]()._classname){
                    rpcStruct[p] = module[p];
                }
            }else{
                rpcStruct[p] = module[p];
            }
        }
    }
    return rpcStruct;
};

module.exports = { RPCClientPrx, RPCStruct };
