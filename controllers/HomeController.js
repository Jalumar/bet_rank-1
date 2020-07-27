module.exports = {
	
	index: function(req,res,next){
		// var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  		// console.dir(`Es esta ${req.ip}`);
		res.render('home',{
			isAuthenticated : req.isAuthenticated(),
			user : req.user
		});
	}
};