$aliensMove = setInterval ("alienAnimation()", 400); //interval for the aliens movement and animation
$alienMargin = 20;
$alienMarginTop = 0;
$goingRight = true;

function alienAnimation() {
	if ($("#aliens-container").height() + $alienMarginTop >= 550) {
		clearInterval($aliensMove);
		gameOver(false)
	}
	if ($(".aliens").attr("src") == "Assets/alien1.png") {
		$(".aliens").attr("src", "Assets/alien2.png");
	}
	else {
		$(".aliens").attr("src", "Assets/alien1.png");
	}
	if ($alienMargin == 20) {
		$goingRight = true;
	}
	if ($alienMargin + $("#aliens-container").width() < 580 && $goingRight == true){
		$alienMargin += 20;
	}
	else {
		$goingRight = false;
		$alienMargin -= 20;
	}
	$("#aliens-container").css("margin-left", $alienMargin);
	if ($alienMargin <= 20 || $alienMargin + $("#aliens-container").width() >= 580) {
		$alienMarginTop += 20;
		$("#aliens-container").css("marginTop", $alienMarginTop);
	}
}

//controls for the rocket
$rocketMargin = 280;
$reload = true;
$points = 0;
$("body").keydown(function(event) {
	$key = event.which;
	if ($key == 37 && $rocketMargin > 20) {
		$rocketMargin -= 10;
		$("#rocket").css("margin-left", $rocketMargin);
	}
	if ($key == 39 && $rocketMargin < 540) {
		$rocketMargin += 10;
		$("#rocket").css("margin-left", $rocketMargin);
	}
	if ($reload == true && ($key == 38 || $key == 13)) {
		$reload = false;
		$reloadTimeout = setTimeout (function() {
			$reload = true;
		}, 1500);
		$("#rocket").after($("<img src='Assets/rocket-bullet.png' class='bullets' id='rocket-bullet'>"));
		$rocket = $("#rocket");
		$rocketPosition = $rocket.offset();
		$("#rocket-bullet").offset({left: $rocketPosition.left + 15, top: $rocketPosition.top});
		$marginTopRocketBullet = 0;
		$rocketBulletInterval = setInterval(function(){
			$("#rocket-bullet").css("margin-top", $marginTopRocketBullet);
			$rocketBulletPosition = $("#rocket-bullet").offset();
			$marginTopRocketBullet -= 5;
			$aliensLeft = $(".aliens").offset();
			if($rocketBulletPosition.top <= 1){
				clearInterval($rocketBulletInterval);
				$("#rocket-bullet").remove();
			}
			$(".aliens").each(function(){
				$alienPosition = $(this).offset();
					$alienLeft = $alienPosition.left;
					$alienLeft += 10;
					$alienRight = $alienPosition.left += $(".aliens").width();
					$alienRight += 20;
					$alienTop = $alienPosition.top;
					$alienBottom = $alienPosition.top += $(".aliens").height();
				$rocketTop = $rocketBulletPosition.top;
				$rocketLeft = $rocketBulletPosition.left;
				$rocketLeft += 20; //middle of rocket
				if ($rocketTop >= $alienTop & $rocketTop <= $alienBottom && $rocketLeft >= $alienLeft && $rocketLeft <= $alienRight) {
						clearInterval($rocketBulletInterval);
						$("#rocket-bullet").remove();
						$alien = $(this);
						setTimeout(function(){
							$($alien).remove();
						},1); //delay required, without the aliens after the hit alien will take its place and will also register as a hit
						$points += 10;
						$("#points").text($points);
						if ($points == 120) {
							gameOver(true);
						}
				}
			})
		}, 10);
	}
})
$alienBulletsFireInterval = setInterval ("alienBullets()", 2000);

//interval for the alien bullets animation
function alienBullets() {
	if ($("#alien-bullet")) {
		$("#alien-bullet").remove();
	}
	$aliensArray = [];
	$(".aliens").each(function() {
		$aliensArray.push(this);
	});
	$number = Math.floor(Math.random()* $aliensArray.length);
	$("#aliens-container").after($("<img src='Assets/alien-bullet.png' class='bullets' id='alien-bullet'>"));
	$alien = $($aliensArray[$number]);
	$alienPosition = $alien.offset();
	$("#alien-bullet").offset({left: $alienPosition.left + 15, top: $alienPosition.top + 25});
	$marginTop = 20;
	$alienBulletInterval = setInterval(function(){
		$("#alien-bullet").css("margin-top", $marginTop);
		$alienBulletPosition = $("#alien-bullet").offset();
		$rocketLeft = $("#rocket").offset();
			$rocketRight = $rocketLeft.left;
			$rocketRight += 40;
		$marginTop += 5;
		if ($alienBulletPosition.top >= 562 && $alienBulletPosition.left >= $rocketLeft.left && $alienBulletPosition.left <= $rocketRight) {
			gameOver(false);
			clearInterval($alienBulletInterval);
		}
		if ($alienBulletPosition.top >= 605) {
			clearInterval($alienBulletInterval);
			$("#alien-bullet").remove();
		}
	}, 10);
}

//end game function
function gameOver(win) {
	if (win == true) {
		$ending = "WON!";
	}
	else {
		$ending = "LOST";
		$("#rocket").remove();
	}
	clearInterval($aliensMove);
	if($alienBulletsFireInterval) {
		clearInterval($alienBulletsFireInterval);
	}
	//errors arise when 'typeof' are not used for the following variables/intervals or when 'typeof' is used for $alienBulletsFireInterval
	if(typeof $reloadTimeout !== 'undefined' && typeof $rocketBulletInterval !== 'undefined'){
		clearInterval($reloadTimeout);
		clearInterval($rocketBulletInterval);
	}
	$reload = false;
	$("#ending").text($ending);
	$("#points-ending").text($("#points").text());
	$("#end-screen").css("display", "block");
	$("body").keydown(function(event) {
		$key = event.which;
		if($key == 32){
			location.reload();
		}
	});
}