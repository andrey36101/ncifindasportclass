var jwt    = require('jsonwebtoken');
function Response() {
    this.handler = function () {
        return function (req, res, next) {
            var resp_handler = new ResponseHandler(req, res);
            resp_handler.start_time = (new Date()).getTime();
            res.sendResponse = resp_handler.sendResponse;
            res.sendError = resp_handler.sendError;
            return next();
        };
    };
    this.authHandler = function (bypassed_paths) {
        return function (req, res, next) {
            var authAccessKey = req.headers.appkey;

            // var path=__lodash.find(bypassed_paths,function(path){
            //  var regex=new RegExp(path,'i');
            //  console.log(path,req.path,req.path.match(regex));
            //  return req.path.match(regex);
            // });
            // if(path === undefined){
            //  // Verify Access Key & Secret Key is passed
            //  if(authAccessKey === '' || authAccessKey === undefined){
            //   var exception=new Exception('InvalidAuthRequest','Application Key missing');
            //   res.sendError(exception);
            //   return;
            //  }
            // }
            req.isLoggedIn = false;
            var token = req.body.token || req.params.token || req.headers['token'];
            if(token){
                jwt.verify(token, global.config.secret, function(err, decoded) {
                    if (err) {
                        next();
                    } else {
                        req.user = decoded;
                        req.isLoggedIn = true;
                        next();
                    }
                });
            } else {
                next();
            }

            // let promise = global.MongoORM.Client.findOne({clientKey:authAccessKey},{password:false});
            // promise.then(function(client){
            // 	let appTenant = JSON.parse(JSON.stringify(client));
            //     req.appTenant = appTenant;
            //  req.defaultGateway = __lodash.find(appTenant.paymentGateways,{isDefault:true});
            //  next();
            //    }).catch(function(error){
            //  req.appTenant = {};
            //  next();
            //    });
        };
    }
}

function ResponseHandler(req, resp) {
    var response = resp;
    this.path = '';
    this.sendResponse = function (resp, not_send_no_records) {
        if (Object.keys(resp).length > 0 || not_send_no_records) {
            var str = Utils.unescape(JSON.stringify(resp));
            str = str.replace(/&<[^>]*>/g, " ");
            str = str.replace(/  /g, "");
            resp = JSON.parse(str);
            response.send({
                Status: "success",
                Data: resp
            });
        }
        else {
            response.send({
                Status: "success",
                Data: resp,
                Message: 'No records found'
            });
        }
    };
    this.sendError = function (e) {
        var err;
        if (e.http_code)
            response.status(e.http_code);
        else
            response.status(400);

        if (e instanceof Exception) {
            err = e.getError();
        } else err = e;
        response.json({
            Status: "failure",
            Error: err
        });
    }
}

module.exports = Response;