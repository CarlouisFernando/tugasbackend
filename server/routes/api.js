const express = require('express');
const AuthenticationController = require('../controller/AuthenticationController');
const { celebrate, Joi, errors } = require('celebrate');
const { login, register } = require('../validator/authvalidator,');
const MenuController = require('../controller/MenuController');
const { verifyToken } = require('../utils/jwt');
const OrderController = require('../controller/OrderController');

// celebrate dan joi digunakan untuk validasi
const router = express.Router();
// Login route
router.post('/auth/login',
    celebrate({
        body: login
    }),
    AuthenticationController.login);
// Register route
router.post('/auth/register', celebrate({
    body: register
}), AuthenticationController.register);

router.post("/user/checkout", verifyToken, OrderController.createOrder)


// get list menu by id
router.post("/menu",
    celebrate(
        {
            body: Joi.object({
                menuIds: Joi.array().required().label('list id'),
            })
        }
    )
    , MenuController.getMenuListByIds);
router.use(errors());



module.exports = router;
