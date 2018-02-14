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
    for(i=0;(i<Arr.length)&&(i<=thru);i++){
        arrPart.push(Arr[i]);
    }
    return arrPart;
}

function sumArrThru(Arr,thru){
	return sum(getArrThru(Arr,thru));
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

function logRand(p){
    if(Math.random()<0.5 || p){
        return -Math.log2(1-Math.random());
    }else{
        return Math.log2(1-Math.random());
    }
}

function ClockCalendar(){
	this.SiM = arguments[0] || 60;
	this.MiH = arguments[1] || 60;
	this.HiD = arguments[2] || 24;
	this.DiW = arguments[3] || 7;
	this.DiL = Array.isArray(arguments[4]) ? arguments[4] : [31,28,31,30,31,30,31,31,30,31,30,31];
	this.YiF = arguments[5] || 4;
	this.FiC = arguments[6] || 25;
	this.CiQ = arguments[7] || 4;
	this.oY = arguments[8] || 2001;
	this.lL = arguments[9] || 2;
	this.oJ = arguments[10] || -13;
	this.endJ = arguments[11] || -152750;
	this.NL = Array.isArray(arguments[12]) ? arguments[12] : ["January","February","March","April","May","June","July","August","September","October","November","December"];
	this.NW = Array.isArray(arguments[13]) ? arguments[13] : ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	this.NB = arguments[14] || "B.C.E.";
	this.DS = (typeof arguments[15] === "string") ? (arguments[15].length==1 ? arguments[15] : "/") : "/";
	this.TS = (typeof arguments[16] === "string") ? (arguments[16].length==1 ? arguments[16] : ":") : ":";
	this.DiY = sumArrThru(this.DiL,this.DiL.length-1);
	this.DiF = (this.DiY*this.YiF)+1;
	this.DiC = (this.DiF*this.FiC)-1;
	this.DiQ = (this.DiC*this.CiQ)+1;
	this.SiH = this.SiM*this.MiH;
	this.SiD = this.SiH*this.HiD;
	this.YiC = this.YiF*this.FiC;
	this.YiQ = this.YiC*this.CiQ;
	this.getDate = function(d){
		var nQ = Math.floor(d/this.DiQ);
		var DoQ = smartMod(d,this.DiQ);
		if(DoQ == this.DiQ-1){
			var CoQ = this.CiQ-1;
			var DoC = this.DiC;
		}else{
			var CoQ = Math.floor(DoQ/this.DiC);
			var DoC = smartMod(DoQ,this.DiC);
		}
		var FoC = Math.floor(DoC/this.DiF);
		var DoF = smartMod(DoC,this.DiF);
		if(DoF == this.DiF-1){
			var YoF = this.YiF-1;
			var DoY = this.DiY;
		}else{
			var YoF = Math.floor(DoF/this.DiY);
			var DoY = smartMod(DoF,this.DiY);
		}
		var nY = (nQ*this.YiQ) + (CoQ*this.YiC) + (FoC*this.YiF) + YoF + this.oY;
		var DiLL = clone(this.DiL);
		if(YoF==this.YiF-1 && (CoQ==this.CiQ-1 || FoC<this.FiC-1)){
			DiLL[this.lL-1]++;
		}
		var LoY = 1;
		while(sumArrThru(DiLL,LoY-1)<=DoY){
			LoY++;
		}
		var DoL = DoY-sumArrThru(DiLL,LoY-2)+1;
		var DoW = smartMod(d,this.DiW);
		var jnF = Math.floor((d+this.oJ)/this.DiF);
		var jDoF = smartMod((d+this.oJ),this.DiF);
		if(jDoF == this.DiF-1){
			var jYoF = this.YiF-1;
			var jDoY = this.DiY;
		}else{
			var jYoF = Math.floor(jDoF/this.DiY);
			var jDoY = smartMod(jDoF,this.DiY);
		}
		var jnY = (jnF*this.YiF) + jYoF + this.oY;
		var DiLL = clone(this.DiL);
		if(jYoF==this.YiF-1){
			DiLL[this.lL-1]++;
		}
		var jLoY = 1;
		while(sumArrThru(DiLL,jLoY-1)<=jDoY){
			jLoY++;
		}
		var jDoL = jDoY-sumArrThru(DiLL,jLoY-2)+1;
		if(d<this.endJ){
			nY = jnY;
			LoY = jLoY;
			DoL = jDoL;
		}
		return {
			nums: {
				year: nY,
				month: LoY,
				day: DoL,
				dayOfWeek: DoW,
				timeNumber: d*this.SiD
			},
			strings: {
				shortDate: LoY + this.DS + DoL + this.DS + nY,
				longDate: this.NW[DoW] + ", " + this.NL[LoY-1] + " " + DoL + ", " + (nY<1 ? (-nY+1)+" "+this.NB : nY),
				weekDay: this.NW[DoW]
			}
		};
	};
	this.getTimeDate = function(t){
		var SoD = smartMod(t,this.SiD);
		var MoD = Math.floor(SoD/this.SiM);
		var HoD = Math.floor(MoD/this.MiH);
		var MoH = smartMod(MoD,this.MiH);
		var SoM = smartMod(SoD,this.SiM);
		var nD = Math.floor(t/this.SiD);
		var dateNums = this.getDate(nD).nums;
		return {
			nums: {
				year: dateNums.year,
				month: dateNums.month,
				day: dateNums.day,
				dayOfWeek: dateNums.dayOfWeek,
				hour: HoD,
				minute: MoH,
				second: SoM,
				dateNumber: nD
			},
			strings: {
				shortTimeDate: dateNums.month + this.DS + dateNums.day + this.DS + dateNums.year + " " + zeroPad(HoD) + this.TS + zeroPad(MoH) + this.TS + zeroPad(SoM),
				longTimeDate: this.NW[dateNums.dayOfWeek] + ", " + this.NL[dateNums.month-1] + " " + dateNums.day + ", " + (dateNums.year<1 ? (-dateNums.year+1)+" "+this.NB : dateNums.year) + " " + zeroPad(HoD) + this.TS + zeroPad(MoH) + this.TS + zeroPad(SoM),
				time: zeroPad(HoD) + this.TS + zeroPad(MoH) + this.TS + zeroPad(SoM),
				weekDay: this.NW[dateNums.dayOfWeek]
			}
		};
	};
	this.getDateNumber = function(){
		var dateBits = {};
		if(typeof arguments[0] === "string"){
			arguments = arguments[0].split(this.DS);
			for(var n in arguments){
				arguments[n] = parseInt(arguments[n]);
			}
		}
		dateBits.month = arguments[0];
		dateBits.day = arguments[1];
		dateBits.year = arguments[2] - this.oY;
		var eJ = this.getDate(this.endJ).nums;
		eJ.year -= this.oY;
		var DiLL = clone(this.DiL);
		if(dateBits.year<eJ.year || (dateBits.year==eJ.year && (dateBits.month<eJ.month || (dateBits.month==eJ.month && dateBits.day<eJ.day)))){
			var nF = Math.floor(dateBits.year/this.YiF);
			var YoF = smartMod(dateBits.year,this.YiF);
			if(YoF==this.YiF-1){
				DiLL[this.lL-1]++;
			}
			return (nF*this.DiF)+(YoF*this.DiY)+sumArrThru(DiLL,dateBits.month-2)+dateBits.day-1;
		}else{
			var nQ = Math.floor(dateBits.year/this.YiQ);
			var YoQ = smartMod(dateBits.year,this.YiQ);
			var CoQ = Math.floor(YoQ/this.YiC);
			var YoC = smartMod(YoQ,this.YiC);
			var FoC = Math.floor(YoC/this.YiF);
			var YoF = smartMod(YoC,this.YiF);
			if(YoF==this.YiF-1 && (CoQ==this.CiQ-1 || FoC<this.FiC-1)){
				DiLL[this.lL-1]++;
			}
			return (nQ*this.DiQ)+(CoQ*this.DiC)+(FoC*this.DiF)+(YoF*this.DiY)+sumArrThru(DiLL,dateBits.month-2)+dateBits.day-1;
		}
	};
	this.getTimeNumber = function(){
		var dateBits = {};
		var timeBits = {};
		if(typeof arguments[0] === "string"){
			var timeDateBits = arguments[0].split(" ");
			timeDateBits[0] = timeDateBits[0].split(this.DS);
			timeDateBits[1] = timeDateBits[1].split(this.TS);
			dateBits.month = parseInt(timeDateBits[0][0]);
			dateBits.day = parseInt(timeDateBits[0][1]);
			dateBits.year = parseInt(timeDateBits[0][2]);
			timeBits.hour = parseInt(timeDateBits[1][0]);
			timeBits.minute = parseInt(timeDateBits[1][1]);
			timeBits.second = parseInt(timeDateBits[1][2]);
		}else{
			dateBits.month = arguments[0];
			dateBits.day = arguments[1];
			dateBits.year = arguments[2];
			timeBits.hour = arguments[3];
			timeBits.minute = arguments[4];
			timeBits.second = arguments[5];
		}
		var mTN = this.getDate(this.getDateNumber(dateBits.month,dateBits.day,dateBits.year)).nums.timeNumber;
		return mTN + (timeBits.hour*this.SiH) + (timeBits.minute*this.SiM) + timeBits.second;
	};
	this.getWeekDay = function(){
		return this.getDate(this.getDateNumber(arguments[0],arguments[1],arguments[2])).strings.weekDay;
	};
}