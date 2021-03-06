var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
	where: { id: Number(quizId) },
	include: [{ model: models.Comment }]
 	}).then(
    function(quiz){ 
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  var search;
  if(req.query.search === undefined){ 
    search = '';
  }else{
    search = req.query.search.toLowerCase().trim();
    search = search.replace(/\s/gi, "%");
  }
  console.log("search: "+search); 
  models.Quiz.findAll({
      where: [
       "lower(pregunta) like ?",'%'+search+'%' 
      ],
      order: 'pregunta ASC'
    }).then(
    function(quizes){ 
      res.render('quizes/index.ejs', { quizes: quizes});
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
  var resultado = 'Incorrecto';
  if(req.query.respuesta.trim().toLowerCase() === req.quiz.respuesta.trim().toLowerCase()){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "", respuesta: ""}
  );
  res.render('quizes/new', {quiz: quiz});
};

// GET /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz.validate().then(
    function(err){
      if(err){
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        //guarda en DB los campos pregunta y respuesta de Quiz  
        quiz.save({fields: ["pregunta", "respuesta", "tipo"]}).then(
          function(){
            res.redirect('/quizes'); //redirect a lista de preguntas
          }  
        ) 
      }
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; //autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tipo = req.body.quiz.tipo;

  req.quiz.validate().then(
    function(err){
      if(err){
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        //guarda en DB los campos pregunta y respuesta de Quiz  
          req.quiz.save({fields: ["pregunta", "respuesta", "tipo"]}).then(
          function(){
            res.redirect('/quizes'); //redirect a lista de preguntas
          }  
        ) 
      }
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(function(){
            res.redirect('/quizes'); //redirect a lista de preguntas
  }).catch(function(error){
    next(error);
  });
};
