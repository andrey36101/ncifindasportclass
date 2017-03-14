module.exports=class AuthController {
	constructor(app){
		app.get('/logout',this.doLogout);
		app.post('/checkLogin',this.checkLogin);
		app.post('/login',this.doLogin);
		app.post('/root',this.createRootuser)
	}
	checkLogin(req, res){
		if (req.session.isLoggedIn == 'Y') {
			res.send({status:'success',data:req.session.userProfile});
		}else{
			res.status(401);
			res.send({});
		}
	}
	createRootuser(req,res){
		let email = req.body.email;
		let password = req.body.password;
		let user = new global.MongoORM.User();
		user.set('email',email);
		user.set('password',Utils.md5(password));
		let promise = user.save();
		promise
			.then(function(user){
				return res.send(user);
			})
			.catch(function(error){
				res.sendError(error)
			})
	}
	doLogin(req,res){
		let email = req.body.email;
		let password = req.body.password;
		let promise = global.MongoORM.Client.find({email:email,password:Utils.md5(password)},{password:false,paymentGateways:false});
		promise
			.then(function(success){
				console.log(success);
				if(success.length>0) {
					req.session.isLoggedIn = 'Y';
					req.session.userProfile = success;
					return res.send({status: "success", data: success});
				}else
					return res.send({status: "failure", message:"Login failed"});

			})
			.catch(function(error){
				return res.send({status: "failure", message:"Login failed"});
			});
	}
	doLogout(req,res){
		req.session.isLoggedIn = 'N';
		req.session.destroy();
		res.send({message:'Logged out!'})
	}
};