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
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', {
      quizes: quizes
    })
  }).catch(function(error) {
    next(error);
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