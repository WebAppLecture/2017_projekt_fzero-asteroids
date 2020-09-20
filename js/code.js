/*
  Ist zwar nicht das beste Werk, aber es macht was es soll:
  Man kann in einer "unendlichen" Welt umher fliegen und Meteoriten zerstören.

  Ein kleiner "bug" ist enthalten.
  Wenn man das Spiel neu Startet kommt es manchmal vor, dass man viel zu schnell ist.
  Da es aber nicht immer auftritt, konnte ich nicht fest machen an was das liegt. ;)

  

  Dokumentation frei nach dem Motto:

    "Guter Code braucht keine Dokumentation!
     Schlechter Code ist es nicht wert Dokumentiert zu werden!"

/*


/*******************************
  SOUND
*******************************/

var soundBul = $('.bullet')[0],
    soundEnd = $('.end')[0],
    soundMusic = $('.music')[0],
    soundPlay = $('.play')[0],
    soundLost = $('.lost')[0],
    soundExplosion = $('.explosion')[0]

/*******************************
  EVENTLISTENER CONTROL
*******************************/

var keys = {'ArrowUp':false, 'ArrowLeft':false, 'ArrowRight':false, 'ArrowDown':false};

/* Event listener if one of the "keys" are pressed */
window.addEventListener('keyup', function(e) {
  keys[e.key + ''] = false;
});

window.addEventListener('keydown', function(e) {
  keys[e.key + ''] = true;
});

/*******************************
  DECLARE ALL VARIABLES
*******************************/

var canvWidth = $('#canvas').width();
    canvWidth = canvWidth/2;
var left = canvWidth - 400;
var right = canvWidth + 400;

var canvHeight = $('#canvas').height();
    canvHeight = canvHeight/2;
var up = canvHeight - 250;
var down = canvHeight + 250;

var canv = $("#canvas");
var context = canv[0].getContext('2d');

var num,
    health = document.getElementById("health"),
    destroyed = document.getElementById("meteorids");

/*******************************
  HIDE CANVAS ON STARTING SCREEN
*******************************/

canvas.style.display="none";

/*******************************
  CLASSES
*******************************/

class Ship {
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rot = 0;
    this.vel = 0;
    this.acc = 0;
    this.turn = 0;
    this.bullets = [];
  }

  move () {
    this.rot += this.turn * 0.1;
    this.vel += this.acc  * 0.9;
    this.vel = 0.90 * this.vel;
    this.x = this.x + this.vel * Math.cos(this.rot);
    this.y = this.y + this.vel * Math.sin(this.rot);
  }

  draw (s) {
    s.save();
    s.translate(this.x, this.y);
    s.rotate(this.rot - Math.PI);
    s.drawImage($('#car')[0], -this.w/2, -this.h/2, this.w, this.h);
    s.restore();
  }
};

class Background {
  constructor (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  move (ship, coord) {
    if(ship.x <= left || ship.x >= right) {
      this.x += 0.9*(coord.x - ship.x);
    }
    if(ship.y <= up || ship.y >= down) {
      this.y += 0.9*(coord.y - ship.y);
    }
  }

  draw (bg) {
    bg.save();
    bg.translate(this.x, this.y);
    bg.drawImage($('#bg')[0], -this.w/2, -this.h/2, this.w, this.h);

    /* background erweitern nach rechts */
    if(this.x <= 0) {
      bg.drawImage($('#bg')[0], -(this.w/2)+2048, -this.h/2, this.w, this.h);
    }
    if (this.x <= -1024) {
      this.x += 2048;
    }

    /* background erweitern nach links */
    if (this.x >= 1024) {
      bg.drawImage($('#bg')[0], -(this.w/2)-2048, -this.h/2, this.w, this.h);
    }
    if (this.x >= 2048) {
      this.x -= 2048;
    }

    /* background erweitern nach oben */
    if (this.y >= 768) {
      bg.drawImage($('#bg')[0], -this.w/2, -(this.h/2)-1536, this.w, this.h);
    }
    if (this.y >= 1536) {
      this.y -= 1536;
    }

    /* background erweitern nach unten */
    if (this.y <= 0) {
      bg.drawImage($('#bg')[0], -this.w/2, -(this.h/2)+1536, this.w, this.h);
    }
    if (this.y <= -768) {
      this.y += 1536;
    }

    /* links unten */
    if (this.x >= 1024 && this.y <= 0) {
      bg.drawImage($('#bg')[0], -(this.w/2)-2048, -(this.h/2)+1536, this.w, this.h);
    }
    /* links oben */
    if (this.x >= 1024 && this.y >= 768) {
      bg.drawImage($('#bg')[0], -(this.w/2)-2048, -(this.h/2)-1536, this.w, this.h);
    }
    /* rechts unten */
    if (this.x <= 0 && this.y <= 0) {
      bg.drawImage($('#bg')[0], -(this.w/2)+2048, -(this.h/2)+1536, this.w, this.h);
    }
    /* rechts oben */
    if (this.x <= 0 && this.y >= 768) {
      bg.drawImage($('#bg')[0], -(this.w/2)+2048, -(this.h/2)-1536, this.w, this.h);
    }

    bg.restore();
  }
};

class Meteorid {
  constructor (x, y, s) {
    this.x = x;
    this.y = y;
    this.w = s;
    this.h = s;
    this.rot = Math.random() * (6.5 - 0 + 1);
    this.vel = Math.random() * (3 - 1 + 1) + 1;
    this.live = Math.floor(this.w / 10);
  }

  move (ship, coord) {
    if(ship.x <= left || ship.x >= right) {
      this.x += 0.7*(coord.x - ship.x) + this.vel * Math.cos(this.rot);
    } else {
      this.x += 0.2*(coord.x - ship.x) + this.vel * Math.cos(this.rot);
    }
    if(ship.y <= up || ship.y >= down) {
      this.y += 0.7*(coord.y - ship.y) + this.vel * Math.sin(this.rot)
    } else {
      this.y += 0.2*(coord.y - ship.y) + this.vel * Math.sin(this.rot);
    }
  }

  draw (m) {
    m.save();
    m.translate(this.x, this.y);
    m.drawImage($('#meteorid')[0], -this.w/2, -this.h/2, this.w, this.h);
    m.restore();
  }
};

class Bullet {
  constructor (x, y, rot) {
    this.h = 5;
    this.w = 5;
    this.speed = 10;
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.alive = true;
  }

  move () {
    this.x = this.x + this.speed * Math.cos(this.rot);
    this.y = this.y + this.speed * Math.sin(this.rot);
  }

  draw (b) {
    b.save();
    b.translate(this.x, this.y);
    b.drawImage($('#bullet')[0], -this.w/2, -this.h/2, this.w, this.h);
    b.restore();
  }
}

/*******************************
  FUNCTIONS
*******************************/

/* Set variables */

function setVariables() {
  ship  = new Ship(canvWidth, canvHeight, 30, 30);
  bg    = new Background(canvWidth, canvHeight, 2048, 1536);

  oldCoord = {'x' : ship.x, 'y' : ship.y};

  canv = $("#canvas");
  context = canv[0].getContext('2d');
      context.clearRect(0, 0, canvWidth*2, canvHeight*2);

  num = getRndMeteorNum();
  met = [];
  bul = [];

  health.value = 100;
  meteorids.value = 0;
}

/* MeteorFunction - Rnd Size, Rnd Number, Rnd X, Rnd Y */

function getRndMeteorX() {
  let min = 0;
  let max = 50000;
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function getRndMeteorY() {
  let min = 0;
  let max = 10000;
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function getRndMeteorSize() {
  let min = 15;
  let max = 50;
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function getRndMeteorNum() {
  let min = 300;
  let max = 10000;
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

/* Set every possible statement to play the game */

function game() {
  ship.move();
  bg.move(ship, oldCoord);
  context.clearRect(0, 0, canv.width(), canv.height());
  bg.draw(context);
  ship.draw(context);
  for( let i = 0; i < met.length; i++ ) {
    met[i].move(ship, oldCoord)
    met[i].draw(context);
  }
  for( let i = 0; i < met.length; i++ ) {
    var metRect = met[i];
    if( ship.x < metRect.x + metRect.w && ship.x + ship.w > metRect.x
        && ship.y < metRect.y + metRect.h && ship.h + ship.y > metRect.y ) {
      health.value -= 1;
    }
  }

  for( let i = 0; i < met.length; i++) {
    for( let j = 0; j < bul.length; j++) {
      var metRect = met[i];
      var bulRect = bul[j];
      if( bulRect.x < metRect.x + metRect.w && bulRect.x + bulRect.w > metRect.x
          && bulRect.y < metRect.y + metRect.h && bulRect.h + bulRect.y > metRect.y ) {
        bulRect.alive = false;
        metRect.live -= 1;
      }
      if ( bulRect.alive === false ) {
        bul.splice(j, 1);
      }
      if ( metRect.live === 0 ){
        met.splice(i, 1);
        destroyed.value += 1;
        soundExplosion.play();
        soundExplosion.currentTime = 0;
      }
      if ( bulRect.x - ship.x > 1000 || bulRect.y - ship.y > 1000
          || ship.x - bulRect.x > 1000 || ship.y - bulRect.y > 1000) {
        bul.splice(j, 1);
      }
    }
  }

  if(ship.x <= left || ship.x >= right) {
    ship.x = oldCoord.x;
  } else {
    oldCoord.x = ship.x;
  }

  if(ship.y <= up || ship.y >= down) {
    ship.y = oldCoord.y;
  } else {
    oldCoord.y = ship.y;
  }

  if(keys.ArrowUp === true) {
    ship.acc = +.5;
  }
  if(keys.ArrowDown === true) {
    ship.acc = -.5;
  }
  if(keys.ArrowLeft === true) {
    ship.turn = -1;
  }
  if(keys.ArrowRight === true) {
    ship.turn = +1;
  }
  if(keys.ArrowLeft === false && keys.ArrowRight === false || keys.ArrowLeft === true && keys.ArrowRight === true) {
    ship.turn = 0;
  }
  if(keys.ArrowUp === false && keys.ArrowDown === false || keys.ArrowUp === true && keys.ArrowDown === true) {
    ship.acc = 0;
  }
  document.body.onkeydown = function(e){
    if(e.keyCode == 32){
      bul.push(new Bullet(ship.x, ship.y, ship.rot));
      bullet -= 1;
      soundBul.play();
      soundBul.currentTime = 0;
    }
  }

  for( let j = 1; j < bul.length; j++ ) {
    bul[j].draw(context);
    bul[j].move()
  }

  if( health.value === 0 ) {
    soundPlay.pause();
    soundPlay.currentTime = 0;
    canvas.style.display="none";
    soundLost.play();
    $(".loose").removeClass("hide");
    $("#gamestat").addClass("hide");
  }
  if( destroyed.value === 20 ) {
    destroyed.value += 1;
    soundPlay.pause();
    soundPlay.currentTime = 0;
    canvas.style.display="none";
    soundEnd.play();
    $(".won").removeClass("hide");
    $("#gamestat").addClass("hide");
  }
};

/* Starts the game, changes the sound and hide or show everything needed */

function start() {
  setVariables();

  for ( var i = 0; i < num; i++) {
    met.push(new Meteorid(getRndMeteorX(), getRndMeteorY(), getRndMeteorSize()));
  }

  if( $("#gamestat").hasClass("hide") ) {
    $("#gamestat").removeClass("hide");
  }
  if( !$(".start").hasClass("hide") ) {
    $(".start").addClass("hide");
  }
  if( !$(".won").hasClass("hide") ) {
    $(".won").addClass("hide");
  }
  if( !$(".loose").hasClass("hide") ) {
    $(".loose").addClass("hide");
  }
  $("#canvas").removeAttr("style");

  soundEnd.pause()
  soundMusic.pause();

  soundPlay.play();

  setInterval(game, 20);
}
