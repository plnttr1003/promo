var
	dc = document;

function init() {
	appendOnClick();
}

function createBlock(className, item, params) {
	var
		container = dc.querySelectorAll('.container')[0],
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

	container.appendChild(contentBlock);
	console.log(params);

	contentBlockInner.textContent = ((params && params.content)) ? params.content : 'Содержание';
	contentBlockInner.className = className + ' content-block-inner _editable';
	contentBlockInner.setAttribute('data-type', ((params && params.content)) ? params.type : '');
	contentBlockInner.setAttribute('contenteditable','');

	contentBlock.appendChild(contentBlockInner);

	showEditor(dc, contentBlockInner, timestamp);
}

function addElement(item, i) {
	var
		blockType = item.dataset.blockType,
		blockData;
	console.log('------------------');

	switch (blockType) {
		case 'kassa-header':
			console.log('kassa-header');
			break;
		case 'title':
			console.log('title');
			blockData = {container : 'div', type : 'uploaderOrText', multiple : false, content : 'Заголовок'};
			break;
		case 'subtitle':
			console.log('subtitle');
			blockData = {container : 'div', type : 'uploaderOrText', multiple : false};
			break;
		case 'upper-slider':
			console.log('upper-slider');
			break;
		case 'description':
			console.log('description');
			blockData = {container : 'div', type : 'richText', multiple : false};
			break;
		case 'map':
			console.log('map');
			break;
		case 'bottom-slider':
			console.log('bottom-slider');
			break;
		case 'kassa-footer':
			console.log('kassa-footer');
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
	console.log(sideItem);
	sideItem.forEach(function(item, i){
		item.addEventListener('click', function(){addElement(item,i)});
	})
}


(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)