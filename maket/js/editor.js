function showEditor(dc, block, timestamp) {
	var
		fontSizes = ['14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px', '42px', '46px', '52px', '62px', '72px', '82px', '92px', '102px'],
		containerEditior = dc.createElement('div'),
		fontColor = dc.createElement('input'),
		fontName = dc.createElement('div'),
		fontSize = dc.createElement('div'),
		textAlign = dc.createElement('div'),
		editorButtonInner = dc.createElement('div'),
		menuItem = dc.querySelectorAll('[data-id=_' + timestamp + ']')[0];

	fontColor.className = 'font-color _editor-button';
	fontName.className = 'font-name _editor-button';
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
	})


	containerEditior.appendChild(fontColor);
	containerEditior.appendChild(fontName);
	containerEditior.appendChild(fontSize);
	containerEditior.appendChild(textAlign);
	containerEditior.className = 'container-editor';

	menuItem.appendChild(containerEditior);


	//--

	fontColor.addEventListener('input', function() {
    block.style.color = fontColor.value;
	}, false);
}