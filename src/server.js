var express = require('express');
var bodyParser = require('body-parser');

import { sequelize, Game, User } from '../db/models';

var app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', function (req, res) {
  Game.findAll({limit: 200, order: [['updatedAt', 'DESC']]}).then(games => {
    console.log(games);
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

app.get('/games/delete/:gameId', function (req, res) {
    Game.destroy({where: {gameId: req.params.gameId}}).then(() => {
      res.redirect('/?deleteSuccess=true');
    });
});

app.get('/user', function (req, res) {
  let query = `
  SELECT DISTINCT ON (uxr."userName")
  uxr."userName", uxr."rating", gc.games from

  (
    SELECT u."userName", r.rating, r."createdAt" from "Users" u left join "Ratings" r
    on u."userName" = r."userName"
  ) as uxr

  left join
  (
    Select r."userName", Count(r."rating") games
    from "Ratings" r
    group by(r."userName")
  ) as gc

  on uxr."userName" = gc."userName"
  ;
  `;

  sequelize.query(query, { type: sequelize.QueryTypes.SELECT}).then(users => {
    let usersJson = users.map(user => {
      user.identiconHash = User.identiconHash(user.userName);
      return JSON.stringify(user);
    });

    res.render('user_index', {users, usersJson});
  });
});

app.get('/user/:userName', function (req, res) {
  User.findByUserName(req.params.userName).then(user => {
    user.ratings().then(ratings => {
      res.render('user_show', {user, ratings: JSON.stringify(ratings)});
    });
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


//**********JSONRPC Server Proxy**********

import service from './service';
var jayson = require('jayson');
const server = require('jayson').server(service);
const client = jayson.client.http('http://localhost:3001');

server.http().listen(3001);

app.post('/rpc', function(req, res) {
  client.request(req.body, function(err, resp) {
    res.send(resp);
  });
});

//**********END JSONRPC Server Proxy**********

let port = process.env.PORT || 3002;
app.listen(port);
console.log(`Web server listening on port ${port}`);
