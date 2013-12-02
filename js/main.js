/*jshint devel: true*/
/*global Modernizr: true*/
/*global TweenMax: true*/

$(document).ready(function(){

	var $m = {

		init : function(){

			var $mod = $('.module'); // get module reference from the DOM

			$m.s.ltIe9 = $m.ltIe9(); // tests for IE8 and under...
			//$m.inputType.listeners.mouse(); // touch is set as tue initially... this listener waits for mouse interaction
			$m.answers.init($mod);
			$m.advert.init($mod);

		}, // end of init fnc

		s : {

			touch : true, // will be updated to false when the 'window' registers a mouse action...

			ani : 0.25,

			curDis : 'copy', // variable that represents the current state of the module i.e 'copy' OR 'results'

			col : {
				//'drkGray' : 'rgb(27, 27, 27)', // '#1b1b1b'
			},

			dom : {
				// mod : $('.module')
				// $cpy : $('.copy-shell'),
				// ans : $('ul.answer-shell')
			}

		}, // end of setting obj

		svgTest : function(){

			if (Modernizr.svg){ // check with Modernizer if the current broswer supports SVG (if yes then we can animate with TweenMax for all map interactivity)

				return true;

			}else{

				return false;

			} // end of if statement

		}, // end of svgTest fnc

		ltIe9 : function(){

			var $ltIe9 = $('html').hasClass('lt-ie9');

			//console.log('$ltIe9 = ' + $ltIe9);

			return $ltIe9;

		}, // end of ltIe9 fnc

		inputType : {

			listeners : {

				touch : function(){

					//console.log('testing for touch...');

					var $mod = $m.s.dom.mod;

					$mod.on('touchstart.usingTouch', function(){ // if the body is effected by a touch then do not execute the dynamic mouse scrolling from the 'mousemove' function on the $chfCon...

						$m.inputType.actions.touch();

					});

				}, // end of touch obj

				mouse : function(){

					//console.log('adding mouse listener...');

					var $mod = $m.s.dom.mod;

					$mod.on('mousemove.usingMouse', function(){ // if the body is effected via ouse then execute the dynamic mouse scrolling from the 'mousemove' function on the $chfCon...

						$m.inputType.actions.mouse();

					});

				} // end of mouse obj

			}, // end of listeners obj

			actions : {

				touch : function(){

					var $mod = $m.s.dom.mod;

					$m.s.touch = true;

					$mod.off('.usingTouch'); // now that touch input has been verified... turn off the touch input listener as we do not need it any more

					$m.inputType.listeners.mouse(); // now that touch has been verified... turn on the mouse input listener encase the user interaction type changes

				}, // end of touch obj

				mouse : function(){

					var $mod = $m.s.dom.mod;

					$m.s.touch = false;

					$mod.off('.usingTouch'); // now that mouse input has been verified... turn off the mouse input listener as we do not need it any more

					$m.inputType.listeners.mouse(); // now that mouse input has been verified... turn on the touch input listener encase the user interaction type changes

				} // end of mouse obj

			} // end of actions obj

		}, // end of inputType obj

		answers : {

			init : function($mod){

				var $cpy = $mod.find('.copy-shell'),
					$ans = $cpy.find('ul.answer-shell'); // find the answer-shell DOM reference

				$m.s.dom.cpy = $cpy; // store the copy-shell in the global settings
				$m.s.dom.ans = $ans; // store the answer-shell in the global settings

				$m.answers.listeners($ans); // add in the event listeners

			}, // end of init fnc

			listeners : function($ans){

				$ans.on('click', 'li', function(){

					var $type = $m.s.curDis;

					if($type === 'copy'){ // ...if the answers-shell is displaying the question copy

						//console.log('answer copy is being displayed...');

						$m.answers.actions.chooseOption($ans);

					}else{ // ...if the answers-shell is displaying the results

						//$m.answers.actions.graph.onclick.init();

					} // end of if statement

				}).on('mouseenter', 'li', function(){

					var $type = $m.s.curDis;

					if($type === 'copy'){ // ...if the answers-shell is displaying the question copy

						//console.log('answer copy is being displayed...');

						$m.answers.actions.scrollCopy($(this));

					}else{ // ...if the answers-shell is displaying the results

						$m.answers.actions.showCopy($(this));

					} // end of if statement

				}).on('mouseleave', 'li', function(){

					var $type = $m.s.curDis;

					if($type === 'copy'){ // ...if the answers-shell is displaying the question copy

						//console.log('answer copy is being displayed...');

						$m.answers.actions.resetCopy($(this));

					}else{ // ...if the answers-shell is displaying the results

						$m.answers.actions.showGraph($(this), 0);

					} // end of if statement

				});

			}, // end of listeners fnc

			actions : {

				startTimer : function($len){

					console.log('running the timer...');

					var $cpy = $m.s.dom.cpy,
						$ani = 2 * $len, // animation speed of the timer... timer will take one second for each answer in the design...
						$tmr = $cpy.find('.question-shell').find('.timer'); // get the timer DOM reference

					$tmr.css({'display' : 'block'});

					TweenMax.to($tmr, $ani, {'width' : '100%', 'onComplete' : $m.advert.actions.showAdvert, 'onCompleteParams' : [$tmr]});

				}, // end of startTimer

				showGraph : function($this, $i){

					//console.log('**SHOW GRAPH**');

					var	$ani = $m.s.ani, // get the animation speed
						$del = 0.5, // the delay counter spacing out each answer list item animation
						$cpy = $this.find('.copy'), // the answer copy that will be faded out to make way for the results
						$res = $this.find('.results'), // results container that will be set to display block
						$bar = $res.find('.bar'), // the bar that will animate to final width via TweenMax
						$num = $res.find('.number'), // the whole number (dynamic interger + percentage sign) 
						$dyn = $num.find('.dynamic'), // the interger that will dynamicly increase via TweenMax
						$per = {
							cur : 0,
							end : 33
						};

					/*if(isNaN($i)){ // if $i has not been defined then this function is not being used as a part of a loop...

						console.log('$i has not been defined...');

						$i = 0; // ... therefore we only need to use standard delays as only one <li> is being animated

					} // end of if statement*/

					// deal with copy...
					TweenMax.to($cpy, $ani, {'left' : '0', 'opacity' : '0', 'delay' : $del * $i, 'onComplete' : $m.answers.actions.swapView, 'onCompleteParams' : ['results', $cpy, $res]}); // fade out copy then swap the display proporities of the copy and results DOM elements
					
					// deal with results...
					TweenMax.to($bar, ($ani * 5), {'width' : '100px', 'delay' : ($del * $i) + $ani}); // extend the bar to its apropriate size
					TweenMax.to($num, 1, {'opacity' : '1', 'delay' : ($del * $i) + $ani}); // fade in the results number
					TweenMax.to($per, ($ani * 5), {cur : $per.end, 'delay' : ($del * $i) + $ani, 'onUpdate' : $m.answers.actions.percentageUpdate, 'onUpdateParams' : [$per, $dyn]}); // update the results number during the bar extension... ending on the correct amount

				}, // end of showGraph fnc

				showCopy : function($this){

					//console.log('**SHOW COPY**');

					var	$ani = $m.s.ani, // get the animation speed
						$cpy = $this.find('.copy'), // the answer copy that will be faded out to make way for the results
						$res = $this.find('.results'), // results container that will be set to display block
						$bar = $res.find('.bar'), // the bar that will animate to final width via TweenMax
						$num = $res.find('.number'), // the whole number (dynamic interger + percentage sign) 
						$dyn = $num.find('.dynamic'), // the interger that will dynamicly increase via TweenMax
						$per = {
							cur : 33,
							end : 33
						};

					// deal with results...
					TweenMax.to($bar, $ani, {'width' : '0', 'onComplete' : $m.answers.actions.swapView, 'onCompleteParams' : ['copy', $cpy, $res]}); // contract the bar to 0 width
					TweenMax.to($num, $ani, {'opacity' : '0'}); // fade out the results number
					TweenMax.to($per, $ani, {cur : 0, 'onUpdate' : $m.answers.actions.percentageUpdate, 'onUpdateParams' : [$per, $dyn]}); // update the results number during the bar contraction... ending on 0

					// deal with copy...
					TweenMax.to($cpy, $ani, {'opacity' : '1', 'delay' : $ani}); // fade out copy then swap the display proporities of the copy and results DOM elements

					$m.answers.actions.scrollCopy($this); // if nesesssary - begin scrolling copy...

				}, // end of showCopy fnc

				swapView : function($type, $cpy, $res){

					if($type === 'copy'){

						$cpy.css({'display' : 'block'}); // show the copy DOM element
						$res.css({'display' : 'none'}); // hide the results DOM element

					}else{

						$cpy.css({'display' : 'none'}); // hide the copy DOM element
						$res.css({'display' : 'block'}); // show the results DOM element

					} // end of if statement
				
				}, // end of swapView fnc

				percentageUpdate : function($per, $dyn){

					//console.log('current percentage = ' + $per.cur);

					$dyn.text($per.cur);

				}, // end of percentageUpdate fnc

				chooseOption : function($ans){

					$m.s.curDis = 'results';

					// SUBMIT THE CHOICE VIA PHP AND WRITE A DOC IN THE CORRECT FOLDER WITH EXACT DATA/TIME/MILLISECONDS

					// GET THE RESULTS FROM PHP DOC THAT COUNTS THE SUBMISSIONS

					var $len = 3, // get the length from the settings that will already be found out when populating the data initially...
						$li; // null to populate the current <li> during the for loop...

					for(var $i = 0; $i < $len; $i++){

						$li = $ans.find('li[data-num="' + $i + '"]'); // find the current list item

						$m.answers.actions.showGraph($li, $i);

					} // end of for loop

					$m.answers.actions.startTimer($len, $ans);

				}, // end of chooseOption fnc

				scrollCopy : function($this){

					var $cpy = $this.find('.copy'),
						$cpyWth = parseInt($cpy.css('width'), 10),
						$ansWth = 580; // the width of the answer-shell

					if($cpyWth > $ansWth){

						var	$dis = $cpyWth - ($ansWth - 50), // the distance that the copy needs to animate to... (-50) = some padding to get the content into the frame
							$ani = $dis * 0.02; // find out how long to animate the copy for... 0.02s per pixel

						//console.log('**ANIMATE IN** $data-num="' + $this.attr('data-num') + '"   |   $cpyWth = ' + $cpyWth + '   |   $ansWth = ' + $ansWth + '   |   $dis = ' + $dis + '   |   $ani = ' + $ani);

						TweenMax.to($cpy, $ani, {'left' : '-' + $dis + 'px'});

					} // end of if statement

				}, // end of scrollCopy fnc

				resetCopy : function($this){

					var $ani = $m.s.ani,
						$cpy = $this.find('.copy');

					TweenMax.to($cpy, $ani, {'left' : '0'});

					/*var $cpy = $this.find('.copy'),
						$cpyWth = parseInt($cpy.css('width'), 10),
						$ansWth = 580; // the width of the answer-shell

					if($cpyWth > $ansWth){

						//console.log('**ANIMATE OUT** $data-num="' + $this.attr('data-num') + '" $cpyWth = ' + $cpyWth + '   |   $ansWth = ' + $ansWth);

						var $ani = $m.s.ani;

						TweenMax.to($cpy, $ani, {'left' : '0'});

					} // end of if statement*/

				} // end of resetCopy fnc

			} // end of actions obj

		}, // end of answers obj

		advert : {

			init : function($mod){

				var $adv = $mod.find('.advert-shell'),
					$cta = $adv.find('a.call-to-action');

				$m.s.dom.adv = $adv; // store the advert-shell in the global settings
				$m.s.dom.cta = $cta; // store the call-to-action in the global settings

				$m.advert.listeners($adv, $cta);

			}, // end of init fnc

			listeners : function($adv, $cta){

				var $ani = $m.s.ani; // get the animation speed

				$adv.on('click', '.icon', function(){

					$m.advert.actions.hideAdvert($adv, $ani);

				}).on('mouseenter', '.icon', function(){

					$m.advert.actions.iconEnter($cta, $ani);

				}).on('mouseleave', '.icon', function(){

					$m.advert.actions.iconLeave($cta, $ani);

				});

			}, // end of listeners fnc

			actions : {

				showAdvert : function($tmr){

					console.log('---> show advert');

					var $ani = 1, //$m.s.ani,
						$adv = $m.s.dom.adv;

					TweenMax.to($tmr, $ani, {'opacity' : '0', 'onComplete' : $m.advert.actions.changeDisplay, 'onCompleteParams' : ['hide', $tmr]}); // fade out timer...

					$adv.css({'display' : 'block'}); // show advert-shell
					TweenMax.to($adv, $ani, {'opacity' : '1'}); // fade in advert-shell

				}, // end of showAdvert fnc

				hideAdvert : function($adv, $ani){

					TweenMax.to($adv, $ani, {'opacity' : '0', 'onComplete' : $m.advert.actions.changeDisplay, 'onCompleteParams' : ['hide', $adv]});

				}, // end of hideAdvert fnc

				iconEnter : function($cta, $ani){

					TweenMax.to($cta, $ani, {'opacity' : '0.5'}); // fade out the call-to-action advert slightly when hovering over the close icon...

				}, // end of iconEnter fnc

				iconLeave : function($cta, $ani){

					TweenMax.to($cta, $ani, {'opacity' : '1'}); // fade the call-to-action advert sback in when hovering off the close icon...

				}, // end of iconLeave

				changeDisplay : function($cmd, $this){

					if($cmd === 'show'){ // if the command sent from the function call askes to show the selected element...

						$this.css({'display' : 'block'});

					}else if($cmd === 'hide'){ // .. if not then hide it...

						$this.css({'display' : 'none'});

					} // end of if statement

				} // end of changeDisplay fnc

			} // end of actions obj

		} // end of advert obj

	}; // end of module obj

	(function(){

		$m.init();

	})();

}); // end of document ready...















