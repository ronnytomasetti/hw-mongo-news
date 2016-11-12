$(document).ready(function() {

	function retrieveNotesAndAppend() {
		setTimeout(function() {
			var thisId = $('div.item.fetched-article.active').attr('data-id');

			$.ajax({
					method: "GET",
					url: "/articles/" + thisId,
				})
				.done(function(data) {

					console.log("NOTE DATA: ", data);

					$('#notes').append('<h2>' + data.title + '</h2>');
					$('#notes').append('<input id="titleinput" name="title" >');
					$('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
					$('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

					if (data.note) {
						$('#titleinput').val(data.note.title);
						$('#bodyinput').val(data.note.body);
					}

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
		$('#saved-notes').empty();
		retrieveNotesAndAppend();
	});

	$('#save-note-btn').click(function(e) {
		e.preventDefault();

		var thisId = $('div.item.fetched-article.active').attr('data-id');

		console.log('ID: ', thisId);

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
				$('#saved-notes').empty();
				retrieveNotesAndAppend();
			});

		$('#note-title').val("");
		$('#note-body').val("");

		return false;
	});

});
