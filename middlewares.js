var uuid = require('node-uuid');


exports.initUser = function (req, res, next){
	var userId = req.cookies.user;
	if(!userId){
		userId = uuid.v4();
		res.cookie('user', userId);
	}
	
	req.userId = userId;
	next();
}