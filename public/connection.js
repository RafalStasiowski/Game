var socket = io.connect('http://' + /**/ '192.168.1.176' /* to zminić */ + ':4000');
var players = [];
var nick;
var messagebox = document.getElementById('message-box');
var messageinput = document.getElementById('message-input');
var send = document.getElementById('message-send');
var start = false;
const COLOR_BLUE = "#0f4499";
const COLOR_RED = "#700510";
var blueAllow = true;
var redAllow = true;

function zakoncz() {
    socket.emit("zakoncz", 1);
}

var badWords = ["kurwa", "chuj", "pierdole", "japierdole", "ja pierdole", "chuju","zjebany","pedale","pierdolony","japierdolę","ja pierdolę","kurwo","zjebie","popierdolony","popierdoliło"];
var pattern = new RegExp(badWords.join("|"), "i");

function isAcceptable(text) {
    return !pattern.test(text);
}

function sendChat(text) {
    if (isAcceptable(text)) {
        socket.emit('chat', {
            nick: nick.value,
            message: text
        });
        messageinput.value = "";
    } else {
        alert("*Brzydko!*");
        messageinput.value = "";
    }
}



messageinput.addEventListener('keydown', function (k) {
    if (k.keyCode == 13) {
        if (messageinput.value) {
            sendChat(messageinput.value);
        }
    }
});
send.addEventListener('click', function () {
    if (messageinput.value) {
        sendChat(messageinput.value);
    }
});



socket.on('chat', function (data) {
    messagebox.innerHTML += '<p><strong>' + data.nick + '</strong>: ' + data.message + '</p>';
});

socket.on('joined', function (data) {

    for (i = 0; i < data.clients.length; i++) {

        //if (data.clients[i] != gracz.name) 
        if (data.clients[i] == nick.value) continue;
        else {
            playerAdd(data.clients[i], data.team);
            recivedBullets[data.clients[i]] = [];
        }

    }
    messagebox.innerHTML += '<p style="color: darkslategrey">' + data.nick + ' dołączył/a do gry.</p>';
});
socket.on("allow", function (data) {
    redAllow = data.red;
    blueAllow = data.blue;
});

function playerAdd(nick, team) {
    var e = true;
    for (i = 0; i < players.length; i++) {
        if (players[i].name == nick) e = false;
    }
    let im = 0;
    if (team == 1) im = "wizard_ice/";
    if (team == 2) im = "wizard_fire/";
    if (e) players.push(new animatedObject(-1000, -1000, nick, team, 100, direction));
}

socket.on('user_disconnected', function (data) {
    for (i = 0; i < players.length; i++) {
        if (players[i].name == data) players.splice(i, 1);
    }
    messagebox.innerHTML += '<p style="color: darkslategrey">' + data + ' opuścił/a gre.</p>';
});

socket.on('checkedNick', function (data) {
    if (data && nick.value && team) {
        if ((team == 1 && blueAllow) || (team == 2 && redAllow)) {
            document.getElementById('namescreen').style.display = "none";
            document.getElementById('box').style.display = "flex";
            socket.emit('nick', {
                nick: nick.value,
                team: team
            });
            gracz.name = nick.value;
            if (team == 2) gracz.x = mapEnd - 200;
            start = true;
        } else alert("W tej drużynie jest zbyt wielu graczy. Zmień drużynę lub spróbuj za chwilę");
    } else if (!team) alert("Wybierz drużynę");
    else if (team) alert("Niewłaściwa, lub zajęta nazwa użytkownika");

});

function validate() {
    nick = document.getElementById('nick');
    document.getElementById('ready').style.visibility = 'false';
    let e = true;
    socket.emit('checkNick', nick.value);
}

function chooseTeam(t) {
    team = t;
    //1 blue
    //2 red
    let bg = document.getElementById("namescreen");
    let b = document.getElementsByTagName("body")[0];
    if (t == 1) {
        bg.style.backgroundColor = COLOR_BLUE;
        b.style.backgroundColor = COLOR_BLUE;
    }
    if (t == 2) {
        bg.style.backgroundColor = COLOR_RED;
        b.style.backgroundColor = COLOR_RED;
    }
}
