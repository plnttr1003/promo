function showEditor(dc, parentPlock, block, timestamp) {
	var
		fontSizes = ['14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px', '42px', '46px', '52px', '62px', '72px', '82px', '92px', '102px', '112px', '120px'],
		fontFamilies = ['helvetica', 'arial'],
		fontWeights = [''],

		containerEditior = dc.createElement('div'),
		fontColor = dc.createElement('input'),
		fontFamilies = dc.createElement('div'),
		fontSize = dc.createElement('div'),
		fontSizeInner = dc.createElement('div'),
		textAlign = dc.createElement('div'),
		resizeButton = dc.createElement('a'),
		menuItem = dc.querySelectorAll('[data-id=_' + timestamp + ']')[0],
		resizebleClass = '_resizeble';

	fontColor.className = 'font-color _editor-button _' + timestamp;
	fontFamilies.className = 'font-family _editor-button';
	fontSize.className = 'font-size _editor-button';
	textAlign.className = 'text-align _editor-button';
	textAlign.innerHTML = '<span data-align="left"></span><span data-align="center"></span><span data-align="right"></span><span data-align="justify"></span>'

	resizeButton.className = 'resize _right_editor-button';
	resizeButton.innerHTML = '<span>Растянуть</span>'

	fontSizeInner.className = 'font-size-inner editor-button-inner';
	fontSize.innerHTML = '<span data-size="font-size"></span>';
	fontSize.appendChild(fontSizeInner);
	fontColor.setAttribute('type','color');

	fontSizes.forEach(function(item,i){
		var fontMenuItem = dc.createElement('div');
		fontMenuItem.className = 'editor _font-size';
		fontMenuItem.setAttribute('data-font-size', item);
		fontMenuItem.textContent = item;
		fontSizeInner.appendChild(fontMenuItem);
		fontMenuItem.addEventListener('click', function() {
			block.style.fontSize = item;
		}, false)
	})

	console.log(textAlign.children);
	[].slice.call(textAlign.children).forEach(function (item){
		console.log(item.dataset.align);
		item.addEventListener('click', function(){
			block.style.textAlign = item.dataset.align;
		})
	});

	resizeButton.addEventListener('click', function(){
		allowResizeElement(parentPlock, resizebleClass)
	});

	containerEditior.appendChild(fontColor);
	containerEditior.appendChild(fontFamilies);
	containerEditior.appendChild(fontSize);
	containerEditior.appendChild(textAlign);
	containerEditior.className = 'container-editor';

	parentPlock.appendChild(containerEditior);
	parentPlock.appendChild(resizeButton);
	//--

	fontColor.addEventListener('input', function() {
		block.style.color = fontColor.value;
	}, false);
}


function allowResizeElement(el, className) {
	if (el.classList) {
		el.classList.toggle(className);
	} else {
		var classes = el.className.split(' ');
		var existingIndex = classes.indexOf(className);
		if (existingIndex >= 0) classes.splice(existingIndex, 1);
		else classes.push(className);
			el.className = classes.join(' ');
	}
}