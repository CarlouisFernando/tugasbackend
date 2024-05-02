

const express = require('express');
const MenuController = require('../controller/MenuController');
const router = express.Router();

const multer = require('multer');
const OrderController = require('../controller/OrderController');
const FormController = require('../controller/FormController');
const TokoController = require('../controller/TokoController');

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/menu/') // Folder tempat menyimpan file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Nama file yang disimpan
    }
});
const upload = multer({ storage: storage });

// Middleware untuk memeriksa sesi pengguna
router.use((req, res, next) => {
    const role = req.session.role
    if (role && role == 'admin') {
        return next()
    }
    return res.redirect('/login')
})

// Rute untuk halaman admin
router.get("/", (req, res) => {
    res.render('admin/index');
});
// Rute-rute terkait menu
router.get("/menu", MenuController.aMenu);
router.get("/menu/add", (req, res) => {
    res.render('admin/menu/add');
});
router.get("/menu/edit/:id", MenuController.edit);
router.post("/menu/edit/:id", upload.single('image'), MenuController.update);
router.get("/menu/delete/:id", upload.single('image'), MenuController.deleteMenu);

router.post("/menu/add", upload.single('image'), MenuController.createMenu);
// Rute-rute terkait pesanan
router.get("/pesanan", OrderController.adminGetPesanan)
router.get("/pesanan/selesai/:id", OrderController.selesaiPesanan)
router.get("/pesanan/tolak/:id", OrderController.tolak)



router.get("/saran", FormController.getForm);
router.get("/saran/edit/:id", FormController.getFormDetail);
router.post("/saran/edit/:id", FormController.update);
router.get("/saran/delete/:id", FormController.findAndDelete);

// Rute-rute terkait pengaturan toko
router.get("/settings", TokoController.get);
router.get("/settings/add", (req, res) => {
    res.render('admin/settings/add');
});

router.post("/settings/add", TokoController.add);
router.get("/settings/delete/:id", TokoController.deleteById);
router.get("/settings/edit/:id", TokoController.edit);
router.post("/settings/edit/:id", TokoController.updateToko);







// Tambahkan rute-rute lain untuk panel admin di sini

module.exports = router;
