var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {

	request('http://sdtimes.com/', function(error, response, html) {

		var $ = cheerio.load(html);

		$('col-md-12 latestnewslist').children().each(function(i, element) {

			console.log('ELEMENT: ', i, ' ', element);

			var title = $(element).children();

			console.log("==================================");
			console.log(title);
			console.log("==================================");
		});

	});

	// res.render('index', {
	// 	title: 'Express'
	// });

	// res.send('respond with a resource');
});

module.exports = router;
