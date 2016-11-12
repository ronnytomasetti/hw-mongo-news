$(document).ready(function() {

	function retrieveNotesAndAppend() {
		$('#saved-notes').empty();

		setTimeout(function() {
			var thisId = $('div.item.fetched-article.active').attr('data-id');

			$.ajax({
					method: "GET",
					url: "/articles/" + thisId,
				})
				.done(function(data) {

					$.each(data.notes, function(index, value) {
						var $noteTitle = $('<p>').addClass('article-note-titles')
												 .text(value.title);

						var $noteBody = $('<p>').addClass('article-note-body')
												.text(value.body);

						var $noteDiv = $('<div>').addClass('article-note-div')
												 .attr('data-note-id', value._id);

						var $noteRemoveBtn = $('<span>').addClass('glyphicon glyphicon-remove note-remove-btn')
														.attr('id', '')
														.attr('aria-hidden', 'true');

						$noteDiv.append('<hr>',
										$noteRemoveBtn,
										$noteTitle,
										$noteBody,
										'<hr>')
								.appendTo('#saved-notes');
					});
				});

		}, 1000);
	}

	$.getJSON('/articles', function(data) {

		for (var i = 0; i < data.length; i++) {

			var $indicator = $('<li>').attr('data-target', '#articles-carousel')
									  .attr('data-slide-to', i);

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

	$('.carousel-control').click(function() {
		retrieveNotesAndAppend();
	});

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
				console.log(data);
				retrieveNotesAndAppend();
			});

		$('#note-title').val("");
		$('#note-body').val("");

		return false;
	});

	$(document).on('click', '.note-remove-btn', function() {
		var noteId = $(this).parent().data('article-id');

		$.ajax({
				method: "DELETE",
				url: "/notes/" + noteId
			})
			.done(function(data) {
				console.log(data);
				retrieveNotesAndAppend();
			});

	});

});
