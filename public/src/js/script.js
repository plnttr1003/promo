var
	dc = document;

function init() {
	extendProto();
	appendOnClick();
	checkExist();
	submitForm();
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

function submitForm() {
	var
		form = dc.querySelectorAll('form')[0],
		contentBlocksOnSubmit;
	form.addEventListener('submit', function(event){
		console.log(form);
		event.preventDefault();
		contentBlocksOnSubmit = dc.querySelectorAll('.content-block');
		console.log(contentBlocksOnSubmit);
		contentBlocksOnSubmit.forEach(function(item){
			var
				blockStyle = item.getAttribute('style'),
				divId = item.getAttribute('id'),
				innerBlockStyle = item.querySelectorAll('div._editable')[0].getAttribute('style'),
				innerBlockClass = item.querySelectorAll('div._editable')[0].getAttribute('class').replace(' _editable', ''),
				innerBlockText = item.querySelectorAll('div._editable')[0].textContent;
			item.querySelectorAll('input')[0].value = "{divId:'" + divId + "',styles:'" + blockStyle + "', stylesInner:'" + ((innerBlockStyle) ? innerBlockStyle : '') + "', className:'" + innerBlockClass + "', text:'" + innerBlockText + "'}";
		})
		form.submit();
	})
}

function createBlock(className, item, params) {

	console.log('--=-=====----=');
	console.log(className);
	console.log(params);
	console.log('--=-=====----=');

	var
		container = dc.querySelectorAll('.container')[0],
		contentBlockLength = dc.querySelectorAll('.content-block').length,
		contentBlock = dc.createElement('div'),
		contentBlockInner = dc.createElement('div'),
		contentBlockText = dc.createElement((params && params.container) ? params.container : 'div'),
		contentBlockHelper = dc.createElement('input'),
		contentBlockFileUploader = dc.createElement('input'),
		sideElements = dc.querySelectorAll('.side_elements')[0],
		timestamp = Date.now(),
		newItem;

	newItem = item.cloneNode(true);
	newItem.setAttributes({
		'data-id':'_' + timestamp,
		'class':'side_item selected'
	})
	if (params.title)
		newItem.textContent = params.title;

	sideElements.appendChild(newItem);

	contentBlock.setAttributes({
		'id': '_' + timestamp,
		'style': (params.styles ? params.styles : 'order:' + (contentBlockLength + 1) +';'),
		'class':'content-block ' + className + '_block'
	})

	container.appendChild(contentBlock);

	contentBlockInner.setAttributes({
		'data-type':'uploader',
		'class': className + ' content-block-uploader '
	})

	contentBlockInner.appendChild(contentBlockFileUploader);

	contentBlockFileUploader.setAttributes({
		'type':'file',
		'id':'____' + timestamp,
		'multiple': ''
	})


	contentBlockText.textContent = ((params && params.content)) ? params.content : 'Содержание';
	contentBlockText.setAttributes({
		'data-type':((params && params.content)) ? params.type : '',
		'contenteditable':'',
		'class': className + ' content-block-inner _editable',
		'style': (params.stylesInner ? params.stylesInner : '')
	})

	contentBlockHelper.setAttributes({
		'class': className + ' content-block-helper _editable',
		'type': 'text',
		'name': 'container',
		'id': '__' + timestamp
	})

	contentBlockInner.appendChild(contentBlockText);
	contentBlock.appendChild(contentBlockInner);
	contentBlock.appendChild(contentBlockHelper);

	sortableMenu(dc, sideElements, contentBlock);
	showEditor(dc, contentBlock, contentBlockText, contentBlockHelper, timestamp);
	uploadFiles(contentBlockFileUploader);
}

function addElement(item, i) {
	var
		blockParams = (item.dataset.params ? JSON.parse(item.dataset.params) : ''),
		blockType = (item.dataset.params ? blockParams.className.split(' ')[0] : item.dataset.blockType),
		blockData;
	console.log('------------------');
	console.log(blockParams);
	console.log('------------------');

	switch (blockType) {
		case 'kassa-header':
			blockData = {container:'div', type:'div', multiple:false, content:'###', title:'Header Кассы'};
			break;
		case 'title':
			console.log('title');
			blockData = {container:'div', helper:'input', type:'uploaderOrText', multiple:false, content:'Заголовок', title:'Заголовок'};
			break;
		case 'subtitle':
			console.log('subtitle');
			blockData = {container:'div', helper:'textarea', type:'uploaderOrText', multiple:false, content:'Подзаголовок', title:'Подзаголовок'};
			break;
		case 'upper-slider':
			console.log('upper-slider');
			blockData = {container:'div', helper:'input', type:'slider', multiple:true, content:'Верхний слайдер', title:'Верхний слайдер'};
			break;
		case 'description':
			console.log('description');
			blockData = {
				container:'div',
				helper: 'textarea',
				type:'richText',
				multiple:false,
				content:'Здесь должно быть описание. Описание может быть любой длины. Короткое или длинное. Здесь должно быть описание. Описание может быть любой длины. Короткое или длинное.',
				title:'Описание'
			};
			break;
		case 'map':
			console.log('map');
			blockData = {container:'div', helper:'input', type:'sheduleMap', multiple:false, content:'Карта', title:'Карта'}
			break;
		case 'bottom-slider':
			console.log('bottom-slider');
			blockData = {container:'div', helper:'input', type:'slider', multiple:true, content:'Нижний слайдер', title:'Нижний слайдер'};
			break;
		case 'kassa-footer':
			console.log('kassa-footer');
			blockData = {container:'div', type:'div', multiple:false, content:'###', title:'Footer Кассы'};
			break;
		default:
			console.log('error');
			blockData = blockData ? blockData : ''
		}
		if (item.dataset.params) {
			blockData = {container:'div', type:'div', content:blockParams.text, styles:blockParams.styles, stylesInner:blockParams.stylesInner, title:blockData.title}
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

function checkExist() {
	var
		hidItem = dc.querySelectorAll('.hidden_item');
	hidItem.forEach(function(item, i){
		addElement(item,i);
	})
}


function sortableMenu(dc, rootEl, contentBlock) {
		console.log(rootEl.children);
		var
			dragEl;
		[].slice.call(rootEl.children).forEach(function (itemEl){
				itemEl.draggable = true;
		});
		function onDragOver(evt){
				evt.preventDefault();
				evt.dataTransfer.dropEffect = 'move';
				var
					target = evt.target;
				if (target && target !== dragEl && target.nodeName == 'DIV')
						rootEl.insertBefore(dragEl, target.nextSibling || target);
		}
		function onDragEnd(evt){
				evt.preventDefault();
				dragEl.classList.remove('ghost');
				rootEl.removeEventListener('dragover', onDragOver, false);
				rootEl.removeEventListener('dragend', onDragEnd, false);
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

				rootEl.addEventListener('dragover', onDragOver, false);
				rootEl.addEventListener('dragend', onDragEnd, false);

				setTimeout(function(){dragEl.classList.add('ghost')}, 0)
		}, false);
}

function uploadFiles(input) {
	console.log(input);
	input.addEventListener("change", handleFiles, false);
		function handleFiles() {
		//var fileList = this.files;
		console.log(input.value);
	}
}

(function ready(fn) {
	if (document.readyState != 'loading'){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
})(init)