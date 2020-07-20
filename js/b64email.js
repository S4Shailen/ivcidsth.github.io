var END_OF_INPUT = -1;
var BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%2b/index.html';
var base64Chars = new Array();
var reverseBase64Chars = new Array();
for (var i=0; i < 64; i++){
    base64Chars[i] = BASE64_ALPHABET.charAt(i);
    reverseBase64Chars[BASE64_ALPHABET.charAt(i)] = i;
}
var base64Str;
var base64Count;
function readReverseBase64(){   
	if (!base64Str) return END_OF_INPUT;
	while (true){	  
		if (base64Count >= base64Str.length) return END_OF_INPUT;
		var nextCharacter = base64Str.charAt(base64Count);
		base64Count++;
		if (reverseBase64Chars[nextCharacter]){
			return reverseBase64Chars[nextCharacter];
		}
		if (nextCharacter == 'A') return 0;
	}
	return END_OF_INPUT;
}
function ntos(n){
	n=n.toString(16);
	if (n.length == 1) n="0"+n;
	return unescape("%"+n);
}
function decodeBase64(str){
	base64Str = str;
	base64Count = 0;
	var result = "";
	var inBuffer = new Array(4);
	var done = false;
	while (!done && (inBuffer[0] = readReverseBase64()) != END_OF_INPUT
		&& (inBuffer[1] = readReverseBase64()) != END_OF_INPUT){
		inBuffer[2] = readReverseBase64();
		inBuffer[3] = readReverseBase64();
		result += ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
		if (inBuffer[2] != END_OF_INPUT){
			result +=  ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
			if (inBuffer[3] != END_OF_INPUT){
				result +=  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
			} else {
				done = true;
			}
		} else {
			done = true;
		}
	}
	return result;
}
function setMailtos() {
	this.setAttribute('rel', this.getAttribute('href'));
	this.setAttribute('href', 'mailto:'+decodeBase64(this.id));
}
function unsetMailtos() {
	this.setAttribute('href', this.getAttribute('rel'));
	this.setAttribute('rel', '');
}
function processAnchors() {
	var anchors = document.getElementsByTagName('a');
	for (var i=0, anchor; anchor = anchors[i]; i++) {
		if (anchor.className == 'b64email') {
			anchor.onmouseover = setMailtos;
			anchor.onmouseout = unsetMailtos;
			anchor.onfocus = setMailtos;
			anchor.onblur = unsetMailtos;
		}
	}
}
window.onload = processAnchors; 
