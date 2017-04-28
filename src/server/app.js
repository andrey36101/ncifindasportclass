let express      = require('express');
let app          = express();
global.Utils     = require('./libs/utils.js');
global.ROOT_PATH = __dirname;
const config       = require('./config/environments');
global.config    = config;
global.__lodash = require('lodash');
const path         = require('path');
const fs =require('fs');
let index=fs.readFileSync(path.join(ROOT_PATH,'..','public','index.html'));
//Configure application

app.set('superSecret', config.secret);
require('./config/mongo');
require('./config/express')(app);


app.post('/uploadfiles', global.upload.array('file'), function(req, res){

    let attachedFiles = [];
    __lodash.forEach(req.files, function(value, key){
        try{
            fs.renameSync(value.path, path.join(path.join(config.root, 'uploads'), value.originalname));
            attachedFiles.push({
                'path':value.path,
                'fileName':value.originalname,
                'contentType':value.mimetype
            });
        } catch(err){
            res.sendError(err);
        }
    });
    console.log(attachedFiles);
    res.sendResponse(attachedFiles);
});

app.all('/api', (req, res)=> {
    res.send({"title":"Api Server running"});
});
let Api=require('./apis');
new Api(app);
app.all('/*', (req, res)=> {
    res.sendError(new Exception('ObjectNotFound','Endpoint not found'));
});
module.exports = app;