// controllers/quiz_controller.js

var models = require("../models/models.js")

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
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
      }) : quizes,
      errors: [],
    })
  }).catch(function(error) {
    next(error);
  });
}

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build({
    pregunta: "",
    respuesta: "",
    tema: "otro",
  });

  res.render('quizes/new', {
    quiz: quiz,
    errors: [],
  });
}

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz)
  quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/new', {
        quiz: quiz,
        errors: err.errors,
      });
    }
    else {
      quiz.save({ // guarda en la DB el quiz
        fields: ["pregunta", "respuesta", "tema"]
      }).then(function() {
        res.redirect("/quizes");
      });
    }
  })

}

// GET /quizes/:quizId
exports.show = function(req, res) {
  res.render('quizes/show', {
    quiz: req.quiz,
    errors: [],
  });
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
  res.render('quizes/answer', {
    quiz: req.quiz,
    respuesta: (req.query.respuesta === req.quiz.respuesta) ?
      'Correcto' : 'Incorrecto',
    errors: [],
  });
}

// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
  res.render('quizes/edit', {
    quiz: req.quiz,
    errors: [],
  })
}

// PUT /quizes/:quizId
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/new', {
        quiz: req.quiz,
        errors: err.errors,
      });
    }
    else {
      req.quiz.save({ // guarda en la DB el quiz
        fields: ["pregunta", "respuesta", "tema"]
      }).then(function() {
        res.redirect("/quizes");
      });
    }
  })
}

// DELETE /quizes/:quizId
exports.destroy = function(req, res, next) {
  req.quiz.destroy().then(function() {
    res.redirect('/quizes');
  }).catch(function(error) {
    next(error);
  });
}