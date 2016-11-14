var
	dc = document;

function init() {
	extendProto();
	appendOnClick();
}

function extendProto() {
	Element.prototype.setAttributes = function (attrs) {
		for (var idx in attrs) {
			if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
					for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
			} else if (idx === 'html') {
					this.innerHTML = attrs[idx];
			} else {
					this.setAttribute(idx, attrs[idx]);
			}
		}
	};
}

function dropzoneSettings(timestamp) {
	console.log(timestamp);
	var id = '_' + timestamp;
	console.log(id);
	console.log(Dropzone.options[id])
	Dropzone.options[id] = {
		paramName: "file",
		maxFilesize: 2,
		previewsContainer: '.content-block',
		thumbnailWidth:'1200px',
		accept: function(file, done) {
			if (file.name == "justinbieber.jpg") {
				done("Naha, you don't.");
			}
			else { done(); }
		}
	};
}

function createBlock(className, item, params) {
	var
		container = dc.querySelectorAll('.container')[0],
		contentBlockLength = dc.querySelectorAll('.content-block').length,
		contentBlock = dc.createElement('div'),
		contentBlockInner = dc.createElement('div'),
		contentBlockText = dc.createElement((params && params.container) ? params.container : 'div'), //!!!!
		sideElements = dc.querySelectorAll('.side_elements')[0],
		timestamp = Date.now(),
		newItem,
		dropzoneBlock;

	newItem = item.cloneNode(true);
	newItem.setAttributes({
		'data-id':'_' + timestamp,
		'class':'side_item selected'
	})

	sideElements.appendChild(newItem);

	contentBlock.setAttributes({
		'id': '_' + timestamp,
		'style':'order:' + (contentBlockLength + 1) +';',
		'class':'content-block ' + className + '_block'
	})

	container.appendChild(contentBlock);

	contentBlockInner.setAttributes({
		'data-type':'uploader',
		'class': className + ' content-block-uploader '
	})

	contentBlockText.textContent = ((params && params.content)) ? params.content : 'Содержание';
	contentBlockText.setAttributes({
		'data-type':((params && params.content)) ? params.type : '',
		'contenteditable':'',
		'class': className + ' content-block-inner _editable'
	})

	contentBlockInner.appendChild(contentBlockText);
	contentBlock.appendChild(contentBlockInner);

	dropzoneSettings(timestamp);
	dropzoneBlock = new Dropzone('div#_'+timestamp+' .content-block-uploader', { url: '/file/post'});

	sortableMenu(dc, sideElements, contentBlock);
	showEditor(dc, contentBlock, contentBlockText, timestamp);
}

function addElement(item, i) {
	var
		blockType = item.dataset.blockType,
		blockData;
	console.log('------------------');

	switch (blockType) {
		case 'kassa-header':
			blockData = {container:'div', type:'div', multiple:false, content:'###'};
			break;
		case 'title':
			console.log('title');
			blockData = {container:'div', type:'uploaderOrText', multiple:false, content:'Заголовок'};
			break;
		case 'subtitle':
			console.log('subtitle');
			blockData = {container:'div', type:'uploaderOrText', multiple:false, content:'Подзаголовок'};
			break;
		case 'upper-slider':
			console.log('upper-slider');
			blockData = {container:'div', type:'slider', multiple:true, content:'Верхний слайдер'};
			break;
		case 'description':
			console.log('description');
			blockData = {
				container:'div',
				type:'richText',
				multiple:false,
				content:'Здесь должно быть описание. Описание может быть любой длины. Короткое или длинное. Здесь должно быть описание. Описание может быть любой длины. Короткое или длинное.'
			};
			break;
		case 'map':
			console.log('map');
			blockData = {container:'div', type:'sheduleMap', multiple:false, content:'Карта'}
			break;
		case 'bottom-slider':
			console.log('bottom-slider');
			blockData = {container:'div', type:'slider', multiple:true, content:'Нижний слайдер'};
			break;
		case 'kassa-footer':
			console.log('kassa-footer');
			blockData = {container:'div', type:'div', multiple:false, content:'###'};
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
						dc.getElementById(item.dataset.id).style.color = '#000';
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