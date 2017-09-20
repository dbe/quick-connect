var jayson = require('jayson');
var express = require('express')

import { sequelize, Game } from '../db/models';
import service from './service';

var app = express();
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  Game.findAll().then(games => {
    res.render('index', {games});
  });
});

app.get('/api/v1/games', function (req, res) {
  Game.findAll().then(games => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(games.map(game => game.gameState())));
  });
});

app.listen(3002);
console.log("Web server listening on port 3002");

const server = jayson.server(service);
server.http().listen(3001);
console.log("JSONRPC server listening on port 3001");
