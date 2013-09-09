var search = require('../search');

exports.init = function(app){
	
	app.post('/api/index', function(req, res){
		var doc = {
			id: req.userId + req.body.query, 
			query: req.body.query, 
			address: req.body.address
		};
		search.index(req.userId, doc, function(err){
			if (err){
				console.log(err);
				return res.send(500);
			}
			res.send(201);
		});
	});

	app.get('/api/search', function(req, res){
		
		search.search(req.userId, req.query.query, function(err, docs){
			if (err){
				console.log(err);
				return res.send(500);
			}	
			res.send(docs);
		})
	})
}