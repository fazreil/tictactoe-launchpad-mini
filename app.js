var midiConnector = require('midi-launchpad').connect(1,false);



midiConnector.on("ready",function(launchpad){
	
	console.log("Launchpad ready");
	// launchpad.getButton(2,2).light(launchpad.colors.green.high); //test codes
	// launchpad.getButton(1,1).light(launchpad.colors.green.high);
	// launchpad.getButton(3,3).light(launchpad.colors.green.high);
	launchpad.clear();
	//launchpad.allLight(launchpad.randomColor());
	//launchpad.scrollString("behold Launchpad!!!",100, launchpad.colors.red.high);
	//launchpad.clearScroll();

	var player1 = true;

	
	var territories00 = [launchpad.getButton(0,0),launchpad.getButton(0,1),launchpad.getButton(1,0),launchpad.getButton(1,1)];
	var territories01 = [launchpad.getButton(0,3),launchpad.getButton(0,4),launchpad.getButton(1,3),launchpad.getButton(1,4)];
	var territories02 = [launchpad.getButton(0,6),launchpad.getButton(0,7),launchpad.getButton(1,6),launchpad.getButton(1,7)];
	var territories10 = [launchpad.getButton(3,0),launchpad.getButton(3,1),launchpad.getButton(4,0),launchpad.getButton(4,1)];
	var territories11 = [launchpad.getButton(3,3),launchpad.getButton(3,4),launchpad.getButton(4,3),launchpad.getButton(4,4)];
	var territories12 = [launchpad.getButton(3,6),launchpad.getButton(3,7),launchpad.getButton(4,6),launchpad.getButton(4,7)];
	var territories20 = [launchpad.getButton(6,0),launchpad.getButton(6,1),launchpad.getButton(7,0),launchpad.getButton(7,1)];
	var territories21 = [launchpad.getButton(6,3),launchpad.getButton(6,4),launchpad.getButton(7,3),launchpad.getButton(7,4)];
	var territories22 = [launchpad.getButton(6,6),launchpad.getButton(6,7),launchpad.getButton(7,6),launchpad.getButton(7,7)];

	var territories = [territories00,territories01,territories02,territories10,territories11,territories12,territories20,territories21,territories22];

	var conditions = 
	[ 
	[ [0,0],[0,3],[0,6] ],//row1
	[ [3,0],[3,3],[3,6] ],//row2
	[ [6,0],[6,3],[6,6] ],//row3
	[ [0,0],[3,0],[6,0] ],//col1
	[ [0,3],[3,3],[6,3] ],//col2
	[ [0,6],[3,6],[6,6] ],//col3
	[ [0,0],[3,3],[6,6] ],//dia1
	[ [6,0],[3,3],[0,6] ],//dia2
	];


	launchpad.renderBytes(
		[
		"  y  y  ",
		"  y  y  ",
		"yyyyyyyy",
		"  y  y  ",
		"  y  y  ",
		"yyyyyyyy",
		"  y  y  ",
		"  y  y  ",
		]);
	
	
	launchpad.on("press", function(btn){
		// console.log("pressed:"+
		// 	"x: "+btn.x+"\n"+
		// 	"y: "+btn.y+"\n"+
		// 	"State: "+btn.getState()+"\n"+
		// 	"Special: "+btn.special+"\n"
		// 	);

		/**
		* player 1 = green = 48
		* player 2 = red = 49
		*/
		if(!btn.special){
			color = null;
			if(player1){
				if(btn.getState() == 3){
					console.log(decidePlayer()+", try again");
					player1 = !player1;
				}
				else{		
					renderTerritory(btn.x,btn.y,48);
					color = 48;
				}
			}
			else{
				if(btn.getState() == 48){
					console.log(decidePlayer()+", try again");
					player1 = !player1;
				}
				else{
					renderTerritory(btn.x,btn.y,3);	
					color = 3;
				}
			}
			checkForCompleteLine(color);
			player1 = !player1;
		}
	});

	checkForCompleteLine = function(color){
		// console.log("checkForCompleteLine");
		for(m = 0; m<conditions.length;m++){
			for(n = 0;n<conditions[m].length;n=n+3){
				// console.log(launchpad.getButton(conditions[m][n  ][0],conditions[m][n  ][1]).getState()+","+launchpad.getButton(conditions[m][n+1][0],conditions[m][n+1][1]).getState()+","+launchpad.getButton(conditions[m][n+2][0],conditions[m][n+2][1]).getState())
				// console.log("("+conditions[m][n][0]+","+conditions[m][n][1]+"),("+conditions[m][n+1][0]+","+conditions[m][n+1][1]+"),("+conditions[m][n+2][0]+","+conditions[m][n+2][1]+"):"+determineByColor(m,n)+" and "+coloured(m,n));
				if(determineByColor(m,n) && coloured(m,n)){
					console.log(decidePlayer()+" wins");
					launchpad.scrollString("Winner: "+decidePlayer(),100, color);
				}
			}
		}
	}

	determineByColor = function(m,n){
		cell1 = launchpad.getButton(conditions[m][n  ][0],conditions[m][n  ][1]).getState();
		cell2 = launchpad.getButton(conditions[m][n+1][0],conditions[m][n+1][1]).getState();
		cell3 = launchpad.getButton(conditions[m][n+2][0],conditions[m][n+2][1]).getState();
		return 	cell1 == cell2 && cell2 == cell3;
	}

	coloured = function(m,n){
		return 	launchpad.getButton(conditions[m][n  ][0],conditions[m][n  ][1]).getState() != 0 && launchpad.getButton(conditions[m][n+1][0],conditions[m][n+1][1]).getState() != 0 && launchpad.getButton(conditions[m][n+2][0],conditions[m][n+2][1]).getState() != 0;
	}

	decidePlayer = function(){
		if(player1){
			return "Player 1";
		}
		else{
			return "Player 2";
		}
	}

	renderTerritory = function(x,y,color){
		var button = launchpad.getButton(x,y);
		launchpad.getButton(x,y).light(color);	
		fillTerritory(button,color);
	}

	fillTerritory = function(button,color){
		
		for(j = 0; j<territories.length;j++){
			for( i = 0;i<territories[j].length;i++){
				if(button === territories[j][i])
				{
					for( k=0;k<territories[j].length;k++){
						// console.log("Brighten "+territory[j][i].x +","+territory[j][i].y+"")
						territories[j][k].light(color);
					}
				}
				else{
					// console.log(button.x +" not equal to "+territory[j][i].x+"")
					// console.log(button.y +" not equal to "+territory[j][i].y+"\n")
				}
			}
		}
	}


});