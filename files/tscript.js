//var url = "localhost:6565";
var snakeDir = [0.0, 0.0];
var headPos = [100.0, 100.0];
var decideToMove = null;
var screenWidth = null;
var screenHeight = null;

function increasex(){
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
}
function goplayboard(){
	//send post request
	//send name
	//get place of other
	//get place of this
	//get place of food
	
	var url = "http://localhost:6565";
	var pname = document.getElementById("pname").value;
	
	var request = new XMLHttpRequest();
	request.open("POST", url, true);
	//request.setRequestHeader('content-Type','application/json');
	request.send(JSON.stringify({
		name:pname
	}));
	request.onload = function() {
		console.log("sent your info");
		var jsonResponse = JSON.parse(this.responseText);
		document.getElementById("container").innerHTML = jsonResponse['pl'];
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
function thecirclemoveright(){
	/*console.log("prepare to move");
	var circle = document.getElementById("thecircle");
	var pos = headPos;
	
	var id = setInterval(frame1, 10);
	function frame1(){
		if(pos[0] == 200){
			clearInterval(id);
			pos = headPos;
			sendPostRequest("http://localhost:6565", "I moved", sentthenotice)			
		}else{
			pos[0] += 1;
		}
		circle.style.top = 0;
		circle.style.left = pos[0];
	}*/
	startMove();
}
function startMove() {
	screenWidth = document.getElementById("container").clientWidth;
	screenHeight = document.getElementById("container").clientHeight;

	decideToMove = setInterval(moveTheSnake, 30);
}
function stopMove() {
	clearInterval(decideToMove);
}
function moveTheSnake() {
	lengthVector = Math.sqrt(snakeDir[0]*snakeDir[0] + snakeDir[1]*snakeDir[1]);
	addx = 1.0/lengthVector * snakeDir[0];
	addy = 1.0/lengthVector * snakeDir[1];
	headPos[0] += addx;
	headPos[1] += addy;
	moveTheShapeOfSnake();
}
function moveTheShapeOfSnake(){
	var circle = document.getElementById("thecircle");
	circle.style.top = Math.round(headPos[1]);
	circle.style.left = Math.round(headPos[0]);
}
function sentthenotice(){
	console.log("sent to the server notice");
}

function onMouseMove(event){
	snakeDir[0] = event.clientX - screenWidth / 2;
	snakeDir[1] = event.clientY - screenHeight / 2;
	document.getElementById("positionzone").innerHTML = snakeDir[0]+":"+snakeDir[1]
}
