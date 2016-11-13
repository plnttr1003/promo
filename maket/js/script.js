var
	dc = document;

function init() {
	appendOnClick();
}

function createBlock(className, item, params) {
	var
		container = dc.querySelectorAll('.container')[0],
		contentBlockLength = dc.querySelectorAll('.content-block').length,
		contentBlock = dc.createElement('div'),
		contentBlockInner = dc.createElement((params && params.container) ? params.container : 'div'),
		sideElements = dc.querySelectorAll('.side_elements')[0],
		timestamp = Date.now(),
		newItem;

	newItem = item.cloneNode(true);
	newItem.setAttribute('data-id', '_' + timestamp);
	newItem.className = 'side_item selected';
	sideElements.appendChild(newItem);

	contentBlock.className = 'content-block ' + className + '_block';
	contentBlock.setAttribute('id', '_' + timestamp);
	//contentBlock.style.order = contentBlockLength + 1;
	contentBlock.setAttribute('style','order:' + (contentBlockLength + 1) +';')

	container.appendChild(contentBlock);
	//console.log(params);

	contentBlockInner.textContent = ((params && params.content)) ? params.content : 'Содержание';
	contentBlockInner.className = className + ' content-block-inner _editable';
	contentBlockInner.setAttribute('data-type', ((params && params.content)) ? params.type : '');
	contentBlockInner.setAttribute('contenteditable','');

	contentBlock.appendChild(contentBlockInner);

	sortableMenu(dc, sideElements, contentBlock);
	showEditor(dc, contentBlock, contentBlockInner, timestamp);
}

function addElement(item, i) {
	var
		blockType = item.dataset.blockType,
		blockData;
	console.log('------------------');

	switch (blockType) {
		case 'kassa-header':
			blockData = {container : 'div', type : 'div', multiple : false, content : '###'};
			break;
		case 'title':
			console.log('title');
			blockData = {container : 'div', type : 'uploaderOrText', multiple : false, content : 'Заголовок'};
			break;
		case 'subtitle':
			console.log('subtitle');
			blockData = {container : 'div', type : 'uploaderOrText', multiple : false, content : 'Подзаголовок'};
			break;
		case 'upper-slider':
			console.log('upper-slider');
			blockData = {container : 'div', type : 'slider', multiple : true, content : 'Верхний слайдер'};
			break;
		case 'description':
			console.log('description');
			blockData = {
				container : 'div',
				type : 'richText',
				multiple : false,
				content : 'Здесь должно быть описание. Описание может быть любой длины. Короткое или длинное. Здесь должно быть описание. Описание может быть любой длины. Короткое или длинное.'
			};
			break;
		case 'map':
			console.log('map');
			blockData = {container : 'div', type : 'sheduleMap', multiple : false, content : 'Карта'}
			break;
		case 'bottom-slider':
			console.log('bottom-slider');
			blockData = {container : 'div', type : 'slider', multiple : true, content : 'Нижний слайдер'};
			break;
		case 'kassa-footer':
			console.log('kassa-footer');
			blockData = {container : 'div', type : 'div', multiple : false, content : '###'};
			break;
		default:
			console.log('error');

			blockData = blockData ? blockData : ''
	}

	createBlock(blockType, item, blockData);

	console.log('==================');

}
function appendOnClick() {
	var sideItem = dc.querySelectorAll('.side_item');
	sideItem.forEach(function(item, i){
		item.addEventListener('click', function(){addElement(item,i)});
	})
}

function sortableMenu(dc, rootEl, contentBlock){
		console.log(rootEl.children);
		var
			dragEl;
		[].slice.call(rootEl.children).forEach(function (itemEl){
				itemEl.draggable = true;
		});
		function _onDragOver(evt){
				evt.preventDefault();
				evt.dataTransfer.dropEffect = 'move';
				var
					target = evt.target;
				if (target && target !== dragEl && target.nodeName == 'DIV')
						rootEl.insertBefore(dragEl, target.nextSibling || target);
		}
		function _onDragEnd(evt){
				evt.preventDefault();
				dragEl.classList.remove('ghost');
				rootEl.removeEventListener('dragover', _onDragOver, false);
				rootEl.removeEventListener('dragend', _onDragEnd, false);
				console.log(rootEl);
				[].slice.call(rootEl.children).forEach(function(item,i){
					if (item.dataset && item.dataset.id) {
						dc.getElementById(item.dataset.id).style.order = i;
					};
				})
		}
		rootEl.addEventListener('dragstart', function (evt){
				dragEl = evt.target;
				evt.dataTransfer.effectAllowed = 'move';
				evt.dataTransfer.setData('Text', dragEl.textContent);

				rootEl.addEventListener('dragover', _onDragOver, false);
				rootEl.addEventListener('dragend', _onDragEnd, false);

				setTimeout(function(){dragEl.classList.add('ghost')}, 0)
		}, false);
}

(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)