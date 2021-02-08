function increasex(){
	var x = document.getElementById("xholder");
	var y = parseInt(x.textContent) + 1;
	x.innerHTML = y;
	
}
function decreasex(){
	var x = document.getElementById("xholder");
	var y = parseInt(x.textContent) - 1;
	x.innerHTML = y;
}
function goplayboard(){
	var name = document.getElementById("pname").textContent;
	//send get (should be post) request
	//send name
	//get place of other
	//get place of this
	//get place of food
	
}
