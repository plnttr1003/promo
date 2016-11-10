$(document).ready(function() {
	var columns_main_scrollerrus = $('.columns_main_scrollerrus').width();
	$('.header_block').css({'right':columns_main_scrollerrus});
	$('.content_column.scroll').css({'margin-left': '320' - columns_main_scrollerrus + 'px'});
	$('.columns_main_inner_block_inner').css({'margin-left': - (columns_main_scrollerrus/2) });
	$('.content_column.scroll').css({'right':columns_main_scrollerrus});
	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', {search: result}).done(function(data) {
				data.events.length == 0 && data.exhibits.length == 0
					? $('.search_result').hide()
					: $('.search_result').show();

				$('.search_context').hide().children('.context_results_block').empty();

				data.exhibits.forEach(function(exhibit) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/exhibits/' + exhibit._id, 'text': exhibit.title[0].value});
					$('.search_context.exhibits').show().children('.context_results_block').append(context_result);
				});

				data.events.forEach(function(event) {
					var context_result = $('<a/>', {'class': 'context_result', 'href': '/events/' + event.type + '/' + event._id, 'text': event.title[0].value});
					$('.search_context.events').show().children('.context_results_block').append(context_result);
				});
			});
		}
	};

	$('.search_input')
	.on('keyup change', function(event) {
		search.val = $(this).val();
	})
	.on('focusin', function(event) {
		search.interval = setInterval(function() {
			search.checkResult.call(search);
		}, 1000);
	})
	.on('focusout', function(event) {
		clearInterval(search.interval);
	});


	$('.option.search').on('click', function(event) {
		$('.search_block').toggle().find('.search_input').focus();
	});

	$('.navigate_item').on('click', function() {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$(this).addClass('selected');
		} else {
			$(this).removeClass('selected');
		}
	});

	$('.block').css('color', '#B8B8B8').on('click', function(event) {
		event.preventDefault();
	});

	$(document).on('mouseup', function(event) {
		var container = $('.search_block');

		if (!container.is(event.target)
				&& container.has(event.target).length === 0)
		{
				container.hide();
		}
	});
});