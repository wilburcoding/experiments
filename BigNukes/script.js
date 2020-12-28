version = "20170523b";
setVersion("Mapperdonian Crazy Nuke Tech Simulator v",version);

theBox = document.getElementById("cont");
theCont = document.getElementById("contlist");
toggleButton = document.getElementById("togglebutton");
resetButton = document.getElementById("resetbutton");

contText = "";

function writeToCont(txt){
	contText += "<li>" + txt + "</li>";
	theCont.innerHTML = contText;
	theBox.scrollTop = theBox.scrollHeight;
}

function clearCont(){
	contText = "";
	theCont.innerHTML = "";
}

year = 1900;
month = 0;
day = 1;

months = [];

function Month(name,lengthDays){
    this.name = name;
    this.lengthDays = lengthDays;
}

months.push(new Month("January",31));
months.push(new Month("February",function(y){
	if(y%400 === 0){
		return 29;
	}else if(y%100 === 0){
		return 28;
	}else if(y%4 === 0){
		return 29;
	}else{
		return 28;
	}
}));
months.push(new Month("March",31));
months.push(new Month("April",30));
months.push(new Month("May",31));
months.push(new Month("June",30));
months.push(new Month("July",31));
months.push(new Month("August",31));
months.push(new Month("September",30));
months.push(new Month("October",31));
months.push(new Month("November",30));
months.push(new Month("December",31));

function dLengthDays(LD,YY){
    if(typeof LD == "number"){
        return LD;
    }else if(typeof LD == "function"){
        return LD(YY);
    }else{
        return 30;
    }
}

techLevels = ["Pre-boom","Fireworks","Boom bombs","Dynamite","C4","TNT","Tactical Blasts","Mega Blasts","MOABs","Mini Nukes","Atom bombs","Bigger Nukes","Gigantonukes","Super Nukes","Mega Nukes","Thermonuclear Bombs","H-Bombs","Castle Bravos","Tsar Bombas","X-bombs","Space Nukes","Phase Nukes","Uber Nukes","Lazor Nukes","Phase Lazor Nukes","Cataclysmic Uberphase Nukes","Hypernukes","Warp Nukes","Antimatter Bombs","Lazor-Drive Antimatter Bombs","X-Antimatter Bombs","Planetary Destructodons","Planet Killers","Mother Of All Antimatter Bombs","Gravity Warp Bombs","Boson Destructors","Gravity Mega Nukes","Star Shredders","Graviton Disruptors","Star Shredding Graviton Disruptors","Supernovas","X-Supernovas","Meganovas","Ubernovas","Antimatter Ubernovas","Galactic Gravity Phazors","Field Warp Bombs","Black Hole Nukes","Physics Disruptors","Galaxy Shredders","Dark Energy Nukes","Universal Bombs","Ascended Nukes"];

nationNameStarts = ["Tyranid","Soviet","Ethanian","Monsoonian","Brabrantine","ISIS","Miracine","Rektish","Jedi","Sith","Polish","Motjeblur","Harambeite","Baltorusite","Mapperdonian"];
nationNameMiddles = ["Federative","United","Pony","Grand","Praetorian","Republican","Democratic","Parliamentarian","Communist","Blurish","Islamic","Oligarchic","Religious","Brutish","North Korean","Space","Imperial","Socialist","Mad","Redundant"];
nationNameEnds = ["Republic","Democracy","Union","Collective","Caliphate","RODEBLURdom","Kingdom","Imperium","Empire","Council","Dictatorship","Batranocracy","Juche-State","Jabrildom","System","Redundancy"];

function randNum(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function randomItem(Arr){
    return Arr[randNum(0,Arr.length-1)];
}

function nationName(){
    return randomItem(nationNameStarts) + " " + randomItem(nationNameMiddles) + " " + randomItem(nationNameEnds);
}

nations = [];

function Nation(name,tech){
    if(name!==undefined){
        this.name = name;
    }else{
        this.name = nationName();
    }
    if(tech!==undefined){
        this.tech = tech;
    }else{
        this.tech = 0;
    }
}

function getTechName(n){
    if(n>=techLevels.length){
        return techLevels[techLevels.length-1] + " " + (n-techLevels.length+2);
    }else{
        return techLevels[n];
    }
}

function styleText(txt,cl){
	return "<span class=\"" + cl + "\">" + txt + "</span>";
}

function RUN(){
    var leDate = styleText(months[month].name + " " + day + ", " + year,"boldtext");
    if(Math.random()<0.002 || nations.length<1){
        var newNation = new Nation();
        nations.push(newNation);
        writeToCont(leDate + ": The " + styleText(newNation.name,"bluetext") + " has been " + styleText("founded","greentext") + ".");
    }else{
        for(var id=0;id<nations.length;id++){
            if(Math.random()<0.5){
                var leNation = nations[id];
                leNation.tech++;
                writeToCont(leDate + ": The " + styleText(leNation.name,"bluetext") + " has improved their bomb tech to " + styleText(getTechName(leNation.tech),"redtext"));
            }
        }
    }
	//writeToCont(leDate);
    day++;
    if(day>dLengthDays(months[month].lengthDays,year)){
        month++;
        day = 1;
        if(month>=months.length){
            month = 0;
            year++;
        }
    }
    leTimeout = setTimeout(RUN,20);
}

function stopDis(){
    clearTimeout(leTimeout);
}

function resetSim(){
    stopDis();
    nations = [];
    year = 1900;
    month = 0;
    day = 1;
    clearCont();
}

function buttonPress(doWhat){
	if(doWhat==="toggle"){
		if(toggleButton.innerHTML==="Start the interesting bomb sim"){
			toggleButton.innerHTML = "Stop";
			RUN();
		}else if(toggleButton.innerHTML==="Stop the interesting bomb sim"){
			toggleButton.innerHTML = "Start the interesting bomb sim";
			stopDis();
		}
	}else if(doWhat==="reset"){
		toggleButton.innerHTML = "Start the interesting bomb sim";
		resetSim();
	}
}
