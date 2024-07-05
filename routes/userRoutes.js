const express = require('express');
const user_route = express();
const bodyParser = require('body-parser');

const session = require('express-session')

const { SESSION_SECRET } = process.env;

// user_route.use(session({secret:SESSION_SECRET}))
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded( {extended: true} ));
user_route.set('view engine', 'ejs');
user_route.set('views','./views');



user_route.use(express.static('public'));

const userController = require('../controller/userController')

user_route.get('/dashboard', userController.loadDashboard);


user_route.get("/sqllogin", userController.getAllSQlUser);

user_route.post('/save-chat-sql', userController.saveChatSql);


user_route.get("/chat-sql", userController.getChatByIdSql);


user_route.get("/get-consoller", userController.getconsoller);


module.exports = user_route;