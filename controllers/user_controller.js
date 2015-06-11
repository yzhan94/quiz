// controllers/user_controller.js

var users = {
    admin: {
        id: 1,
        username: "admin",
        password: "admin",
    },
    pepe: {
        id: 2,
        username: "pepe",
        password: "pepe",
    },
};

exports.autenticar = function(login, password, callback) {
    if (users[login]) {
        if (password === users[login].password) {
            callback(null, users[login]);
        }
        else {
            callback(new Error('Password erroneo'));
        }
    }
    else {
        callback(new Error('Usuario incorrecto'));
    }
};