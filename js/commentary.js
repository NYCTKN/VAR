window.onload = init;

function init(){
	
	var xhr = new XMLHttpRequest(); //AJAX data request sent to server(in this case server being local json file)
	var streamJSON = '../sc/streamcontrol.json'; //specifies path for streamcontrol output json
	var scObj; //variable to hold data extracted from parsed json
	var startup = true; //flag for if looping functions are on their first pass or not
	var animated = false; //flag for if scoreboard animation has run or not
	var cBust = 0; //variable to hold cache busting value
	var game; //variable to hold game value from streamcontrol dropdown
	var playerContainer1 = $('#player--container-1'); //variables to shortcut copypasting text resize functions
	var playerContainer2 = $('#player--container-2');
	var roundContainer = $('#round--container');
    var setContainer = $('#set--container');
	
	xhr.overrideMimeType('application/json'); //explicitly declares that json should always be processed as a json filetype
	
	function pollJSON() {
		xhr.open('GET',streamJSON+'?v='+cBust,true); //string query-style cache busting, forces non-cached new version of json to be opened each time
		xhr.send();
		cBust++;		
	}
	
	pollJSON();
	setInterval(function(){pollJSON();},500); //runs polling function twice per second
	
	xhr.onreadystatechange = parseJSON; //runs parseJSON function every time XMLHttpRequest ready state changes
	
	function parseJSON() {
		if(xhr.readyState === 4){ //loads data from json into scObj variable each time that XMLHttpRequest ready state reports back as '4'(successful)
			scObj = JSON.parse(xhr.responseText);
			console.log(scObj);
            scoreboard();
		}
	}
	
    function scoreboard() {
        getData();
    }

    setTimeout(scoreboard,300);

    function getData(){
		
		var p1Name = scObj['p1Name']; //creates local variables to store data parsed from json
		var p2Name = scObj['p2Name'];
		var p1Team = scObj['p1Team'];
		var p2Team = scObj['p2Team'];
		var p1Score = scObj['p1Score'];
		var p2Score = scObj['p2Score'];
		var round = scObj['round'];
		var set = scObj['set'];
		
		if(startup == true){
			
			// TweenMax.set('#playerContainer1per',{css:{x: p1Move}}); //sets name/round wrappers to starting positions for them to animate from
			// TweenMax.set('#playerContainer2per',{css:{x: p2Move}});
			// TweenMax.set('#round',{css:{y: rdMove}});
			
			$('#player--name-1').html(p1Name); //changes html object values to values stored in local variables
			$('#player--name-2').html(p2Name);
			$('#player--team-1').html(p1Team);
			$('#player--team-2').html(p2Team);
			$('#score--player-1').html(p1Score);
			$('#score--player-2').html(p2Score);
			$('#round--value').html(round);
			$('#set--value').html(set);
			
			playerContainer1.each(function(i, playerContainer1){ //function to resize font if text string is too long and causes div to overflow its width/height boundaries
				while(playerContainer1.scrollWidth > playerContainer1.offsetWidth || playerContainer1.scrollHeight > playerContainer1.offsetHeight){
					var newFontSize = (parseFloat($(playerContainer1).css('font-size').slice(0,-2)) * .95) + 'px';
					$(playerContainer1).css('font-size', newFontSize);
				}
			});
			
			playerContainer2.each(function(i, playerContainer2){
				while(playerContainer2.scrollWidth > playerContainer2.offsetWidth || playerContainer2.scrollHeight > playerContainer2.offsetHeight){
					var newFontSize = (parseFloat($(playerContainer2).css('font-size').slice(0,-2)) * .95) + 'px';
					$(playerContainer2).css('font-size', newFontSize);
				}
			});
			
			roundContainer.each(function(i, roundContainer){
				while(roundContainer.scrollWidth > roundContainer.offsetWidth || roundContainer.scrollHeight > roundContainer.offsetHeight){
					var newFontSize = (parseFloat($(roundContainer).css('font-size').slice(0,-2)) * .95) + 'px';
					$(roundContainer).css('font-size', newFontSize);
				}
			});

			setContainer.each(function(i, setContainer){
				while(setContainer.scrollWidth > setContainer.offsetWidth || setContainer.scrollHeight > setContainer.offsetHeight){
					var newFontSize = (parseFloat($(setContainer).css('font-size').slice(0,-2)) * .95) + 'px';
					$(setContainer).css('font-size', newFontSize);
				}
			});
			
			TweenMax.to('#player--container-1',nameTime,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:nameDelay}); //animates wrappers traveling back to default css positions while
			TweenMax.to('#player--container-2',nameTime,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:nameDelay}); //fading them in, timing/delay based on variables set in scoreboard.html
			TweenMax.to('#round--value',rdTime,{css:{y: '+0px', opacity: 1},ease:Quad.easeOut,delay:rdDelay});	
			TweenMax.to('#set--value',rdTime,{css:{y: '+0px', opacity: 1},ease:Quad.easeOut,delay:rdDelay});		
			TweenMax.to('#score--value',scTime,{css:{opacity: 1},ease:Quad.easeOut,delay:scDelay});			
		}
		else{
			game = scObj['game']; //if this is after the first time that getData function has run, changes the value of the local game variable to current json output
			
			if($('#p1Name').text() != p1Name || $('#p1Team').text() != p1Team){ //if either name or team do not match, fades out wrapper and updates them both
				TweenMax.to('#playerContainer1per',.3,{css:{x: p1Move, opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //uses onComplete parameter to execute function after TweenMax
					$('#playerContainer1per').css('font-size',nameSize); //restores default font size based on variable set in scoreboard.html
					$('#p1Name').html(p1Name); //updates name and team html objects with current json values
					$('#p1Team').html(p1Team);					
			
					playerContainer1.each(function(i, playerContainer1){//same resize functions from above
						while(playerContainer1.scrollWidth > playerContainer1.offsetWidth || playerContainer1.scrollHeight > playerContainer1.offsetHeight){
							var newFontSize = (parseFloat($(playerContainer1).css('font-size').slice(0,-2)) * .95) + 'px';
							$(playerContainer1).css('font-size', newFontSize);
						}
					});
					
					TweenMax.to('#playerContainer1per',.3,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:.2}); //fades name wrapper back in while moving to original position
				}});
			}
			
			if($('#p2Name').text() != p2Name || $('#p2Team').text() != p2Team){
				TweenMax.to('#playerContainer2per',.3,{css:{x: p2Move, opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){
					$('#playerContainer2per').css('font-size',nameSize);
					$('#p2Name').html(p2Name);
					$('#p2Team').html(p2Team);					
			
					playerContainer2.each(function(i, playerContainer2){
						while(playerContainer2.scrollWidth > playerContainer2.offsetWidth || playerContainer2.scrollHeight > playerContainer2.offsetHeight){
							var newFontSize = (parseFloat($(playerContainer2).css('font-size').slice(0,-2)) * .95) + 'px';
							$(playerContainer2).css('font-size', newFontSize);
						}
					});
					
					TweenMax.to('#playerContainer2per',.3,{css:{x: '+0px', opacity: 1},ease:Quad.easeOut,delay:.2});
				}});
			}
			
			if($('#round').text() != round){
				TweenMax.to('#round',.3,{css:{opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //same format as changing names just no change in positioning, only fade in/out
					$('#round').css('font-size',rdSize);
					$('#round').html(round);					
			
					roundContainer.each(function(i, roundContainer){
						while(roundContainer.scrollWidth > roundContainer.offsetWidth || roundContainer.scrollHeight > roundContainer.offsetHeight){
							var newFontSize = (parseFloat($(roundContainer).css('font-size').slice(0,-2)) * .95) + 'px';
							$(roundContainer).css('font-size', newFontSize);
						}
					});
					
					TweenMax.to('#round',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.2});
				}});
			}

			if($('#set').text() != set){
				TweenMax.to('#set',.3,{css:{opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){ //same format as changing names just no change in positioning, only fade in/out
					$('#set').css('font-size',rdSize);
					$('#set').html(round);					
			
					setContainer.each(function(i, setContainer){
						while(setContainer.scrollWidth > setContainer.offsetWidth || setContainer.scrollHeight > setContainer.offsetHeight){
							var newFontSize = (parseFloat($(roundContainer).css('font-size').slice(0,-2)) * .95) + 'px';
							$(setContainer).css('font-size', newFontSize);
						}
					});
					
					TweenMax.to('#set',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.2});
				}});
			}
			
			if($('#p1Score').text() != p1Score){ //same as round, no postioning changes just fade out, update text, fade back in
				TweenMax.to('#p1Score',.3,{css:{opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){
					$('#p1Score').html(p1Score);
					
					TweenMax.to('#p1Score',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.2});
				}});
			}
			
			if($('#p2Score').text() != p2Score){
				TweenMax.to('#p2Score',.3,{css:{opacity: 0},ease:Quad.easeOut,delay:0,onComplete:function(){
					$('#p2Score').html(p2Score);
					
					TweenMax.to('#p2Score',.3,{css:{opacity: 1},ease:Quad.easeOut,delay:.2});
				}});
			}
		}
	}

}