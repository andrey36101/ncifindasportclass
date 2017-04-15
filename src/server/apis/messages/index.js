module.exports = class MessageController {

    constructor(app) {


        app.post('/messages', this.createMessages);
        app.get('/messages', this.list);
        app.get('/messages/:messageId', this.messageDetail);
        app.put('/messages/:messageId', this.updateMessage);

    }


    createMessages(req, res) {


        let title = req.body.title,
            description = req.body.description,
            senderId  = req.body.senderId,
            recipientId = req.body.recipientId;


        let promise,message = new global.MongoORM.Message();

        if (message != undefined)
            message.set('title', title);

        if (description != undefined)
            message.set('description', description);

        if (senderId != undefined)
            message.set('senderId', senderId);

        if (recipientId != undefined)
            message.set('recipientId', recipientId);


        promise = message.save();
        promise.then(function (message) {
            res.sendResponse(message);
        }).catch(function (error) {
            res.sendError(error);
        })

    }


    list(req, res) {

        let row = req.query.rows ? parseInt(req.query.rows) : 3;
        let pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 0;
        let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
        let sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';
        let sort = {};

        sort[sortBy] = sortOrder;
        global.MongoORM.Message.find({})
            .limit(row)
            .skip(row * pageNo)
            .sort(sort)
            .exec(function (err, messages) {
                global.MongoORM.Message.count({}).exec(function (error, count) {
                    if (!error) {
                        res.send({
                            messages: messages,
                            page: pageNo,
                            pages: Math.round(count / row),
                            totalCount: count
                        })
                    } else res.sendError(error);
                })
            });
    }

    updateMessage(req, res){

        let messageId = req.params.messageId,
            title = req.body.title,
            description = req.body.description,
            senderId  = req.body.senderId,
            recipientId = req.body.recipientId;


        let promise = global.MongoORM.Message.findById(messageId);
        promise
            .then(function(message){
                if(message != null){

                    if(title != undefined)
                        message.title = title;
                    if(description != undefined)
                        message.description = description;
                    if(senderId != undefined)
                        message.senderId = senderId;
                    if(recipientId != undefined)
                        message.recipientId = recipientId;

                    return message.save();
                } else
                    return res.sendError(new Exception('ObjectNotFound'));
            })
            .then(function(message){
                res.sendResponse(message);
            })
            .catch(function(error){
                let errors = [];
                if(error.name == 'ValidationError'){
                    Object.keys(error.errors).forEach(function(field){
                        let eObj = error.errors[field].properties;
                        if(eObj.hasOwnProperty("message"))
                            errors.push(eObj['message']);
                    });
                } else if(error.name == 'MongoError'){
                    errors.push(error);
                } else
                    errors.push('Internal server error.');
                res.sendError(errors);
            });

    }

    messageDetail(req, res){

        let messageId = req.params.messageId;


        let promise = global.MongoORM.Message.findById(messageId);
        promise
            .then(function(message){
                res.sendResponse(message);
            })
            .catch(function(error){
                let errors = [];
                if(error.name == 'ValidationError'){
                    Object.keys(error.errors).forEach(function(field){
                        let eObj = error.errors[field].properties;
                        if(eObj.hasOwnProperty("message"))
                            errors.push(eObj['message']);
                    });
                } else if(error.name == 'MongoError'){
                    errors.push(error);
                } else
                    errors.push('Internal server error.');
                res.sendError(errors);
            });

    }

};