var jayson = require('jayson');
var express = require('express')
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
    var response = {
      games,
      gameStates: games.map(game => JSON.stringify(game.gameState()))
    };

    if(req.query.regSuccess) {
      response.regSuccess = true;
    }

    res.render('index', response);
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

app.get('/user/new', function (req, res) {
  res.render('register');
});

app.get('/user', function (req, res) {
  User.findAll().then(users => {
    res.render('user_index', {users});
  })
});

app.get('/user/:userName', function (req, res) {
  User.findByUserName(req.params.userName).then(user => {
    res.render('user_show', {user});
  })
});

app.post('/user', function (req, res) {
  User.createWithPassword(req.body['username'], req.body['password']).then(user => {
    res.redirect('/?regSuccess=true');
  }).catch(err => {
    //TODO: Handle other cases rather than assuming all errors are username are taken
    res.render('register', {error: "Username already taken"});
  });
});

app.listen(3002);
console.log("Web server listening on port 3002");

const server = jayson.server(service);
server.http().listen(3001);
console.log("JSONRPC server listening on port 3001");
