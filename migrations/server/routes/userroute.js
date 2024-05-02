

const express = require('express');
const MenuController = require('../controller/MenuController');
const { verifyToken } = require('../utils/jwt');
const { route } = require('./adminreoute');
const OrderController = require('../controller/OrderController');
const FormController = require('../controller/FormController');
const session = require('express-session');
const UserController = require('../controller/UserController');
const router = express.Router();



// Rute untuk halaman admin
router.get("/Tkami", (req, res) => {
    res.render('Tkami');
});
router.get("/menu", MenuController.uMenu);

router.use(verifyToken);

router.get("/pesanan", OrderController.getPesanan)

router.get("/wishlist", (req, res) => {
    res.render('wishlist');
});
router.get("/cart", (req, res) => {
    res.render('cart');
});

router.get("/settings", UserController.get);
router.post("/settings/:id", UserController.updateUser);
router.get("/settings/delete/:id", UserController.deleteUser);



router.post("/submit-form", FormController.createForm)
router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            // Tangani kesalahan jika sesi tidak dapat dihapus
            return res.status(500).send('Error destroying session');
        }
        // Redirect pengguna ke halaman login setelah sesi dihapus
        res.redirect("/login");
    });
})

// Tambahkan rute-rute lain untuk panel admin di sini

module.exports = router;
