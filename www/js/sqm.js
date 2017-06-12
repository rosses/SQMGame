var user_id = null;

$(document).ready(function() {

	shuf();
	/*$.post("refresh.php", {}, function(html) {
		$(".player").html(html);
	});*/

	$("#login_participar").click(function(e) {
		e.preventDefault();
		var nombre = $.trim($("#nombre").val());
		var email = $.trim($("#email").val());
		var rut = $.trim($("#rut").val());
		var dv = $.trim($("#dv").val());
		var telefono = $.trim($("#telefono").val());
		var bases = ($("#bases").is(":checked") ? 1 : 0);
		var isValid = $.validateRut(rut+'-'+dv, null, { minimumLength: 6 });

		if (nombre == '') {
			$("#nombre").addClass("error");
			$("#nombre").parent().find(".msg_error").show();
		}
		else if (email == '' || !validateEmail(email)) {
			$("#email").parent().find(".msg_error").show();
			$("#email").addClass("error");
		}
		else if (!isValid) {
			$("#rut").parent().find(".msg_error").show();
			$("#rut").addClass("error");
			$("#dv").addClass("error");
		}
		else if (telefono == '' || telefono.length < 9) {
			$("#telefono").parent().find(".msg_error").show();
			$("#telefono").addClass("error");
		}
		else if (bases == 0) {
			$("#bases").parent().find(".msg_error").show();
			$("#bases").addClass("error");
		}
		else {
			$.post("registro.php", {
				email: email, 
				rut: rut+'-'+dv,
				telefono: telefono,
				nombre: nombre,
				sess: $.trim($("#sess").val())
			}, function(data) { 
				user_id = data.user;

				$(".regbox").fadeOut('slow', function() {

					if (parseInt($(document).width()) < 500) { 
						$("html, body").animate({ scrollTop: $(".game").offset().top });
						$(".sombra").hide();
						$(".sombron").hide();
						setTimeout(function() {
							$(".card").removeClass("flipped");
						},1000);

					}
					else {
						$(".sombra").hide();
						$(".sombron").hide();
						setTimeout(function() {
							$(".card").removeClass("flipped");
						},1000);
					}

				});
			}, "json");
		}
	});

	$("#rut,#dv").click(function() { 
		$("#rut").removeClass('error'); 
		$("#dv").removeClass('error'); 
		$(this).parent().find('.msg_error').hide(); 
	});
	$("input").click(function() { 
		$(this).removeClass('error'); 
		$(this).parent().find('.msg_error').hide(); 
	});

	$(".seguir_reload").click(function(e) {
		e.preventDefault();
		$("#numIntentos").html(2);
		$("#game_loser").hide();
		$("#game_winner").hide();
		$(".cover").hide();
		$(".message").hide();
		$(".sombra").hide();
		
		iniciar();
	});

	$("#back_for_loser").click(function(e) {
		e.preventDefault();
		$("#numIntentos").html(2);
		$("#game_loser").hide();
		$("#game_winner").hide();
		$(".cover").hide();
		$(".message").hide();
		$(".sombra").hide();
		iniciar();
	});

	$(".number").keydown(function (e) {
	   if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
	       (e.keyCode == 65 && e.ctrlKey === true) ||
	       (e.keyCode >= 35 && e.keyCode <= 39)) {
	       return;
	   }
	   if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	       e.preventDefault();
	   }
	});

	$(".share_fb").click(function (e) {
		e.preventDefault();
		fbShare('http://www.guanteschool.cl', 'Guante', 'En facebook', 'http://www.guanteschool.cl', 520, 350)
	});
	$(".dv").keydown(function (e) {
		// 75: K
	   if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 75]) !== -1 ||
	       (e.keyCode == 65 && e.ctrlKey === true) ||
	       (e.keyCode >= 35 && e.keyCode <= 39)) {
	       return;
	   }
	   if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	       e.preventDefault();
	   }
	});

	$(".boton_comenzar").click(function (e) {
		e.preventDefault();
		$(".comenzar").fadeOut('slow', function() {
			if (parseInt($(document).width()) < 500) { 
				$(".regbox").fadeIn('fast',function() {
					$("html, body").animate({ scrollTop: $(".regbox").offset().top });	
				});

			}
			else {
				$(".regbox").fadeIn('fast');
			}
		});
		
	});

	$(".boton_coleccion").click(function (e) {
		e.preventDefault();
		$(".game").fadeOut('slow', function() {
			$(".thecollect").fadeIn('fast');
		});
	});
	$(".boton_regresa").click(function (e) {
		e.preventDefault();
		$(".thecollect").fadeOut('slow', function() {
			$(".game").fadeIn('fast');
		});
	});

	iniciar();
	console.log('iniciar');
	
});


$(document).on("click",".card",function() {
	if (!$(this).hasClass("flipped")) {
		$(this).addClass("flipped")
	}

	if ($(".flipped").length == 2) {
		$(".locker").show();
		var rep = [];
		$(".flipped").each(function() {
			rep.push($(this).find(".back>img").attr('src').replace("images/pos","").replace(".png",""));
		});
		setTimeout(function() {
			if (getValidaPar(rep[0], rep[1])) {
					$("#game_loser").hide();
					$(".cover").show();
					$(".message").show();
					$("#game_winner").show();
					$(".sombra").show();
					/*$.post("winner.php", { u: user_id, token: $.trim($("#sess").val()) });*/
					$(".player").html('');
					/*$.post("refresh.php", {}, function(html) {
						$(".player").html(html);
					});*/
					//shuf();
			}
			else {
					var intentos = parseInt($("#numIntentos").html());
					intentos--;
					if (intentos == 0) {
						$("#game_winner").hide();
						$(".cover").show();
						$(".message").show();
						$("#game_loser").show();

						$(".sombra").show();
						$(".player").html('');
						//shuf();
					}
					$("#numIntentos").html(intentos);
			}

			$(".locker").hide();
			$(".flipped").removeClass("flipped");


		},1000);
	}
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function fbShare(url, title, descr, image, winWidth, winHeight) {
var winTop = (screen.height / 2) - (winHeight / 2);
var winLeft = (screen.width / 2) - (winWidth / 2);
window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}

function iniciar() {
	console.log('iniciar call');
	if (parseInt($(document).width()) < 500) { 
		$("html, body").animate({ scrollTop: $(".game").offset().top });
		shuf();
		setTimeout(function() {
			$(".card").removeClass("flipped");
		},1000);

	}
	else {
		shuf();
		setTimeout(function() {
			$(".card").removeClass("flipped");
		},1000);
	}
}


function shuf() {
	var arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
	shuffle2(arr);
	
	var html = "";
	for (var i=1;i<=16;i++) {
		html = html + '<div class="card-in"><div class="card flipped"><figure class="front"><img src="images/cardx2.png" /></figure><figure class="back"><img src="images/posx'+arr[i-1]+'.png" /></figure></div></div>';
	}

	$(".player").html(html);
}
/*
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}*/

function getValidaPar(x,y) {
	var x = x.replace('x','');
	var y = y.replace('x','');
	if (parseInt(x) == 1 && parseInt(y) == 14) { return true; }
	else if (parseInt(x) == 14 && parseInt(y) == 1) { return true; }
	else if (parseInt(x) == 5 && parseInt(y) == 8) { return true; }
	else if (parseInt(x) == 8 && parseInt(y) == 5) { return true; }
	else if (parseInt(x) == 3 && parseInt(y) == 6) { return true; }
	else if (parseInt(x) == 6 && parseInt(y) == 3) { return true; }

	return false;
}

function shuffle2(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
