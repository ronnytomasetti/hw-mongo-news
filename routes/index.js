var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

var Article = require('../models/Article');
var Note = require('../models/Note');

/**
 * GET '/' route renders Mongo News homepage
 */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/scrape', function(req, res) {

	request('https://nodesource.com/blog', function(error, response, html) {

		var $ = cheerio.load(html);

		$('article h2').each(function(i, element) {

			var result = {};

			result.title = $(this).children('a').text();
			result.link = "https://nodesource.com" + $(this).children('a').attr('href');

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
	Article.find({}, function(err, doc) {
		if (err)
			console.log(err);
		else
			res.json(doc);
	});
});

module.exports = router;
