// controllers/quiz_controller.js

var models = require("../models/models.js")

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      }
      else {
        next(new Error('No existe quizId=' + quizId));
      }
    });
}

// GET /quizes
exports.index = function(req, res, next) {
  var search = ("%" + (req.query.search || "") + "%").replace(' ', '%');
  models.Quiz.findAll({
    where: ['pregunta like ?', search]
  }).then(function(quizes) {
    res.render('quizes/index.ejs', {
      // devuelve una lista ordenada si se ha realizado una busqueda
      quizes: (req.query.search) ? quizes.sort(function(a, b) {
        return a.pregunta > b.pregunta;
      }) : quizes
    })
  }).catch(function(error) {
    next(error);
  });
}

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build({
    pregunta: "",
    respuesta: ""
  });

  res.render('quizes/new', {quiz: quiz});
}

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  
  // guarda en la DB el quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect("/quizes");
  });
}

// GET /quizes/:quizId
exports.show = function(req, res) {
  res.render('quizes/show', {
    quiz: req.quiz
  });
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
  if (req.query.respuesta === req.quiz.respuesta) {
    res.render('quizes/answer', {
      quiz: req.quiz,
      respuesta: 'Correcto'
    });
  }
  else {
    res.render('quizes/answer', {
      quiz: req.quiz,
      respuesta: 'Incorrecto'
    });
  }
}