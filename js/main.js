/*jshint devel: true*/
/*global Modernizr: true*/
/*global TweenMax: true*/

$(document).ready(function(){

	var $m = {

		init : function(){

			console.log('module init()...');

			$m.s.ltIe9 = $m.ltIe9(); // tests for IE8 and under...
			//$m.inputType.listeners.mouse(); // touch is set as tue initially... this listener waits for mouse interaction
			$m.answers.init();

		}, // end of init fnc

		s : {

			touch : true, // will be updated to false when the 'window' registers a mouse action...

			ani : 0.25,

			col : {
				//'drkGray' : 'rgb(27, 27, 27)', // '#1b1b1b'
			},

			dom : {
				mod : $('.module')
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

			init : function(){

				var $mod = $m.s.dom.mod, // get module reference from settings
					$ans = $mod.find('ul.answer-shell'); // find the answer-shell DOM reference

				$m.s.dom.ans = $ans; // store the answer-shell in the global settings

				$m.answers.listeners($ans); // add in the event listeners

			}, // end of init fnc

			listeners : function($ans){

				$ans.on('click', 'li', function(){

					var $type = $ans.attr('data-type');

					if($type === 'copy'){ // ...if the answers-shell is displaying the question copy

						//console.log('answer copy is being displayed...');

						$m.answers.actions.copy.onclick.init($ans);

					}else{ // ...if the answers-shell is displaying the results

						$m.answers.actions.graph.onclick.init();

					} // end of if statement

				}).on('mouseover', 'li', function(){

					var $type = $ans.attr('data-type');

					if($type === 'copy'){ // ...if the answers-shell is displaying the question copy

						//console.log('answer copy is being displayed...');

						$m.answers.actions.copy.onmouseover($(this));

					}else{ // ...if the answers-shell is displaying the results

						$m.answers.actions.graph.onmouseover($(this));

					} // end of if statement

				}).on('mouseleave', 'li', function(){

					var $type = $ans.attr('data-type');

					if($type === 'copy'){ // ...if the answers-shell is displaying the question copy

						//console.log('answer copy is being displayed...');

						$m.answers.actions.copy.onmouseleave($(this));

					}else{ // ...if the answers-shell is displaying the results

						$m.answers.actions.graph.onmouseleave($(this));

					} // end of if statement

				});

			}, // end of listeners fnc

			actions : {

				copy : {

					onclick : {

							init : function($ans){

								var $ani = $m.s.ani, // get the animation speed
									$del = 0.5, // the delay counter spacing out each answer list item animation
						/* ---> */	$len = 3, // get the length from the settings that will already be found out when populating the data initially...
									$li, $cpy, $res, $bar, $num, $dyn, $per; // nulls to be set during for loop...

								for(var $i = 0; $i < $len; $i++){

									$li = $ans.find('li[data-num="' + $i + '"]'); // find the current list item
									$cpy = $li.find('.copy'); // the answer copy that will be faded out to make way for the results
									$res = $li.find('.results'); // results container that will be set to display block
									$bar = $res.find('.bar'); // the bar that will animate to final width via TweenMax
									$num = $res.find('.number'); // the whole number (dynamic interger + percentage sign) 
									$dyn = $num.find('.dynamic'); // the interger that will dynamicly increase via TweenMax

									$per = {
										cur : 0,
										end : 33
									};

									TweenMax.to($cpy, $ani, {'opacity' : '0', 'delay' : $del * $i, 'onComplete' : $m.answers.actions.copy.onclick.tweenMax.copyComplete, 'onCompleteParams' : [$cpy, $res]});

									$res.css({'display' : 'block'});

									TweenMax.to($bar, ($ani * 5), {'width' : '100px', 'delay' : ($del * $i) + $ani});

									TweenMax.to($num, 1, {'opacity' : '1', 'delay' : ($del * $i) + $ani});

									TweenMax.to($per, ($ani * 5), {cur : $per.end, 'delay' : ($del * $i) + $ani, 'onUpdate' : $m.answers.actions.copy.onclick.tweenMax.percentageUpdate, 'onUpdateParams' : [$per, $dyn]});

								} // end of for loop

							}, // end of init fnc

							tweenMax : {

								copyComplete : function($cpy, $res){

									$cpy.css({'display' : 'none'});

									$res.css({'display' : 'block'});
								
								}, // end of copyComplete fnc

								percentageUpdate : function($per, $dyn){

									console.log('current percentage = ' + $per.cur);

									$dyn.text($per.cur);

								} // end of percentageUpdate fnc

							} // end of tweenMax fnc

					}, // end of onclick obj

					onmouseover : function($this){

						var $cpy = $this.find('.copy'),
							$cpyWth = parseInt($cpy.css('width'), 10),
							$ansWth = 580; // the width of the answer-shell

						if($cpyWth > $ansWth){

							var	$dis = $cpyWth - ($ansWth - 50), // the distance that the copy needs to animate to... (-50) = some padding to get the content into the frame
								$ani = $dis * 0.02; // find out how long to animate the copy for... 0.02s per pixel

							//console.log('**ANIMATE IN** $data-num="' + $this.attr('data-num') + '"   |   $cpyWth = ' + $cpyWth + '   |   $ansWth = ' + $ansWth + '   |   $dis = ' + $dis + '   |   $ani = ' + $ani);

							TweenMax.to($cpy, $ani, {'left' : '-' + $dis + 'px'});
							//$cpy.animate({'left' : '-' + $dis + 'px'}, $ani);

						} // end of if statement

					}, // end of onmouseover fnc

					onmouseleave : function($this){

						var $cpy = $this.find('.copy'),
							$cpyWth = parseInt($cpy.css('width'), 10),
							$ansWth = 580; // the width of the answer-shell

						if($cpyWth > $ansWth){

							//console.log('**ANIMATE OUT** $data-num="' + $this.attr('data-num') + '" $cpyWth = ' + $cpyWth + '   |   $ansWth = ' + $ansWth);

							var $ani = $m.s.ani;

							TweenMax.to($cpy, $ani, {'left' : '0'});
							//$cpy.animate({'left' : '0'}, $ani);

						} // end of if statement

					} // end of onmouseleave fnc

				}, // end of copy obj

				graph : {


				} // end of graph onj
			}

		} // end of answers obj

	}; // end of module obj

	(function(){

		$m.init();

	})();

}); // end of document ready...















