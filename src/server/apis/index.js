/*
 Endpoints which don't require authentication
 */
let byPassedEndpoints = [
    '/api/checkLogin',
    '^/api/user',
    '^/api/login',
    '^/api/sports'
];
// '^/api/sports',
//     '^/api/messages',
//     '^/api/feedback',
//     '^/api/login'
let fs = require('fs');
module.exports = class Modules {
    constructor(app) {
        // Configure local auth check
        app.use((req, res, next)=> {
            if(req.isLoggedIn){
                next();
            } else {
                byPassedEndpoints.forEach(function (path) {
                    let regex = new RegExp(path, 'i');
                    if (req.path.match(regex)) {
                        next();
                    }
                });
            }
        });
        this.setupRoutes(app);
    }

    setupRoutes(app) {
        fs.readdirSync(__dirname + '/').filter(function (file) {
            var stats = fs.statSync(__dirname + '/' + file);
            return (file.indexOf('.') !== 0 && stats.isDirectory());
        }).forEach(function (file) {
            let tmpRoute = require(__dirname + '/' + file);
            new tmpRoute(app);
        });
    }
};