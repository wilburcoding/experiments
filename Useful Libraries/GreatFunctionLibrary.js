function randNum(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function randomItem(Arr){
    return Arr[randNum(0,Arr.length-1)];
}

Hexs = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

function randHex(){
  return Hexs[randNum(0,15)];
}

function randColor(){
	return "#" + randHex() + randHex() + randHex() + randHex() + randHex() + randHex();
}

function clone(a){
	var copy = JSON.parse(JSON.stringify(a));
	return copy;
}

Alphabet = {};

Alphabet.letterArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
Alphabet.randLetter = function(){
	return this.letterArray[randNum(0,this.letterArray.length-1)];
};

function smartMod(num,den){
	if(num>=0){
		return num%den;
	}else{
		return (num+(Math.ceil(Math.abs(num)/den)*den))%den;
	}
}

function zeroPad(number){
	if(number>=10){
		return number;
	}else{
		return "0" + number;
	}
}

function sum(arr){
    var theSum = 0;
    for(var i=0;i<arr.length;i++){
        theSum += arr[i];
    }
    return theSum;
}

function concat(arr){
	var str = "";
	for(var k=0;k<arr.length;k++){
		str += arr[k];
	}
	return str;
}

function getArrThru(Arr,thru){
    var arrPart = [];
    for(i=0;i<=thru;i++){
        arrPart.push(Arr[i]);
    }
    return arrPart;
}

function pickRand(arr,num){
	if(num){
		return Math.floor(Math.random()*arr.length);
	}else{
		return arr[Math.floor(Math.random()*arr.length)];
	}
}

function stndrdth(num){
    if((num%10)==1 && (num%100)!=11){
        var ordInd = "st";
    }else if((num%10)==2 && (num%100)!=12){
        var ordInd = "nd";
    }else if((num%10)==3 && (num%100)!=13){
        var ordInd = "rd";
    }else{
        var ordInd = "th";
    }
    return num + ordInd;
}

function maxInArr(Arr){
	var val = undefined;
	for(var i=0;i<Arr.length;i++){
		if(val==undefined || Arr[i]>val){
			val = Arr[i];
		}
	}
	return val;
}