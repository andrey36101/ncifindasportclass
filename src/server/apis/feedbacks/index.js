module.exports = class FeedbackController {

    constructor(app) {


        app.post('/feedback', this.createFeedback);
        app.get('/feedback', this.list);
        app.get('/feedback/:feedbackId', this.feedbackDetail);
        app.put('/feedback/:feedbackId', this.updateFeedback);
        app.delete('/feedback/:feedbackId', this.deleteFeedback)

    }


    createFeedback(req, res) {


        let content = req.body.content,
            ratting = req.body.ratting,
            trainerId  = req.body.trainerId,
            userId = req.body.userId;

        let promise,feedback = new global.MongoORM.Feedback();

        if (content != undefined)
            feedback.set('content', content);

        if (ratting != undefined)
            feedback.set('ratting', ratting);

        if (trainerId != undefined)
            feedback.set('trainerId', trainerId);

        if (userId != undefined)
            feedback.set('userId', userId);


        promise = feedback.save();
        promise.then(function (feedback) {
            res.sendResponse(feedback);
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
        global.MongoORM.Feedback.find({})
            .limit(row)
            .skip(row * pageNo)
            .sort(sort)
            .exec(function (err, feedbacks) {
                global.MongoORM.Feedback.count({}).exec(function (error, count) {
                    if (!error) {
                        res.sendResponse({
                            feedbacks: feedbacks,
                            page: pageNo,
                            pages: Math.round(count / row),
                            totalCount: count
                        })
                    } else res.sendError(error);
                })
            });
    }

    updateFeedback(req, res){

        let feedbackId = req.params.feedbackId,
            content = req.body.content,
            ratting = req.body.ratting,
            trainerId  = req.body.trainerId,
            userId = req.body.userId;


        let promise = global.MongoORM.Feedback.findById(feedbackId);
        promise
            .then(function(feedback){
                if(feedback != null){

                    if(content != undefined)
                        feedback.content = content;
                    if(ratting != undefined)
                        feedback.ratting = ratting;
                    if(trainerId != undefined)
                        feedback.trainerId = trainerId;
                    if(userId != undefined)
                        feedback.userId = userId;

                    return feedback.save();
                } else
                    return res.sendError(new Exception('ObjectNotFound'));
            })
            .then(function(feedback){
                res.sendResponse(feedback);
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

    feedbackDetail(req, res){

        let feedbackId = req.params.feedbackId;


        let promise = global.MongoORM.Feedback.findById(feedbackId)
            .populate('userId',['name','email','address','location','gender','profilePic'])
            .populate('trainerId',['name','email','address','location','gender','profilePic']);
        promise
            .then(function(feedback){
                res.sendResponse(feedback);
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

    deleteFeedback(req,res){
        let id = req.params.feedbackId;
        global.MongoORM.Feedback.findByIdAndRemove(id,function(error){
            if(!error)
                res.send({message:'Feedback removed successfully'});
            else
                res.sendError(error);
        });
    }

};