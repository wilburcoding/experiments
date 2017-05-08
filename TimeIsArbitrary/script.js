var clock = document.getElementById("clock");

//Warning: Only partially un-hardcoded!

var MIL_OFFSET = 76392404633;
var ARB_SS_LENGTH = 874; //In Milliseconds
var ARB_MM_LENGTH = 63; //In ArbSeconds
var ARB_HH_LENGTH = 57; //In ArbMinutes
var ARB_DD_LENGTH = 25; //In ArbHours
var ARB_1001D_LENGTH = function(){return (1001*ARB_MM_LENGTH*ARB_HH_LENGTH*ARB_DD_LENGTH)+1}; //In ArbSeconds
var ARB_YY_LENGTH = 413; //In ArbDays
var ARB_3Y_LENGTH = function(){return (ARB_YY_LENGTH*3)+2}; //In ArbDays
var ARB_27Y_LENGTH = function(){return (ARB_3Y_LENGTH()*9)+1}; //In ArbDays
var ARB_W_LENGTH = 9;
var ArbWeekdays = ["A","B","C","D","E","F","G","H","I"];

function changeClock(){
	clock.innerHTML = arguments[0];
}

function nowInMS(){
	return Date.now()+MIL_OFFSET;
}

function smartMod(num,den){
	if(num>=0){
		return num%den;
	}else{
		return (num+(Math.ceil(Math.abs(num)/den)*den))%den;
	}
}

var Timezone = 0;

var timezones = [];

function timezoneRule(tzName,stan,dl,dlName,dlsm,dlsd,dlsh,dlem,dled,dleh,dlsw,dlew){
	this.name = tzName;
	this.standard = stan;
	this.daylight = dl;
	this.DLname = dlName;
	this.DLStartMonth = dlsm;
	this.DLStartDay = {value:undefined,weekday:undefined};
	this.DLStartDay.value = dlsd;
	this.DLStartDay.weekday = dlsw;
	this.DLStartHour = dlsh;
	this.DLEndMonth = dlem;
	this.DLEndDay = {value:undefined,weekday:undefined};
	this.DLEndDay.value = dled;
	this.DLEndDay.weekday = dlew;
	this.DLEndHour = dleh;
	timezones.push(this);
}

new timezoneRule("TIA",0);
new timezoneRule("TZ1S",1,2,"TZ1D",4,2,4,8,0,3,7,7);
new timezoneRule("TZ2D",-5,-6,"TZ2S",9,1,10,15,0,11,0,0);
new timezoneRule("TZ3S",-1,0,"TZ3D",5,5,6,8,12,5);
new timezoneRule("TZ4",-8);
new timezoneRule("TZ5S",6,7,"TZ5D",4,22,5,11,3,4);
new timezoneRule("TZ6S",5,6,"TZ6D",5,0,1,13,2,0,2,2);
new timezoneRule("TZ7S",-10,-9,"TZ7D",6,27,24,7,1,0);
new timezoneRule("TZ8",-13);
new timezoneRule("TZ9",13);

function getArbTime(AHOS,unixTS){
	if(unixTS==undefined){
		var milliseconds = nowInMS();
	}else{
		var milliseconds = unixTS+MIL_OFFSET;
	}
	var arbSS = Math.floor(milliseconds/ARB_SS_LENGTH);
	var arb1001D = Math.floor(arbSS/ARB_1001D_LENGTH());
	var arbSof1001D = smartMod(arbSS,ARB_1001D_LENGTH());
	if(arbSof1001D<89864712){
		var arb1M = Math.floor(arbSof1001D/ARB_MM_LENGTH);
		var arbSofM = smartMod(arbSof1001D,ARB_MM_LENGTH);
	}else{
		var arb1M = 1426424;
		var arbSofM = arbSof1001D-89864712;
	}
	var arbMM = (arb1001D*1426425)+arb1M;
	var arbHH = Math.floor(arbMM/ARB_HH_LENGTH)+AHOS;
	var arbDD = Math.floor(arbHH/ARB_DD_LENGTH);
	var arb27Y = Math.floor(arbDD/ARB_27Y_LENGTH());
	var arbDof27Y = smartMod(arbDD,ARB_27Y_LENGTH());
	if(arbDof27Y<9928){
		var arb3Y = Math.floor(arbDof27Y/ARB_3Y_LENGTH());
		var arbDof3Y = smartMod(arbDof27Y,ARB_3Y_LENGTH());
	}else{
		var arb3Y = 8;
		var arbDof3Y = arbDof27Y-9928;
	}
	if(arbDof3Y<826){
		var arb1Y = Math.floor(arbDof3Y/ARB_YY_LENGTH);
		var arbDofYY = smartMod(arbDof3Y,ARB_YY_LENGTH);
	}else{
		var arb1Y = 2;
		var arbDofYY = arbDof3Y-826;
	}
	var arbYY = (arb27Y*27)+(arb3Y*3)+arb1Y+1810;
	if(arbDofYY<27){
		arbMon = 1; //27
		arbDofMon = arbDofYY+1;
	}else if(arbDofYY<55){
		arbMon = 2; //28
		arbDofMon = arbDofYY-26;
	}else if(arbDofYY<82){
		arbMon = 3; //27
		arbDofMon = arbDofYY-54;
	}else if(arbDofYY<108){
		arbMon = 4; //26
		arbDofMon = arbDofYY-81;
	}else if(arbDofYY<138){
		arbMon = 5; //30
		arbDofMon = arbDofYY-107;
	}else if(arbDofYY<165){
		arbMon = 6; //27
		arbDofMon = arbDofYY-137;
	}else if(arb1Y==2){
		if(arb3Y==8){
			if(arbDofYY<194){
				arbMon = 7; //29
				arbDofMon = arbDofYY-164;
			}else if(arbDofYY<222){
				arbMon = 8; //28
				arbDofMon = arbDofYY-193;
			}else if(arbDofYY<249){
				arbMon = 9; //27
				arbDofMon = arbDofYY-221;
			}else if(arbDofYY<278){
				arbMon = 10; //29
				arbDofMon = arbDofYY-248;
			}else if(arbDofYY<305){
				arbMon = 11; //27
				arbDofMon = arbDofYY-277;
			}else if(arbDofYY<333){
				arbMon = 12; //28
				arbDofMon = arbDofYY-304;
			}else if(arbDofYY<360){
				arbMon = 13; //27
				arbDofMon = arbDofYY-332;
			}else if(arbDofYY<388){
				arbMon = 14; //28
				arbDofMon = arbDofYY-359;
			}else{
				arbMon = 15; //28
				arbDofMon = arbDofYY-387;
			}
		}else{
			if(arbDofYY<193){
				arbMon = 7; //28
				arbDofMon = arbDofYY-164;
			}else if(arbDofYY<221){
				arbMon = 8; //28
				arbDofMon = arbDofYY-192;
			}else if(arbDofYY<248){
				arbMon = 9; //27
				arbDofMon = arbDofYY-220;
			}else if(arbDofYY<277){
				arbMon = 10; //29
				arbDofMon = arbDofYY-247;
			}else if(arbDofYY<304){
				arbMon = 11; //27
				arbDofMon = arbDofYY-276;
			}else if(arbDofYY<332){
				arbMon = 12; //28
				arbDofMon = arbDofYY-303;
			}else if(arbDofYY<359){
				arbMon = 13; //27
				arbDofMon = arbDofYY-331;
			}else if(arbDofYY<387){
				arbMon = 14; //28
				arbDofMon = arbDofYY-358;
			}else{
				arbMon = 15; //28
				arbDofMon = arbDofYY-386;
			}
		}
	}else if(arbDofYY<191){
		arbMon = 7; //26
		arbDofMon = arbDofYY-164;
	}else if(arbDofYY<219){
		arbMon = 8; //28
		arbDofMon = arbDofYY-190;
	}else if(arbDofYY<246){
		arbMon = 9; //27
		arbDofMon = arbDofYY-218;
	}else if(arbDofYY<275){
		arbMon = 10; //29
		arbDofMon = arbDofYY-245;
	}else if(arbDofYY<302){
		arbMon = 11; //27
		arbDofMon = arbDofYY-274;
	}else if(arbDofYY<330){
		arbMon = 12; //28
		arbDofMon = arbDofYY-301;
	}else if(arbDofYY<357){
		arbMon = 13; //27
		arbDofMon = arbDofYY-329;
	}else if(arbDofYY<385){
		arbMon = 14; //28
		arbDofMon = arbDofYY-356;
	}else{
		arbMon = 15; //28
		arbDofMon = arbDofYY-384;
	}
	arbMofH = smartMod(arbMM,ARB_HH_LENGTH);
	arbHofD = smartMod(arbHH,ARB_DD_LENGTH);
	arbDofW = smartMod(arbDD,ARB_W_LENGTH);
	arbWDName = ArbWeekdays[arbDofW];
	return {
		arbSeconds: arbSofM,
		arbMinutes: arbMofH,
		arbHours: arbHofD,
		arbDay: arbDofMon,
		arbMonth: arbMon,
		arbYear: arbYY,
		arbWeekday: arbWDName,
		arbWeekdayNum: arbDofW
	};
}

function getArbHourOffset(){
	if(timezones[Timezone].daylight==undefined){
		return timezones[Timezone].standard;
	}else{
		var stanArbTime = getArbTime(timezones[Timezone].standard);
		if(stanArbTime.arbMonth<timezones[Timezone].DLStartMonth || stanArbTime.arbMonth>timezones[Timezone].DLEndMonth){
			return timezones[Timezone].standard;
		}else if(stanArbTime.arbMonth>timezones[Timezone].DLStartMonth && stanArbTime.arbMonth<timezones[Timezone].DLEndMonth){
			return timezones[Timezone].daylight;
		}else if(stanArbTime.arbMonth==timezones[Timezone].DLStartMonth){
			if(timezones[Timezone].DLStartDay.weekday==undefined){
				var targetDay = timezones[Timezone].DLStartDay.value;
			}else{
				var firstDayWeekday = smartMod(stanArbTime.arbWeekdayNum-stanArbTime.arbDay+1,ARB_W_LENGTH);
				var daysToAdd = smartMod(timezones[Timezone].DLStartDay.weekday-firstDayWeekday,ARB_W_LENGTH)
				var targetDay = (timezones[Timezone].DLStartDay.value*ARB_W_LENGTH)+1+daysToAdd;
			}
			if(stanArbTime.arbDay<targetDay){
				return timezones[Timezone].standard;
			}else if(stanArbTime.arbDay>targetDay){
				return timezones[Timezone].daylight;
			}else if(stanArbTime.arbDay==targetDay){
				if(stanArbTime.arbHours<timezones[Timezone].DLStartHour){
					return timezones[Timezone].standard;
				}else{
					return timezones[Timezone].daylight;
				}
			}
		}else if(stanArbTime.arbMonth==timezones[Timezone].DLEndMonth){
			if(timezones[Timezone].DLEndDay.weekday==undefined){
				var targetDay = timezones[Timezone].DLEndDay.value;
			}else{
				var firstDayWeekday = smartMod(stanArbTime.arbWeekdayNum-stanArbTime.arbDay+1,ARB_W_LENGTH);
				var daysToAdd = smartMod(timezones[Timezone].DLEndDay.weekday-firstDayWeekday,ARB_W_LENGTH)
				var targetDay = (timezones[Timezone].DLEndDay.value*ARB_W_LENGTH)+1+daysToAdd;
			}
			if(stanArbTime.arbDay<targetDay){
				return timezones[Timezone].daylight;
			}else if(stanArbTime.arbDay>targetDay){
				return timezones[Timezone].standard;
			}else if(stanArbTime.arbDay==targetDay){
				if(stanArbTime.arbHours<timezones[Timezone].DLEndHour){
					return timezones[Timezone].daylight;
				}else{
					return timezones[Timezone].standard;
				}
			}
		}
	}
}

function zeropad(number){
	if(number>=10){
		return number;
	}else{
		return "0" + number;
	}
}

function changeTZInfo(){
	var AHOffset = getArbHourOffset();
	if(AHOffset==timezones[Timezone].standard){
		document.getElementById("tzname").innerHTML = timezones[Timezone].name;
	}else{
		document.getElementById("tzname").innerHTML = timezones[Timezone].DLname;
	}
	if(AHOffset<0){
		document.getElementById("tzoffset").innerHTML = AHOffset;
	}else{
		document.getElementById("tzoffset").innerHTML = "+" + AHOffset;
	}
}

function runClock(){
	var arbTime = getArbTime(getArbHourOffset());
	changeClock(arbTime.arbYear + "-" + zeropad(arbTime.arbMonth) + "-" + zeropad(arbTime.arbDay) + " " + arbTime.arbWeekday + " " + zeropad(arbTime.arbHours) + "." + zeropad(arbTime.arbMinutes) + "." + zeropad(arbTime.arbSeconds));
	changeTZInfo();
	updater = setTimeout(runClock,40);
}

runClock();