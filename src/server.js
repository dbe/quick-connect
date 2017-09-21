var jayson = require('jayson');
var express = require('express')
var forge = require('node-forge');
var uuidv4 = require('uuid/v4');
var bodyParser = require('body-parser')

import { sequelize, Game, User } from '../db/models';
import service from './service';

var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', function (req, res) {
  Game.findAll({limit: 20}).then(games => {
    res.render('index', {games, gameStates: games.map(game => JSON.stringify(game.gameState()) )});
  });
});

app.get('/preview/:gameId', function (req, res) {
  Game.find({where: {gameId: req.params.gameId}}).then(game => {
    res.render('preview', {game, gameState: JSON.stringify(game.gameState())});
  });
});

app.get('/command', function (req, res) {
  Game.findAll({limit: 100}).then(games => {
    res.render('command', {games, gameStates: games.map(game => JSON.stringify(game.gameState()) )});
  });
});

app.get('/api/v1/games', function (req, res) {
  Game.findAll().then(games => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(games.map(game => game.gameState())));
  });
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  var md = forge.md.sha256.create();
  md.update(req.body['password']);
  User.create({
    userId: uuidv4(),
    userName: req.body['username'],
    passwordHash: md.digest().toHex()
  }).then(user => {
    res.render('welcome', {user});
  });
  // redirect to ?
});

app.listen(3002);
console.log("Web server listening on port 3002");

const server = jayson.server(service);
server.http().listen(3001);
console.log("JSONRPC server listening on port 3001");
