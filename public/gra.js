var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const framerate = 60;
const mapEnd = 6000;

var objects = [];
var backgroundObjects = [];
var frontObjects = [];
var players = [];
var bullets = [];
var recivedBullets = [];
var camerax = 0;
var direction = 0;
var animations = [];
var gracz;
var sideC;
var co = 0;
var flying = false;
var team = null;
var images_blue = [];
var images_red = [];
var scoreBlue = 0;
var scoreRed = 0;

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

class object {
    constructor(x, y, img, name) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "/images/" + img;
    }
    draw() {
        ctx.drawImage(this.image, this.x - camerax, this.y);
    }
}

class AnimatedEffect {
    constructor(x, y, img, id, h, w, c, r, speed, width, height) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.speed = speed;
        this.src = "/images/" + img;
        this.width = width;
        this.height = height;
        this.animation = {
            frame: 0,
            ticks: 0,
            row: 0,
            rows: r,
            col: c,
            width: w,
            height: h
        };
    }
    draw() {
        this.animation
        this.animation.ticks++;

        if (this.animation.ticks == this.speed) {
            this.animation.frame++;
            this.animation.ticks = 0;
        }
        if (this.animation.frame == this.animation.rows) {
            this.animation.frame = 0;
            this.animation.row++;
        }

        if (this.animation.row > this.animation.rows + 1) this.selfDestruct();
        let tmp = new Image();
        tmp.src = this.src;
        ctx.drawImage(tmp,
            this.animation.frame * this.animation.width,
            this.animation.height * this.animation.row,
            this.animation.width,
            this.animation.height,
            this.x - camerax - this.animation.width / 2,
            this.y - this.animation.height / 2,
            this.width,
            this.height);

    }
    selfDestruct() {
        let toDel = null;
        for (i = 0; i < animations.length; i++) {

            if (animations[i].id == this.id) toDel = i;
            break;
        }
        animations.splice(toDel, 1);
    }
}

class animatedObject {
    constructor(x, y, player, team, hp, d) {
        this.x = x;
        this.y = y;
        this.name = player;
        this.team = team;
        this.hp = hp;
        this.direction = d;
        this.animation = {
            frame: 1,
            ticks: 0,
            col: 0,
            width: 100,
            height: 108,
            type: ""
        };

    }
    draw() {

        let tmp = new Image();
        tmp.src = this.animation.type;
        ctx.drawImage(tmp, this.x - camerax, this.y + 10, this.animation.width, this.animation.height);

        if (this.team == 1) ctx.fillStyle = COLOR_BLUE;
        if (this.team == 2) ctx.fillStyle = COLOR_RED;
        ctx.font = "20px Comic Sans MS";
        ctx.fillText(this.name, this.x - camerax + (this.animation.width / 2) - (this.name.length / 2) * 10, this.y - 15);
        ctx.fillStyle = "darkgreen";
        //ctx.fillRect(this.x - camerax, this.y, this.hp, 15);
        ctx.fillRect(this.x - camerax - 12 + (this.animation.width / 2) - (this.name.length / 2) * 10, this.y, this.hp, 15);
    }
}
class bullet {
    constructor(x, y, a, id, n, t, i) {
        this.x = x;
        this.y = y;
        this.angle = a;
        this.speedx = Math.sin(a * Math.PI / 180) * 12;
        this.speedy = Math.cos(a * Math.PI / 180) * 12;
        this.name = n;
        this.id = id;
        this.toDel = false;
        this.team = t;
        this.dead = false;
        //this.image = new Image();
        this.src = "/images/" + i;
    }

}

class player {
    constructor(x, y, name, team) {
        this.x = x;
        this.y = y;
        //this.imgname = img;
        this.image = new Image();
        //this.image.src = "/images/" + img;
        this.images = [];
        this.speedx = 0;
        this.speedy = 0;
        this.jump = true;
        this.name = name;
        this.team = team;
        this.hp = 100;
        this.moving = false;
        this.falling = true;
        this.shooting = false;
        this.shootingAnim = false;
        this.animation = {
            frame: 1,
            ticks: 0,
            col: 0,
            width: 100,
            height: 108,
            type: ""
        };
        this.points = {
            shoot: {
                x: 0,
                y: 0
            },
            head: {
                x: 106,
                y: 130
            }
        };
    }
    checkColision() {
        let xl = this.x + (this.animation.width / 2);
        let xr = this.x - (this.animation.width / 2);
        let yt = this.y;
        let yb = this.y + this.animation.height;
        let h = this.animation.height;
        let w = this.animation.width;
        let t = 0;
        /*ctx.fillStyle = "green";
        ctx.fillRect(xl - camerax, yt, xr - xl, yb - yt);*/
        let fall = true;
        for (let p = 0; p < objects.length; p++) {
            let o = objects[p];
            let oxl = objects[p].x;
            let oxr = objects[p].x + objects[p].image.width;
            let oyt = objects[p].y;
            let oyb = objects[p].y + objects[p].image.height;

            if (yb >= oyt && yt <= oyb && xl >= oxl && xr <= oxr) {
                ctx.fillstyle = "black";
                //ctx.fillRect(this.x - this.animation.width / 2, yb, w, oyt - 5 - this.speedy);
                if (((yb > oyt && yt < oyt) || (yt > oyt && yb > oyb) || (oyt <= yt && oyb >= yb))) {
                    if (this.speedx > 0) {
                        //co = 2;
                        this.x -= 6;
                    }
                    if (this.speedx < 0) {
                        //co = 1;
                        this.x += 6;
                    }
                    this.speedx = 0;
                    this.falling = false;
                }
                if (yb >= (oyt) - 10 && yb <= (oyb) + 10 && xl > oxl && xr < oxr /*- 2*/ ) {
                    this.y = oyt - h;
                    this.falling = false;
                    this.jump = false;
                    fall = false;

                } else if (yt <= oyb && yb - h / 1.1 > oyb) {
                    this.falling = true;
                    this.y = oyb;
                    this.speedy *= -0.5;


                } //else co = 0;

            } else if (fall) {
                this.falling = true;
            }
        }

    }
    gravity() {

        if (this.falling) {
            this.speedy -= 10 / framerate;
        } else this.speedy = 0;
    }
    update() {
        this.animation.height = 108;
        this.x += this.speedx;
        this.y -= this.speedy;
        this.checkColision();
        this.gravity();
        if (this.x <= 0) this.x = 0;
        if (this.x >= mapEnd) this.x = mapEnd;
        if (this.hp <= 0) {
            this.dead = true;
            socket.emit('score', team);
            if (team == 1) gracz.x = 200;
            if (team == 2) gracz.x = 5800;
            //setTimeout(function () {
            gracz.hp = 100;
            //}, 2000);
        } else if (this.hp > 0) this.dead = false;
        if (direction == -1) {
            this.points.shoot.x = Math.round(this.x + this.animation.width / 2);
            this.points.shoot.y = Math.round(this.y + this.animation.height / 2);
        } else if (direction == 1) {
            this.points.shoot.x = Math.round(this.x - this.animation.height / 2);
            this.points.shoot.y = Math.round(this.y + this.animation.height / 2);
        }
    }
    draw() {
        /*ctx.fillStyle = "green";
        ctx.fillRect(gracz.x - (this.animation.width / 2) - camerax, this.y, this.animation.width, this.animation.height);*/

        this.animation.ticks++;

        let anim = null;
        let wiz = null;
        let wiz2 = null
        let d = new Image();
        if (team == 1) wiz2 = images_blue;
        if (team == 2) wiz2 = images_red;
        if (direction == -1) wiz = "";
        if (direction == 1) wiz = "_2";
        //if (!this.moving) anim = this.images["idle_"+this.animation.frame+wiz];
        if (this.shootingAnim) {
            anim = wiz2["attack_4" + wiz];
            this.animation.width = 145;
            //this.animation.type = "attack";
        }
        if (!this.shootingAnim) this.animation.width = 100;
        if (!this.moving && !this.shootingAnim) {
            anim = wiz2["idle_1" + wiz];
            //this.animation.type = "idle";
        }
        if (this.moving && !this.shootingAnim) {
            anim = wiz2["walk_" + this.animation.frame + wiz];
            //this.animation.type = "walk_";
        }
        if (this.jump && !this.shootingAnim) {
            anim = wiz2["jump_1" /* + this.animation.frame*/ + wiz];
            //this.animation.type = "jump_";
        }
        //console.log(this.animation.frame);
        if (this.animation.ticks >= 10) {
            this.animation.frame++;
            this.animation.ticks = 0;
        }
        if (this.animation.frame >= 4) this.animation.frame = 1;

        this.animation.type = anim.src;
        let tmp = 0;
        if (this.shootingAnim && direction == 1) tmp = 50;
        else tmp = 0;
        ctx.drawImage(anim, this.x - tmp - camerax - this.animation.height / 2, this.y + 10, this.animation.width, this.animation.height);
        ctx.fillStyle = "yellow";
        ctx.font = "20px Comic Sans MS";
        ctx.fillText(this.name, this.x - camerax - (this.name.length / 2) * 10, this.y - 15);
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(this.x - camerax - 50, this.y, this.hp, 15);
    }

}

function getImg() {
    for (i = 1; i <= 4; i++) {
        images_blue["idle_" + i] = new Image();
        images_blue["idle_" + i].src = "/images/wizard_ice/idle_" + i + ".png";
        images_blue["walk_" + i] = new Image();
        images_blue["walk_" + i].src = "/images/wizard_ice/walk_" + i + ".png";
        images_blue["jump_" + i] = new Image();
        images_blue["jump_" + i].src = "/images/wizard_ice/jump_" + i + ".png";
        images_blue["attack_" + i] = new Image();
        images_blue["attack_" + i].src = "/images/wizard_ice/attack_" + i + ".png";
        images_blue["dead_" + i] = new Image();
        images_blue["dead_" + i].src = "/images/wizard_ice/dead_" + i + ".png";

        images_blue["idle_" + i + "_2"] = new Image();
        images_blue["idle_" + i + "_2"].src = "/images/wizard_ice_2/idle_" + i + ".png";
        images_blue["walk_" + i + "_2"] = new Image();
        images_blue["walk_" + i + "_2"].src = "/images/wizard_ice_2/walk_" + i + ".png";
        images_blue["jump_" + i + "_2"] = new Image();
        images_blue["jump_" + i + "_2"].src = "/images/wizard_ice_2/jump_" + i + ".png";
        images_blue["attack_" + i + "_2"] = new Image();
        images_blue["attack_" + i + "_2"].src = "/images/wizard_ice_2/attack_" + i + ".png";
        images_blue["dead_" + i] = new Image();
        images_blue["dead_" + i].src = "/images/wizard_ice_2/dead_" + i + ".png";
    }
    for (i = 1; i <= 4; i++) {
        images_red["idle_" + i] = new Image();
        images_red["idle_" + i].src = "/images/wizard_fire/idle_" + i + ".png";
        images_red["walk_" + i] = new Image();
        images_red["walk_" + i].src = "/images/wizard_fire/walk_" + i + ".png";
        images_red["jump_" + i] = new Image();
        images_red["jump_" + i].src = "/images/wizard_fire/jump_" + i + ".png";
        images_red["attack_" + i] = new Image();
        images_red["attack_" + i].src = "/images/wizard_fire/attack_" + i + ".png";
        images_blue["dead_" + i] = new Image();
        images_blue["dead_" + i].src = "/images/wizard_fire/dead_" + i + ".png";


        images_red["idle_" + i + "_2"] = new Image();
        images_red["idle_" + i + "_2"].src = "/images/wizard_fire_2/idle_" + i + ".png";
        images_red["walk_" + i + "_2"] = new Image();
        images_red["walk_" + i + "_2"].src = "/images/wizard_fire_2/walk_" + i + ".png";
        images_red["jump_" + i + "_2"] = new Image();
        images_red["jump_" + i + "_2"].src = "/images/wizard_fire_2/jump_" + i + ".png";
        images_red["attack_" + i + "_2"] = new Image();
        images_red["attack_" + i + "_2"].src = "/images/wizard_fire_2/attack_" + i + ".png";
        images_blue["dead_" + i] = new Image();
        images_blue["dead_" + i].src = "/images/wizard_fire_2/dead_" + i + ".png";
    }
}

canvas.addEventListener('click', function (c) {
    if (start && !gracz.shooting && !gracz.dead) {
        gracz.shooting = true;
        gracz.shootingAnim = true;
        let angle = Math.degrees(Math.atan2(c.offsetY - gracz.points.shoot.y, c.offsetX - gracz.points.shoot.x + camerax) + Math.PI / 2);
        if (team == 1) {
            bullets.push(new bullet(gracz.points.shoot.x, gracz.points.shoot.y, angle, bullets.length, gracz.name, team, "missile_blue.png"));

            socket.emit('bullet', new bullet(gracz.points.shoot.x, gracz.points.shoot.y, angle, bullets.length, gracz.name, team, "missile_blue.png"));
        }
        if (team == 2) {
            bullets.push(new bullet(gracz.points.shoot.x, gracz.points.shoot.y, angle, bullets.length, gracz.name, team, "missile.png"));

            socket.emit('bullet', new bullet(gracz.points.shoot.x, gracz.points.shoot.y, angle, bullets.length, gracz.name, team, "missile.png"));
        }
        setTimeout(function () {
            gracz.shootingAnim = false
        }, 800);
        setTimeout(function () {
            gracz.shooting = false
        }, 1000);
    }
});
document.addEventListener('mousemove', function (m) {
    let rect = canvas.getBoundingClientRect();
    if (m.x - rect.left - (gracz.animation.width / 5) > gracz.x - camerax) direction = -1;
    else direction = 1;
});

document.addEventListener('keydown', function (k) {
    if ((k.keyCode == 38 || k.keyCode == 87 || k.keyCode == 32) && (!gracz.jump || flying)) {
        gracz.jump = true;
        gracz.speedy = 10;
    }
    if (k.keyCode == 39 || k.keyCode == 68 /*&& co != 1*/ ) {
        //direction = -1;
        gracz.speedx = 3;
        gracz.moving = true;
    }
    if (k.keyCode == 37 || k.keyCode == 65 /*&& co != 2*/ ) {
        //direction = 1;
        gracz.speedx = -3;
        gracz.moving = true;
    }
});

document.addEventListener('keyup', function (k) {
    if (k.keyCode == 37 || k.keyCode == 65) {
        gracz.speedx = 0;
        gracz.moving = false;
    }
    if (k.keyCode == 39 || k.keyCode == 68) {
        gracz.speedx = 0;
        gracz.moving = false;
    }
});

function importMap() {
    for (i = 0; i < map.length; i++) {
        if (map[i].background) backgroundObjects.push(new object(map[i].position.x, map[i].position.y, map[i].source, map[i].name));
        else if (map[i].front) frontObjects.push(new object(map[i].position.x, map[i].position.y, map[i].source, map[i].name));
        else objects.push(new object(map[i].position.x, map[i].position.y, map[i].source, map[i].name));
    }
}

function drawAll() {
    let lll = new Image();
    lll.src = "/images/gory.png";
    ctx.drawImage(lll, 0 - camerax / 2, 200);
    
    for (i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
    for (i = 0; i < backgroundObjects.length; i++) {
        backgroundObjects[i].draw();
    }
    gracz.draw();
    for (i = 0; i < players.length; i++) {
        players[i].draw();
    }


    for (i = 0; i < players.length; i++) {
        for (j = 0; j < recivedBullets[players[i].name].length; j++) {

            let tmp = new Image();
            if(recivedBullets[players[i].name][j].team == 1) tmp.src = "/images/missile_blue.png";
            if(recivedBullets[players[i].name][j].team == 2) tmp.src = "/images/missile.png";
            ctx.save();
            ctx.translate(recivedBullets[players[i].name][j].x - camerax, recivedBullets[players[i].name][j].y);
            //ctx.rotate(Math.atan2(recivedBullets[i].speedx, recivedBullets[i].speedy) + Math.PI * 1.5);
            ctx.rotate(recivedBullets[players[i].name][j].angle);
            ctx.translate(-recivedBullets[players[i].name][j].x + camerax, -recivedBullets[players[i].name][j].y);
            ctx.drawImage(tmp, recivedBullets[players[i].name][j].x - 15 - camerax, recivedBullets[players[i].name][j].y - 5.5, 75, 25);
            ctx.restore();
        }
    }
    for (i = 0; i < bullets.length; i++) {
        let tmp = new Image();
        tmp.src = bullets[i].src;
        ctx.save();
        ctx.translate(bullets[i].x - camerax, bullets[i].y);
        bullets[i].angle = Math.atan2(bullets[i].speedx, bullets[i].speedy) + Math.PI * 1.5;
        ctx.rotate(bullets[i].angle);
        ctx.translate(-bullets[i].x + camerax, -bullets[i].y);
        ctx.drawImage(tmp, bullets[i].x - 15 - camerax, bullets[i].y - 5.5, 75, 25);
        ctx.restore();
        //animations.push(new AnimatedEffect(bullets[i].x, bullets[i].y , "explosion_sheet.png", animations.length, 64, 64, 5, 4, 1, 64, 64));
    }

    for (i = 0; i < animations.length; i++) {
        animations[i].draw();
    }
    for (i = 0; i < frontObjects.length; i++) {
        frontObjects[i].draw();
    }
}

function cameraMovement() {
    if (gracz.x - camerax > 400 && (gracz.x > 400 && gracz.x - camerax == 402)) camerax += gracz.speedx;
    else {
        camerax = gracz.x - 402;
    }
    if (camerax < 0) camerax = 0;
    if (camerax > mapEnd - 800) camerax = mapEnd - 800;
}
socket.on("dmgTake", function (data) {
    if (gracz.name == data.name) gracz.hp -= data.d;
});
socket.on('updateScore', function (data) {
    scoreBlue = data.blue;
    scoreRed = data.red;
});


function bulletColision(b) {
    let by = b.y;
    let bx = b.x;
    for (let p = 0; p < players.length; p++) {
        if (players[p].team == team) continue;
        let o = players[p];
        let oxl = players[p].x;
        let oxr = players[p].x + players[p].animation.width;
        let oyt = players[p].y;
        let oyb = players[p].y + players[p].animation.height;

        if ((bx >= oxl && bx <= oxr) && (by >= oyt && by <= oyb)) {
            b.toDel = true;
            players[i].hp -= 20;
            socket.emit('dmg', {
                name: players[i].name,
                d: 20
            });

            players[i].hp = 0;

            socket.emit('explosion', {
                team: b.team, 
                name: b.name,
                id: b.id,
                x: b.x,
                y: b.y
            });
            return;
        }

    }

    for (let p = 0; p < objects.length; p++) {

        let o = objects[p];
        let oxl = objects[p].x;
        let oxr = objects[p].x + objects[p].image.width;
        let oyt = objects[p].y;
        let oyb = objects[p].y + objects[p].image.height;

        if ((bx >= oxl && bx <= oxr) && (by >= oyt && by <= oyb)) {
            b.toDel = true;

            socket.emit('explosion', {
                team: b.team, 
                name: b.name,
                id: b.id,
                x: b.x,
                y: b.y

            });
            socket.emit('bulletDel', {
                id: b.id,
                name: b.name
            })
            return;
        }
    }

}

socket.on('explodeHere', function (data) {
    if (data.team == 1) {
        animations.push(new AnimatedEffect(data.x - 16, data.y - 16, "explosion_sheet_blue.png", animations.length, 64, 64, 5, 5, 2, 96, 96));
    }
    if (data.team == 2) {
        animations.push(new AnimatedEffect(data.x - 16, data.y - 16, "explosion_sheet.png", animations.length, 64, 64, 5, 5, 2, 96, 96));
    }
});

function updateAll() {
    let bulletsToDelete = [];
    for (i = 0; i < bullets.length; i++) {
        bullets[i].x += bullets[i].speedx;
        bullets[i].y -= bullets[i].speedy;
        bullets[i].speedy -= 6 / framerate;
        if (bullets[i].toDel) {
            bulletsToDelete.push(i);
            continue;
        }

        bulletColision(bullets[i]);

    }
    for (i = 0; i < bulletsToDelete.length; i++) {
        bullets.splice(bulletsToDelete[i], 1);
    }
    bulletsToDelete.splice(0, bulletsToDelete.length);

    gracz.update();
}

function sendPosition() {
    socket.emit('position', {
        name: nick.value,
        x: gracz.x - (gracz.animation.width / 2),
        y: gracz.y,
        team: team,
        animation: gracz.animation,
        bullets: bullets,
        d: direction,
        hp: gracz.hp
    });
}
socket.on('get_pos', function (data) {
    for (i = 0; i < players.length; i++) {
        if (players[i].name == data.name) {
            players[i].x = data.x;
            players[i].y = data.y;
            players[i].team = data.team;
            players[i].animation = data.animation;
            players[i].d = data.d;
            players[i].hp = data.hp;
            recivedBullets[players[i].name] = data.bullets;
        }
    }
});

function fillBG() {
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 600);
    my_gradient.addColorStop(0, "#044fc9");
    my_gradient.addColorStop(1, "#7caaf4");
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = "#031738";
    ctx.font = "40px Comic Sans MS";
    ctx.fillText(scoreBlue, 50, 50);
    ctx.fillStyle = COLOR_RED;
    ctx.font = "40px Comic Sans MS";
    ctx.fillText(scoreRed, 750, 50);

}

function splashScreen(color) {
    let x = 0;
    if (color == 1) {
        ctx.fillstyle = COLOR_BLUE;
        x = "Wygrali Niebiescy"
    }
    if (color == 2) {
        ctx.fillstyle = COLOR_RED;
        x = "Wygrali Czerwoni"
    }
    if (color == 0) {
        ctx.fillStyle = "palegreen";
        x = "Remis"
    }
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "gold";
    ctx.font = "60px Comic Sans MS";
    ctx.fillText(x, 400 - (x.length * 15), 260);

}

socket.on("zakoncz", function (data) {
    start = false;
    let x = 0;
    if (scoreBlue > scoreRed) x = 1;
    if (scoreBlue < scoreRed) x = 2;
    splashScreen(x);
});

function init() {
    importMap();
    gracz = new player(100, 100, "", null);
    getImg();
}

init();

function game() {
    if (start) {
        fillBG();
        cameraMovement();
        drawAll();
        drawScore();
        updateAll();
        sendPosition();
    }
}
setInterval(game, 1000 / framerate);
