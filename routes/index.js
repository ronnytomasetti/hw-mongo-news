var express = require('express');
var router = express.Router();

// Using request and cheerio packages to perform scrape ಠ_ಠ
var request = require('request');
var cheerio = require('cheerio');

// Require Mongoose models
var Article = require('../models/Article');
var Note = require('../models/Note');

/**
 * Renders the homepage.
 */
router.get('/', function(req, res, next) {
	res.render('index');
});

/**
 * Performs scrape using request and cheerio packages.
 * Captures articles title, link and preview then saves to Mongo database.
 */
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


/**
 * Returns all of the articles in Mongo database in JSON format.
 */
router.get('/articles', function(req, res) {

	Article.find({})
		   .exec(function(err, doc) {
			   if (err) {
				   console.log(err);
				   res.status(500).json({
					   success: false,
					   message: "Internal server error. Please try your request again."
				   });
			   }
			   else
			       res.status(200).json(doc);
		   });

});

/**
 * Returns one specific article from database along with all associated [notes] objects.
 */
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

/**
 * Saves new note to Mongo database associated with a given article.
 */
router.post('/articles/:id', function(req, res) {

	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {

		if (err)
			console.log(err);
		else
			Article.findOneAndUpdate({ _id: req.params.id},
				{ $push: { notes:doc._id } },
				{ new: true })
				.exec(function(err, doc){
					if (err)
						console.log(err);
					else
						res.send(doc);
			});
	});
});

/**
 * Removes a single note from Mongo database.
 */
router.delete('/notes/:id', function(req, res) {
	var noteId = req.params.id;

	Note.remove({ '_id': noteId }, function(err) {

		if (err)
			res.status(500).json({
				success: false,
				message: "Error processing request."
			});
		else {
			Article.update({
				notes: noteId
			}, {
				$pull: { notes: noteId }
			}, function(err) {
				if (err)
					res.status(500).json({
						success: false,
						message: 'Failed to delete note.'
					});
				else
					res.status(200).json({
						success: true,
						message: 'Note deleted.'
					});
			});
		}

	});
});

/**
 * Drops all articles from Mongo database.
 */
router.get('/kill-articles', function(req, res) {
	Article.remove({}, function (err) {
		if (err)
			res.status(500).json({
				success: false,
				message: 'Oops, this failed.'
			});
		else
			res.status(200).json({
				success: true,
				message: 'Articles are no longer with us.'
			});
    });
});

/**
 * Drops all notes from Mongo database.
 */
router.get('/kill-notes', function(req, res) {
	Note.remove({}, function (err) {
		if (err)
			res.status(500).json({
				success: false,
				message: 'Oops, this failed.'
			});
		else
			res.status(200).json({
				success: true,
				message: 'Notes have been murdered.'
			});
    });
});

module.exports = router;
