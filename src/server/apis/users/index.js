module.exports = class UserController {

    constructor(app) {


        app.post('/user', this.createUser);
        app.get('/user', this.list);
        app.put('/user/:userId', this.updateUser);
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
        user.set('isActive', false);

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

    doLogin(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        let promise = global.MongoORM.Client.find({email: email, password: Utils.md5(password)}, {
            password: false,
            paymentGateways: false
        });
        promise
            .then(function (success) {
                console.log(success);
                if (success.length > 0) {
                    req.session.isLoggedIn = 'Y';
                    req.session.userProfile = success;
                    return res.send({status: "success", data: success});
                } else
                    return res.send({status: "failure", message: "Login failed"});

            })
            .catch(function (error) {
                return res.send({status: "failure", message: "Login failed"});
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


};