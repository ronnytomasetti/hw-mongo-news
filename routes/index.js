var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

var Article = require('../models/Article');
var Note = require('../models/Note');

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/scrape', function(req, res) {

	request('https://nodesource.com/blog', function(error, response, html) {

		var $ = cheerio.load(html);

		$('article .blog-post').each(function(i, element) {

			var result = {};

			result.title = $(this).children('h2').children('a').text();
			result.link = "https://nodesource.com" + $(this).children('h2').children('a').attr('href');
			result.preview = $(this).children('div').text();

			var entry = new Article(result);

			entry.save(function(err, doc) {
				if (err)
					console.log('Error ', err);
				else
					console.log('Save successful ', doc);
			});

		});
	});

	res.status(200).json({
		success: true,
		message: 'Scrape completed succesfully.'
	});

});

router.get('/articles', function(req, res) {

	Article.find({})
		   .exec(function(err, doc) {
			   if (err)
	   			console.log(err);
				res.status(500).json({
					success: false,
					message: "Internal server error. Please try your request again."
				})
	   		else
	   			res.status(200)json(doc);
		   });

});

router.get('/articles/:id', function(req, res) {

	Article.findOne({ '_id': req.params.id })
	.populate('notes')
	.exec(function(err, doc) {

		if (err)
			console.log(err);
		else
			res.json(doc);
	});

});

router.post('/articles/:id', function(req, res) {

	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {

		if(err)
			console.log(err);
		else
			Article.findOneAndUpdate({ '_id': req.params.id }, {'notes':doc._id})
			.exec(function(err, doc){
				if (err)
					console.log(err);
				else
					res.send(doc);
			});
	});
});

module.exports = router;
