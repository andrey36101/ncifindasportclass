let ObjectId = require('mongodb').ObjectID;
module.exports = class SportController {

    constructor(app) {


        app.post('/api/sports', this.createSports);
        app.get('/api/sports', this.list);
        app.get('/api/sports/:sportId', this.sportDetail);
        app.put('/api/sports/:sportId/address', this.updateUserAddress);
        app.put('/api/sports/:sportId', this.updateSport);
        app.delete('/api/sports/:sportId',this.deleteSport);

    }


    createSports(req, res) {


        let name = req.body.name,
            description = req.body.description,
            ownerId  = req.body.ownerId,
            startDate = req.body.startDate,
            startTime = req.body.startTime,
            location = req.body.location,
            age = req.body.age,
            price = req.body.price,
            tags = req.body.tags,
            address = req.body.address,
            prompPicture = req.body.prompPicture;

        if(req.user)
            ownerId = req.user._id;

        let addressSchema = {},
            sport = new global.MongoORM.Sport();


        if (address != undefined) {
            if (address.address1 != undefined)
                addressSchema['address1'] = address.address1;
            if (address.address2 != undefined)
                addressSchema['address2'] = address.address2;
            if (address.city != undefined)
                addressSchema['city'] = address.city;
            if (address.state != undefined)
                addressSchema['state'] = address.state;
            if (address.zipcode != undefined)
                addressSchema['zipcode'] = address.zipcode;
            if (address.country != undefined)
                addressSchema['country'] = address.country;
            if (address.phone != undefined)
                addressSchema['phone'] = address.phone;
        }

        if (name != undefined)
            sport.set('name', name);

        if (description != undefined)
            sport.set('description', description);

        if (ownerId != undefined)
            sport.set('ownerId', ownerId);

        if (startDate != undefined)
            sport.set('startDate', birthdate);

        if (startTime != undefined)
            sport.set('startTime', gender);

        if (location != undefined)
            sport.set('location', location);

        if (age != undefined)
            sport.set('age', age);

        if (price != undefined)
            sport.set('price', price);

        if (tags != undefined)
            sport.set('tags', tags);

        if (prompPicture != undefined)
            sport.set('prompPicture', prompPicture);

        sport.set('isActive', true);

        if (address)
            sport.set('address', addressSchema);


        global.MongoORM.User.findById(ownerId).then(function (user) {
            if(user==null)
                throw new Exception('ObjectNotFound')
            if(user.type == 'trainer')
                return user;
            else
                throw new Exception('OnlyTrainerAllowed')
        }).then(function (user) {
            return sport.save();
        }).then(function (sport) {
            res.sendResponse(sport);
        }).catch(function (error) {
            res.sendError(error);
        })


    }


    list(req, res) {

        let row = req.query.rows ? parseInt(req.query.rows) : 10;
        let pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 0;
        let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
        let sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';

        let filter = {};

        let name = req.query.name,
            description = req.query.description,
            ownerId  = req.query.ownerId ,
            startDate = req.query.startDate,
            address = req.query.address,
            age = req.query.age,
            price = req.query.price,
            tags = req.query.tags,
            address1 = req.query.address1,
            address2 = req.query.address2,
            city = req.query.city,
            state = req.query.state,
            zipcode = req.query.zipcode,
            country = req.query.country,
            phone = req.query.phone;

        if(name!=undefined)
            filter['name'] =  new RegExp(name.trim(), 'gi');
        if(description!=undefined)
            filter['description'] = new RegExp(description.trim(), 'gi');
        if(ownerId !=undefined)
            filter['ownerId'] = ObjectId(ownerId) ;
        if(startDate!=undefined)
            filter['startDate'] = startDate;
        if(age!=undefined)
            filter['age'] = { $lte: parseInt(age)};
        if(price!=undefined)
            filter['price'] = { $lte: parseInt(price)};
        if(tags!=undefined)
            filter['tags'] = { "$in" : tags.split(",")};

        if(address1!=undefined)
            filter["address.address1"] = new RegExp(address1.trim(),'i');
        if(address2!=undefined)
            filter["address.address2"] = new RegExp(address2.trim(),'i');;
        if(city!=undefined)
            filter["address.city"] = new RegExp(city.trim(),'i');
        if(state!=undefined)
            filter["address.state"] = new RegExp(state.trim(),'i');
        if(zipcode!=undefined)
            filter["address.zipcode"] = new RegExp(zipcode.trim(),'i');
        if(country!=undefined)
            filter["address.country"] = new RegExp(country.trim(),'i');
        if(phone!=undefined)
            filter["address.phone"] = phone;

        let sort = {};

        sort[sortBy] = sortOrder;
        global.MongoORM.Sport.find(filter)
            .populate('ownerId',['name','email','address','location','gender','profilePic'])
            .limit(row)
            .skip(row * pageNo)
            .sort(sort)
            .exec(function (err, sports) {
                global.MongoORM.Sport.count(filter).exec(function (error, count) {
                    if (!error) {
                        res.send({
                            sports: sports,
                            page: pageNo,
                            pages: Math.round(count / row),
                            totalCount: count
                        })
                    } else res.sendError(error);
                })
            });
    }

    updateSport(req, res){

        let sportId = req.params.sportId,
            name = req.body.name,
            description = req.body.description,
            ownerId  = req.body.ownerId,
            startDate = req.body.startDate,
            startTime = req.body.startTime,
            location = req.body.location,
            age = req.body.age,
            price = req.body.price,
            tags = req.body.tags,
            prompPicture = req.body.prompPicture;


        let promise = global.MongoORM.Sport.findById(sportId);
        promise
            .then(function(sport){
                if(sport != null){

                    if(name != undefined)
                        sport.name = name;
                    if(description != undefined)
                        sport.description = description;
                    if(ownerId != undefined)
                        sport.ownerId = ownerId;
                    if(startDate != undefined)
                        sport.startDate = startDate;
                    if(startTime != undefined)
                        sport.startTime = startTime;
                    if(age != undefined)
                        sport.age = age;
                    if(location != undefined)
                        sport.location = location;
                    if(price != undefined)
                        sport.price = price;
                    if(tags != undefined)
                        sport.tags = tags;
                    if(location != undefined)
                        sport.location = location;
                    if(prompPicture != undefined)
                        sport.prompPicture = prompPicture;
                    return sport.save();
                } else
                    return res.sendError(new Exception('ObjectNotFound'));
            })
            .then(function(sport){
                res.send(sport);
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

    sportDetail(req, res){

        let sportId = req.params.sportId;


        let promise = global.MongoORM.Sport.findById(sportId)
            .populate('ownerId',['name','email','address','location','gender','profilePic']);
        promise
            .then(function(sport){
                res.send(sport);
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

    updateUserAddress(req, res){

        let sportId = req.params.sportId,
            address1  = req.body.address1,
            address2  = req.body.address2,
            city      = req.body.city,
            state     = req.body.state,
            country   = req.body.country,
            zipcode   = req.body.zipcode,
            phone     = req.body.phone;

        global.MongoORM.Sport.findById(sportId, function(error, sport){
            if(!error){
                let address = {};
                if(sport.address == null){
                    if(address1 != undefined)
                        address['address1'] = address1;
                    if(address2 != undefined)
                        address['address2'] = address2;
                    if(city != undefined)
                        address['city'] = city;
                    if(state != undefined)
                        address['state'] = state;
                    if(country != undefined)
                        address['country'] = country;
                    if(zipcode != undefined)
                        address['zipcode'] = zipcode;
                    if(phone != undefined)
                        address['phone'] = phone;

                    sport['address'] = address;
                } else {

                    if(address1 != undefined)
                        sport.address['address1'] = address1;
                    if(address2 != undefined)
                        sport.address['address2'] = address2;
                    if(city != undefined)
                        sport.address['city'] = city;
                    if(state != undefined)
                        sport.address['state'] = state;
                    if(country != undefined)
                        sport.address['country'] = country;
                    if(zipcode != undefined)
                        sport.address['zipcode'] = zipcode;
                    if(phone != undefined)
                        sport.address['phone'] = phone;
                }
                sport.save();
                res.sendResponse(sport)
            } else res.sendError(error);
        });
    }

    deleteSport(req,res){
        let id = req.params.sportId;
        global.MongoORM.Sport.findByIdAndRemove(id,function(error){
            if(!error)
                res.send({message:'Sport removed successfully'});
            else
                res.sendError(error);
        });
    }

};