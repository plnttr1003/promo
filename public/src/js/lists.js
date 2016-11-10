$(document).ready(function() {
	function remove (event) {
		var id  = $(this).attr('id');

		if (confirm(event.data.description)) {
			$.post(event.data.path, {'id': id}).done(function() {
				location.reload();
			});
		}
	}

	$('.rm_user').on('click', {path:'/auth/users/remove', description: 'Удалить пользователя?'}, remove);
	$('.rm_promo').on('click', {path:'/auth/promo/remove', description: 'Удалить промо?'}, remove);
});