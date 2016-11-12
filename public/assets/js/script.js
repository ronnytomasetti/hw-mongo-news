$(document).ready(function() {

	/**
	 * Used to retrieve notes from Mongo database using an AJAX call
	 * and append them to the saved notes div with id #saved-notes.
	 * Will empty out the saved notes div before appending data.
	 *
	 * @method retrieveNotesAndAppend
	 * @return
	 */
	function retrieveNotesAndAppend() {

		setTimeout(function() {
			var thisId = $('div.item.fetched-article.active').attr('data-id');

			$.ajax({
					method: "GET",
					url: "/articles/" + thisId,
				})
				.done(function(data) {

					$('#saved-notes').empty();

					$.each(data.notes, function(index, value) {
						var $noteTitle = $('<h4>').addClass('article-note-titles text-uppercase')
												 .html('<strong>' + value.title + '</strong>');

						var $noteBody = $('<p>').addClass('article-note-body')
												.text(value.body);

						var $noteRemoveBtn = $('<a>').addClass('btn btn-xs btn-danger btn-block note-remove-btn')
													 .html('DELETE');

						var $noteDiv = $('<div>').addClass('article-note-div')
 												 .attr('data-note-id', value._id);

						$noteDiv.append('<hr>',
										$noteTitle,
										$noteBody,
										$noteRemoveBtn,
										'<hr>')
								.appendTo('#saved-notes');
					});
				});

		}, 1000);
	}

	/**
	 * Called when the document is ready to get all articles from Mongo database
	 * using jQuery $.getJSON() function. Will then create the article slide and
	 * append the article to the carousel. Once the articles are added to the
	 * carousel, this will end with a call to retrieveNotesAndAppend() function.
	 *
	 */
	$.getJSON('/articles', function(data) {

		for (var i = 0; i < data.length; i++) {

			var $indicator = $('<li>').attr('data-target', '#articles-carousel')
									  .attr('data-slide-to', i)
									  .addClass('slide-indicator');

			if (i === 0)
				$indicator.addClass('active');

			var $title = $('<h2>').addClass('article-title')
								 .text(data[i].title);

			var $preview = $('<p>').addClass('article-preview')
								   .html(data[i].preview);

			var $link = $('<a>').attr('href', data[i].link)
								.attr('role', 'button')
								.attr('target', '_blank')
								.addClass('btn btn-md btn-danger')
								.html('READ FULL STORY');

			var $articleCol = $('<div>').addClass('col-sm-12 text-center');
			var $articleRow = $('<div>').addClass('row');

			var $article = $('<div>').addClass('item')
									 .addClass('fetched-article')
									 .attr('data-id', data[i]._id);

		 	if (i === 0)
 				$article.addClass('active');

			$articleCol.append($title, $preview, $link);
			$articleRow.append($articleCol);

			$article.append($articleRow);

			$('.carousel-indicators').append($indicator);
			$('.carousel-inner').append($article);
		}

		retrieveNotesAndAppend();
	});

	/**
	 * Call retrieveNotesAndAppend() function is one of the carousel controls
	 * are clicked and moves to the next article slide. Probably not the best
	 * way to do this but it works for now.
	 */
	$('.carousel-control').click(function() {
		retrieveNotesAndAppend();
	});

	/**
	 * Called when the save note button is clicked. Make an POST AJAX call to
	 * save the new note to the Mongo database.
	 */
	$('#save-note-btn').click(function(e) {
		e.preventDefault();

		var thisId = $('div.item.fetched-article.active').attr('data-id');

		$.ajax({
				method: "POST",
				url: "/articles/" + thisId,
				data: {
					title: $('#note-title').val(),
					body: $('#note-body').val(),
					article: thisId
				}
			})
			.done(function(data) {
				retrieveNotesAndAppend();
			});

		$('#note-title').val("");
		$('#note-body').val("");

		return false;
	});

	/**
	 * Called whenever a notes delete button is pressed. Makes an AJAX call
	 * using method DELETE to the notes resource in order to remove note.
	 * I think I have a bug with the Article notes array I think but for now
	 * this removes the note from the Note collection so it works.
	 */
	$(document).on('click', '.note-remove-btn', function() {
		var noteId = $(this).parent().data('note-id');

		$.ajax({
				method: "DELETE",
				url: "/notes/" + noteId
			})
			.done(function(data) {
				retrieveNotesAndAppend();
			});

	});

	/**
	 * This allows me to handle loading the notes in the event the indicator
	 * is pressed instead of the slide left/right controls. Calls the function
	 * retrieveNotesAndAppend() to get notes for current active article.
	 */
	$(document).on('click', '.slide-indicator', function() {
		retrieveNotesAndAppend();
	});

});
