function showEditor(dc, parentPlock, block, timestamp) {
	var
		fontSizes = ['14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px', '42px', '46px', '52px', '62px', '72px', '82px', '92px', '102px'],
		fontFamilies = []
		containerEditior = dc.createElement('div'),
		fontColor = dc.createElement('input'),
		fontFamilies = dc.createElement('div'),
		fontSize = dc.createElement('div'),
		textAlign = dc.createElement('div'),
		editorButtonInner = dc.createElement('div'),
		menuItem = dc.querySelectorAll('[data-id=_' + timestamp + ']')[0];

	fontColor.className = 'font-color _editor-button';
	fontFamilies.className = 'font-family _editor-button';
	fontSize.className = 'font-size _editor-button';
	textAlign.className = 'text-align _editor-button';

	editorButtonInner.className = 'editor-button-inner';
	fontSize.appendChild(editorButtonInner);

	fontColor.setAttribute('type','color');

	fontSizes.forEach(function(item,i){
		console.log(item);
		var fontMenuItem = dc.createElement('div');
		fontMenuItem.className = 'editor _font-size';
		fontMenuItem.setAttribute('data-font-size', item);
		fontMenuItem.textContent = item;
		editorButtonInner.appendChild(fontMenuItem);
		fontMenuItem.addEventListener('click', function() {
			//console.log(item);
			block.style.fontSize = item;
		}, false)
	})

	containerEditior.appendChild(fontColor);
	containerEditior.appendChild(fontFamilies);
	containerEditior.appendChild(fontSize);
	containerEditior.appendChild(textAlign);
	containerEditior.className = 'container-editor';

	parentPlock.appendChild(containerEditior);

	//--

	fontColor.addEventListener('input', function() {
		console.log(block);
		block.style.color = fontColor.value;
	}, false);
}