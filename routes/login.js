var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('', function(req, res) {
	res.render('login', {title:'login'});
});

var db = mongoose.connect('mongodb://localhost/mean');
var Schema = mongoose.Schema;

var loginSchema = new Schema({
	usuario: {type: String, required: true},
	senha: {type: String, required: true}
});

var Login = db.model('Login', loginSchema, 'loginCollection');

router.login = function(req, res) {
	var usuarioLogin = req.body.usuario;
	var senhaLogin = req.body.senha;

	Login.find({usuario: usuarioLogin, senha: senhaLogin}, function(error, login) {
		if(login.length == 0) {
			res.send(500);
		}else {
			req.session.login = login;

			var timeSession = 3600000*3;
			req.session.cookie.expires = new Date(Date.now() + timeSession)
			req.session.cookie.maxAge = timeSession;
			res.send(200);
		}
	});
};

router.cadastro = function(req, res) {
	var login = new Login(req.body);

	login.save(function(error) {
		if(error) {
			res.send(500);
		}else {
			res.send(201);
		}
	});
};

router.autenticacao = function(req, res, next) {
	var sessao = req.session;

	if(sessao.login) {
		next();
	}else {
		res.redirect('/');
	}
};

router.obterUsuarioSessao = function(req, res) {
	var usuario = req.session.login[0].usuario;
	res.json(usuario);
};

router.logout = function(req, res) {
	req.session.destroy(function(error) {
		if(error) {
			res.send(500);
		}else {
			res.send(200);
		}
	})
};

module.exports = router;