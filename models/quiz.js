// models/quiz.js

// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Quiz', {
        pregunta: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta Pregunta"
                }
            }
        },
        respuesta: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta Respuesta"
                }
            }
        },
        tema: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta Tema"
                },
                isIn: {
                    args: [
                        ["otro", "humanidades", "ocio", "ciencia", "tecnologia"]
                    ],
                    msg: "-> Tema Invalido"
                }
            }
        }
    });
}