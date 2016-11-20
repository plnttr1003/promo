function removeItem() {
	var
	dc = document,
	rm_item = document.querySelectorAll('.rm_item');
		rm_item.forEach(function(item){
			item.addEventListener('click', function(event) {
				if (confirm('Удалить?')) {
					var
						requestURL = window.location.pathname + '/remove',
						params='id='+ item.getAttribute('id'),
						request = new XMLHttpRequest();

					request.open("POST", requestURL, true);
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
					request.send(params);

					window.location.reload();
				}
			});
		})
}
(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(removeItem)

