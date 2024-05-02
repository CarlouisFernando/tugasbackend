//library joi untuk validation
const Joi = require('joi');
//Aturan validasi untuk register memeriksa apakah objek memiliki properti email, username, dan password.
const register = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});
//Aturan validasi untuk login memeriksa apakah objek memiliki properti username dan password.
const login = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    register, login
};
