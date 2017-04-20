let jwt    = require('jsonwebtoken');

module.exports = class UserController {

    constructor(app) {

        this.app = app;
        app.post('/login',this.doLogin);
        app.post('/user', this.createUser);
        app.get('/user', this.list);
        app.put('/user/:userId', this.updateUser);
        app.get('/user/:userId', this.userDetail);
        app.put('/user/:userId/address', this.updateUserAddress);
        app.put('/user/:userId', this.deleteUser);
        app.get('/checkLogin',this.checkLogin);

    }


    createUser(req, res) {


        let email = req.body.email,
            name = req.body.name,
            password = req.body.password,
            birthdate = req.body.birthdate,
            gender = req.body.gender,
            location = req.body.location,
            type = req.body.type,
            address = req.body.address,
            profilePic = req.body.profilePic;

        let addressSchema = {}, promise,
            user = new global.MongoORM.User();


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
            user.set('name', name);

        if (email != undefined)
            user.set('email', email);

        if (password != undefined)
            user.set('password', Utils.md5(password));

        if (birthdate != undefined)
            user.set('birthdate', birthdate);

        if (gender != undefined)
            user.set('gender', gender);

        if (location != undefined)
            user.set('location', location);

        if (type != undefined)
            user.set('type', type);

        if (profilePic != undefined)
            user.set('profilePic', profilePic);

        user.set('registrationDate', new Date());
        user.set('isActive', true);

        if (address)
            user.set('address', addressSchema);

        promise = user.save();
        promise
            .then(function (usr) {
                res.sendResponse(usr);
            })
            .catch(function (error) {
                let errors = [];
                if (error.name == 'ValidationError') {
                    console.log(error);
                    Object.keys(error.errors).forEach(function (field) {
                        let eObj = error.errors[field];
                        if (eObj.hasOwnProperty("message"))
                            errors.push(eObj['message']);
                    });
                } else if (error.name == 'MongoError') {
                    errors.push(error);
                } else
                    errors.push('Internal server error.');
                res.sendError(errors);
            })

    }

    checkLogin(req,res){
        jwt.verify(token, global.config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    code: 401,
                    message: 'Not logged int'
                });
            } else {
                req.user = decoded;
                return res.sendResponse(req.user);
            }
        });
    }

    doLogin(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        let promise = global.MongoORM.User.findOne({email: email, password: Utils.md5(password)});
        promise
            .then(function (success) {

                if (success != null) {
                    let token = jwt.sign(success, global.config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    return res.sendResponse({token:token});
                } else
                    return res.sendError({message: "Login failed"});
            })
            .catch(function (error) {
                console.log(error);
                return res.sendError({ message: "Login failed"});
            });
    }

    list(req, res) {

        let row = req.query.rows ? parseInt(req.query.rows) : 3;
        let pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 0;
        let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
        let sortOrder = req.query.sortOrder ? req.query.sortOrder : 'desc';
        let sort = {};

        sort[sortBy] = sortOrder;
        global.MongoORM.User.find({})
            .limit(row)
            .skip(row * pageNo)
            .sort(sort)
            .exec(function (err, users) {
                global.MongoORM.User.count({}).exec(function (error, count) {
                    if (!error) {
                        res.send({
                            users: users,
                            page: pageNo,
                            pages: Math.round(count / row),
                            totalCount: count
                        })
                    } else res.sendError(error);
                })
            });
    }

    updateUser(req, res){

        let userId = req.params.userId,
            name = req.body.name,
            birthdate = req.body.birthdate,
            gender = req.body.gender,
            location = req.body.location,
            profilePic = req.body.profilePic;


        let promise = global.MongoORM.User.findById(userId);
        promise
            .then(function(user){
                if(user != null){

                    if(name != undefined)
                        user.name = name;
                    if(birthdate != undefined)
                        user.birthdate = birthdate;
                    if(gender != undefined)
                        user.gender = gender;
                    if(location != undefined)
                        user.location = location;
                    if(profilePic != undefined)
                        user.profilePic = profilePic;

                    return user.save();
                } else
                    return res.sendError(new Exception('ObjectNotFound'));
            })
            .then(function(user){
                res.send(user);
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

    userDetail(req, res){

        let userId = req.params.userId;


        let promise = global.MongoORM.User.findById(userId);
        promise
            .then(function(user){
                res.send(user);
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

        let userId = req.params.userId,
            address1  = req.body.address1,
            address2  = req.body.address2,
            city      = req.body.city,
            state     = req.body.state,
            country   = req.body.country,
            zipcode   = req.body.zipcode,
            phone     = req.body.phone;

        global.MongoORM.User.findById(userId, function(error, user){
            if(!error){

                let address = {};
                if(user.address == null){

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

                    user['address'] = address;
                } else {
                    if (address1 != undefined)
                        user.address['address1'] = address1;
                    if (address2 != undefined)
                        user.address['address2'] = address2;
                    if (city != undefined)
                        user.address['city'] = city;
                    if (state != undefined)
                        user.address['state'] = state;
                    if (country != undefined)
                        user.address['country'] = country;
                    if (zipcode != undefined)
                        user.address['zipcode'] = zipcode;
                    if (phone != undefined)
                        user.address['phone'] = phone;
                }
                user.save();
                res.sendResponse(user)
            } else res.sendError(error);
        });
    }

    deleteUser(req,res){
        let id = req.params.userId;
        global.MongoORM.User.findByIdAndRemove(id,function(error){
            if(!error)
                res.send({message:'User removed successfully'});
            else
                res.sendError(error);
        });
    }

};