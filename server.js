var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
const port = 4000;
var io = require('socket.io').listen(server);
var scoreBlue = 0;
var scoreRed = 0;
var clients = [];
var bluePlayers = 0;
var redPlayers = 0;
var teams = [];

//var bullets = [];

server.listen(port, /**/ '192.168.1.176' /* to zminić */ , function () {
    clients = [];
    console.log('listening on port ' + port + '...');
});

app.use(express.static(__dirname + '/public'));
app.use("/images", express.static(__dirname + 'public/images'));

io.on('connection', function (socket) {
    var clientIp = socket.request.connection.remoteAddress;
    console.log("connection from: ",clientIp);
    let xd;
    if (redPlayers > bluePlayers) {
        xd = {
            blue: true,
            red: false
        }
    }
    if (bluePlayers > redPlayers) {
        xd = {
            blue: false,
            red: true
        }
    }
    if (bluePlayers == redPlayers) {
        xd = {
            blue: true,
            red: true
        }
    }
    socket.emit("allow", xd);
    socket.broadcast.emit("allow", xd);
    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });
    socket.on('checkNick', function (data) {
        let e = false;
        for (i = 0; i < clients.length; i++) {
            if (clients[i].username == data) {
                e = true;
                break;
            }
        }
        if (e) socket.emit('checkedNick', false);
        else socket.emit('checkedNick', true);
    });
    socket.on('nick', function (data) {
        console.log(data.nick + ' joined');

        clients.push(socket);
        socket.username = data.nick;
        var tmp = [];
        for (i = 0; i < clients.length; i++) {
            tmp.push(clients[i].username);
        }
        io.sockets.emit('joined', {
            clients: tmp,
            nick: data.nick,
            team: data.team
        });
        //clients[clients.length].team = data.team;
        teams.push({
            nick: data.nick,
            team: data.team
        });
        if (data.team == 1) bluePlayers++;
        if (data.team == 2) redPlayers++;
        /*let dx;

        if (redPlayers > bluePlayers) dx = {
            blue: true,
            red: false
        }
        else if (bluePlayers < redPlayers) dx = {
            blue: false,
            red: true
        }
        else if (bluePlayers == redPlayers) dx = {
            blue: true,
            red: true
        }
        console.log(dx);
        io.sockets.emit("allow", dx);*/

    });
    socket.on('position', function (data) {
        socket.broadcast.emit('get_pos', data);
    });
    socket.on('bullet', function (data) {
        socket.broadcast.emit('bulletAdd', data);
    });
    socket.on('bulletDel', function (data) {
        socket.broadcast.emit('bulletToDel', data);
    });
    socket.on('explosion', function (data) {
        socket.emit('explodeHere', data);
        socket.broadcast.emit('explodeHere', data);
    });
    socket.on('score', function (data) {
        if (data == 1) scoreRed++;
        if (data == 2) scoreBlue++;
        socket.emit('updateScore', {
            blue: scoreBlue,
            red: scoreRed
        });
        socket.broadcast.emit('updateScore', {
            blue: scoreBlue,
            red: scoreRed
        });

    });
    socket.on("zakoncz", function (data) {
        socket.broadcast.emit("zakoncz", 1);
        socket.emit("zakoncz", 1);
    });
    socket.on('dmg', function (data) {
        socket.broadcast.emit('dmgTake', data);
    });
    socket.on('disconnect', function () {
        var i = clients.indexOf(socket)
        console.log(socket.username, 'disconnected');
        for (j = 0; j < teams.length; j++) {
            if (teams[j].nick == socket.username) {
                if (teams[j].team == 1) bluePlayers--;
                if (teams[j].team == 2) redPlayers--;
                teams.splice(j, 1);
                break;
            }
        }
        socket.broadcast.emit('user_disconnected', socket.username);
        clients.splice(i, 1);
    });

});
