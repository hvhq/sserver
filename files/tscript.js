var url = "http://localhost:4321";
var snakeDir = [0.0, 0.0];	//vector with root is O(0,0) ~ is: the mouse place-the head place
var snakeBody = [{x:98.0, y:100.0}]; //address on the global map
var bodyDistance = 10.0; //real ~ on global
var stepMove = 3; //on real
var adjustRatio = {x:0, y:0}
var backgroundPos = [0, 0]; 
var decideToMove = null;
var screenWidth = null;
var screenHeight = null;

/*function increasex(){
	var x = document.getElementById("xholder");
	var y = parseInt(x.textContent) + 1;
	x.innerHTML = y;
	
	console.log("increased");
}
function decreasex(){
	var x = document.getElementById("xholder");
	var y = parseInt(x.textContent) - 1;
	x.innerHTML = y;
	
	console.log("decreased");
}*/
function goplayboard(){
	//send post request
	//send name, where is the head and body
	//get place of other snake, food, 
	
	var pname = document.getElementById("pname").value;
	
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	//request.setRequestHeader('content-Type','application/json');
	request.send(JSON.stringify({
		name:pname
	}));
	snakeBody[0].x = 0;
	snakeBody[0].y = 0;
	request.onload = function() {
		console.log("sent your info");
		var jsonResponse = JSON.parse(this.responseText);
		var container = document.getElementById("container");
		container.innerHTML = jsonResponse['pl'];
		container.style.backgroundImage = "url('bgpl.png')";
		initialize(jsonResponse);
		
		/*if (jsonResponse != null) {
			snakeBody[0].x = jsonResponse.u[0].x;
			snakeBody[0].y = jsonResponse.u[0].y;
			for (var it=1; it < jsonResponse.u.length; it++) {
				addTail(true, true, jsonResponse.u[it]);
			}
		}*/
		startMove();
		//startMove();
		//addTail(true);
		//addTail(true);
		/*var newelement = document.createElement('div');
		newelement.innerHTML = this.responseText;
		x = document.getElementById("toreplace");
		x.parentNode.replaceChild(newelement, x); 
		*/
		//console.log(JSON.parse(this.responseText));
	}

}

function sendPostRequest(url, stringdata, onLoadFunction){
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	request.send(stringdata);
	request.onload = onLoadFunction();
}

function initialize(jsonRes = null) {
	screenWidth = document.getElementById("container").clientWidth;
	screenHeight = document.getElementById("container").clientHeight;	
	adjustRatio = {x:100/screenWidth, y:100/screenHeight}
	if(jsonRes !== null){
		snakeBody[0].x = 25;
		snakeBody[0].y = 25;
	}
	//snakeBody[0]={x:screenWidth / 2.0, y: screenHeight / 2.0};
}

function startMove() {
	if (decideToMove != null){
		return;
	}
	decideToMove = setInterval(moveTheSnake, 20);
		document.getElementById("positionzone4").innerHTML = snakeBody[0].x + ":"+snakeBody[0].y;
}
function stopMove() {
	if (decideToMove==null){
		return;
	}
	
	clearInterval(decideToMove);
	decideToMove = null;
}

function moveTheSnake() {	
	document.getElementById("positionzone2").innerHTML = snakeBody[0].x + ":"+snakeBody[0].y;	
	lengthVector = Math.sqrt(snakeDir[0]*snakeDir[0] + snakeDir[1]*snakeDir[1]);
	var add ={};
	if (lengthVector > 0){
		add.x = stepMove /lengthVector * snakeDir[0];
		add.y = stepMove /lengthVector * snakeDir[1];
	}else{
		add.x = 0;
		add.y = 0;
	}
	//move real head	
	snakeBody[0].x += add.x;
	snakeBody[0].y += add.y;

	backgroundPos[0] -= add.x;
	backgroundPos[1] -= add.y;
	//move eye
	moveEyes();

	//move head~mean move the whole body and head stay 
	//move body along with the screen
	document.getElementById("positionzone3").innerHTML = snakeBody[0].x + ":"+snakeBody[0].y;

	for (var it=1; it<snakeBody.length; it++){
		moveSnakeBodyPartImage(it, {x:(snakeBody[0].x-add.x) * adjustRatio.x, 
									y:(snakeBody[0].y-add.y) * adjustRatio.y});
	}
	//adjust the body 
	for (var it = 1; it<snakeBody.length; it++){
		moveBodyPartBackend(it);

		var prevToWard = {x:(snakeBody[it].x-snakeBody[it-1].x)*adjustRatio.x,
							y:(snakeBody[it].y-snakeBody[it-1].y)*adjustRatio.y};
		moveSnakeBodyPartImage(it, prevToWard);
	}
	
	moveTheShapeOfSnake();
}

function moveTheShapeOfSnake(){
	var container = document.getElementById("container");
	container.style.backgroundPosition = backgroundPos[0].toString()+" "+ (backgroundPos[1]).toString();
}

function moveEyes(){
	var head = document.getElementById("body0");
	if (snakeDir[1]!=0){
		var deg = 180 - 180*Math.atan(snakeDir[0]/snakeDir[1]) / Math.PI;
		if (snakeDir[1] < 0){
			deg += 180;
		}
		head.style.transform = "rotate("+ deg.toString()+"deg)";
		head.style.webkitTransform = "rotate("+ deg.toString()+"deg)";

	}else if (snakeDir[0] >= 0 ) {
		head.style.transform = "rotate(90deg)";
		head.style.webkitTransform = "rotate(90deg)";
	}else {
		head.style.transform = "rotate(270deg)";
		head.style.webkitTransform = "rotate(270deg)";
	}
}

function moveHeadBackend() {

}
function moveBodyPartBackend(it) {
	var disToPrev = Math.sqrt((snakeBody[it].x-snakeBody[it-1].x)*(snakeBody[it].x-snakeBody[it-1].x)+(snakeBody[it].y-snakeBody[it-1].y)*(snakeBody[it].y-snakeBody[it-1].y));

	snakeBody[it].x = snakeBody[it-1].x - bodyDistance/disToPrev * (snakeBody[it-1].x-snakeBody[it].x);
	snakeBody[it].y = snakeBody[it-1].y - bodyDistance/disToPrev * (snakeBody[it-1].y-snakeBody[it].y);
}

//to increase the responsive speed
function moveSnakeBodyPartImage(it, add) {
	var elem = document.getElementById("body"+it);
	var prevElem = document.getElementById("body"+(it-1));
	//console.log(add.x);
	//console.log(parseFloat(prevElem.style.left));
	elem.style.left = (parseFloat(prevElem.style.left)+add.x)+"%";
	elem.style.top = (parseFloat(prevElem.style.top)+add.y)+"%";
}

function addTail(setZIndex = false, isUsePos=false, pos={x:0,y:0}) {
	var pointTail = {};
	if(isUsePos){
		pointTail = pos;
	} else{ 
		pointTail = getPointTail(snakeBody);
	}
	snakeBody.push(pointTail);

	var newTailImage = document.createElement('DIV');
	newTailImage.id = "body"+(snakeBody.length - 1);
	newTailImage.className = "circle";
	
	var prevIt = snakeBody.length - 2;
	var diff = {x: (pointTail.x - snakeBody[prevIt].x) * adjustRatio.x,
				 y:(pointTail.y-snakeBody[prevIt].y) * adjustRatio.y};
	//console.log(diff.x, diff.y);
	//console.log(Math.sqrt(diff.x*diff.x+diff.y* diff.y));
	
	var prevElem = document.getElementById("body"+prevIt);
	newTailImage.style.top = (parseFloat(prevElem.style.top) + diff.y)+"%";
	newTailImage.style.left = (parseFloat(prevElem.style.left) + diff.x)+"%";
	
	if (setZIndex == true){
		zIndexNumber = parseInt(document.getElementById("body"+(snakeBody.length-2).toString()).style.zIndex) - 1;
		newTailImage.style.zIndex = zIndexNumber.toString();
	}
	
	document.getElementById("inside_container").appendChild(newTailImage);
}

function getPointTail(snakeBody){
	var snakeLength = snakeBody.length;
	var tail = {};
	var add = {};
	if (snakeLength <= 1){
		dirLength = Math.sqrt(snakeDir[0]*snakeDir[0] + snakeDir[1]*snakeDir[1]);
		if ( dirLength > 0){
			tail.x = bodyDistance / dirLength * snakeDir[0] + snakeBody[0].x;// - bodyDistance / dirLength * snakeDir[0];
			tail.y = bodyDistance / dirLength * snakeDir[1] + snakeBody[0].y;// - bodyDistance / dirLength * snakeDir[1];
			//add.x = bodyDistance / dirLength * snakeBody[0].x;
			//add.y = bodyDistance / dirLength * snakeBody[0].y;
		} else {
			tail.x = snakeBody[0].x;
			tail.y = snakeBody[0].y+bodyDistance;
			//add.x = 0;
			//add.y = bodyDistance;
		}
		
	} else {
		tail['x'] = 2.0 * snakeBody[snakeLength - 1]['x'] - snakeBody[snakeLength - 2]['x'];
		tail['y'] = 2.0 * snakeBody[snakeLength - 1]['y'] - snakeBody[snakeLength - 2]['y'];
		//add.x = snakeBody[snakeLength - 2].x - snakeBody[snakeLength - 1].x;
		//add.y = snakeBody[snakeLength - 2].y - snakeBody[snakeLength - 1].y;
	}
	
	return tail;
}
function sentthenotice(){
	console.log("sent to the server notice");
}

function onMouseMove(event){
	snakeDir[0] = event.clientX - screenWidth / 2;
	snakeDir[1] = event.clientY - screenHeight / 2;
	document.getElementById("positionzone").innerHTML = snakeDir[0]+":"+snakeDir[1]
}
