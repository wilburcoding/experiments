version = "20170523a";
setVersion("TFOE Faction Simulator v",version);

var BoxList = function(a){
	this.add = function(b,c){
		if(c === undefined){
			document.getElementById(a).innerHTML = document.getElementById(a).innerHTML + "<li>" + b + "</li>";
		}else{
			document.getElementById(a).innerHTML = document.getElementById(a).innerHTML + "<li id=" + c + ">" + b + "</li>";
		}
	};
	this.remove = function(d){
		document.getElementById(a).removeChild(document.getElementById(d));
	};
};

var fList = new BoxList("factionlist");
var wList = new BoxList("warlist");
var lList = new BoxList("loglist");

var engine = {
	factions:[],
	wars:[],
	logHistory:function(logtext){
		lList.add(this.timedate.getMonthYear() + " - " + logtext);
	},
	timedate:{
		turns:0,
		months:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		getMonthYear:function(){
			tdMonth = this.months[this.turns % 12];
			tdYear = Math.floor(this.turns/12)+1800;
			return tdMonth + " " + tdYear;
		}
	},
	newFac:function(a,b,c,d){
		q = {
			name:a,
			power:b,
			morale:c,
			family:d,
			atWar:0
		};
		this.factions.push(q);
		fList.add(a + " - Culture: " + d,a);
	},
	getFacIndex:function(a){
		j = undefined;
		for(i=0;i<this.factions.length && j==undefined;i++){
			if(this.factions[i].name == a){
				j = i;
			}
		}
		return j;
	},
	killFac:function(name){
		k = this.getFacIndex(name);
		this.factions.splice(k,1);
		fList.remove(name);
	},
	createRandNamedFac:function(e,f,g){
		do{
			if(randnum(0,8)>7){
				var facName = alphabet.randLetter() + alphabet.randLetter() + alphabet.randLetter() + alphabet.randLetter();
			}else{
				var facName = alphabet.randLetter() + alphabet.randLetter() + alphabet.randLetter();
			}
		}
		while(this.getFacIndex(facName) != undefined);
		if(g==undefined){
			this.newFac(facName,e,f,facName);
		}else{
			this.newFac(facName,e,f,g);
		}
		return facName;
	},
	newWar:function(a,b){
		q = {
			side1:this.factions[a].name,
			side2:this.factions[b].name
		};
		this.wars.push(q);
		this.factions[a].atWar = 1;
		this.factions[b].atWar = 1;
		wList.add(q.side1 + " - " + q.side2 + " War",q.side1 + "-" + q.side2);
		this.logHistory(q.side1 + " has declared war on " + q.side2 + "!");
	},
	peace:function(v){
		t = this.wars[v].side1;
		u = this.wars[v].side2;
		wList.remove(t + "-" + u);
		this.factions[this.getFacIndex(t)].atWar = 0;
		this.factions[this.getFacIndex(u)].atWar = 0;
		this.wars.splice(v,1);
	},
	calcHistory:function(){
		if(randnum(0,300)>299){
			this.logHistory("A new faction, the " + this.createRandNamedFac(randnum(100,500),randnum(20,300)) + ", has been founded.");
		}
		for(l=0;l<this.factions.length;l++){
			if(this.factions[l].atWar==0 && randnum(0,600)>599){
				possibleEnemies = [];
				for(m=0;m<this.factions.length;m++){
					if(this.factions[m].atWar==0 && m!=l){
						possibleEnemies.push(m);
					}
				}
				if(possibleEnemies.length>0){
					this.newWar(l,possibleEnemies[randnum(0,possibleEnemies.length-1)]);
				}
			}
			if(randnum(0,2)>1){
				this.factions[l].power = this.factions[l].power + randnum(5,10);
			}
			if(randnum(0,2)>1){
				this.factions[l].morale = this.factions[l].morale + randnum(4,8);
			}
		}
		for(l=0;l<this.wars.length;l++){
			if(randnum(0,7)>6){
				side1Ind = this.getFacIndex(this.wars[l].side1);
				side2Ind = this.getFacIndex(this.wars[l].side2);
				if(randnum(0,1)>0){
					this.factions[side1Ind].power = this.factions[side1Ind].power - randnum(25,40);
					this.factions[side2Ind].power = this.factions[side2Ind].power - randnum(40,55);
					this.factions[side2Ind].morale = this.factions[side2Ind].morale - randnum(40,70);
				}else{
					this.factions[side2Ind].power = this.factions[side2Ind].power - randnum(25,40);
					this.factions[side1Ind].power = this.factions[side1Ind].power - randnum(40,55);
					this.factions[side1Ind].morale = this.factions[side1Ind].morale - randnum(40,70);
				}
				if(this.factions[side1Ind].power<1){
					this.peace(l);
					this.logHistory(this.factions[side1Ind].name + " has fallen after losing its war to " + this.factions[side2Ind].name + ".");
					this.killFac(this.factions[side1Ind].name);
					l--;
				}else if(this.factions[side2Ind].power<1){
					this.peace(l);
					this.logHistory(this.factions[side1Ind].name + " has ANSCHLUSSED " + this.factions[side2Ind].name + "!");
					this.factions[side1Ind].power = this.factions[side1Ind].power + randnum(100,250);
					this.killFac(this.factions[side2Ind].name);
					l--;
				}else if(this.factions[side1Ind].morale<1){
					this.peace(l);
					this.logHistory(this.factions[side1Ind].name + " has lost its war against " + this.factions[side2Ind].name + ".");
					l--;
				}else if(this.factions[side2Ind].morale<1){
					this.peace(l);
					this.logHistory(this.factions[side2Ind].name + " has been defeated by " + this.factions[side1Ind].name + ".");
					l--;
				}
			}
		}
		for(l=0;l<this.factions.length;l++){
			if(randnum(0,400)>399 && this.factions[l].atWar == 0){
				if(this.factions[l].power<150){
					this.logHistory("The " + this.factions[l].name + " has collapsed.");
					this.killFac(this.factions[l].name);
					l--;
				}else if(randnum(0,2)>1){
					if(randnum(0,1)>0){
						this.logHistory("The " + this.factions[l].name + " has been disbanded.");
						this.killFac(this.factions[l].name);
						l--;
					}else{
						this.logHistory(this.createRandNamedFac(randnum(50,250),randnum(20,200),this.factions[l].family) + " has revolted and gained independence from the " + this.factions[l].name + ", which has renamed to the " + this.createRandNamedFac(this.factions[l].power-randnum(50,100),this.factions[l].morale-randnum(50,100),this.factions[l].family));
						this.killFac(this.factions[l].name);
						l--;
					}
				}
			}
		}
	}
};

var paused = true;

function runEngine(){
	engineTimeout = setTimeout(runEngine,100);
	engine.calcHistory();
	engine.timedate.turns++;
}

function stopEngine(){
	clearTimeout(engineTimeout);
}

function startpause(){
	if(paused){
		runEngine();
		paused = false;
		document.getElementById("startbutton").innerHTML = "Pause";
		lList.add("------");
	}else{
		stopEngine();
		paused = true;
		document.getElementById("startbutton").innerHTML = "Resume";
		lList.add("PAUSED");
	}
}

function randnum(min,max){
	return Math.floor((Math.random()*(max-min+1))+min);
}

var alphabet = {
	letterArray:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
	randLetter:function(){
		return this.letterArray[randnum(0,this.letterArray.length-1)];
	}
};

engine.newFac("QMU",200,80,"QMU");
engine.newFac("UPMU",350,170,"UPMU");
engine.newFac("GMA",300,150,"GMA");
engine.newFac("GCA",270,100,"GCA");
lList.add("Click 'Start' to start the simulator!");