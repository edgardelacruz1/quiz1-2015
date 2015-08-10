var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
//controlador de sesiones
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId

router.get('/login',  sessionController.new);  // formulario login
router.post('/login', sessionController.create); // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

router.get('/author', function(req, res) {
  res.render('author', { title: 'Creditos' });
});
//Definición de rutas /quizes
router.get('/quizes', 			quizController.index);
router.get('/quizes/:quizId(\\d+)', 	quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
//Control para permitir ciertas funciones solo a usuarios autenticados, 
//si esta autenticado el usuario sessionController.loginRequired continua con el siguiente MW next(), de lo contrario redirecciona a /login
router.get('/quizes/new', 		sessionController.loginRequired, quizController.new);
router.post('/quizes/create',		sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',	 sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',	 sessionController.loginRequired, quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
// Deberia ser PUT ya que se va ser una actualización
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

module.exports = router;
