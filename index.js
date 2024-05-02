const express = require('express');
const app = express();
const port = 3000;
const { errors } = require('celebrate');

const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { default: AuthenticationController } = require('./server/controller/AuthenticationController');
const api = require('./server/routes/api')
const adminRoutes = require('./server/routes/adminreoute');
const userRoutes = require('./server/routes/userroute');

const session = require('express-session');
const { default: axios } = require('axios');


// Middleware to parse JSON and urlencoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set template engine ejs
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.use(session({
    secret: 'secret_key', // Ganti dengan secret key yang lebih aman
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Anda mungkin perlu menyesuaikan opsi ini tergantung pada lingkungan Anda
}));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/saran', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});


app.use("/api", api);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);


// Routes
app.get('/login', (req, res) => {
    res.render('login');
});


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.redirect('/user/Tkami');
});

// logout untuk admin
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            // Tangani kesalahan jika sesi tidak dapat dihapus
            return res.status(500).send('Error destroying session');
        }
        // Redirect pengguna ke halaman login setelah sesi dihapus
        res.redirect("/login");
    });
});


// login dengan memanggil api login
app.post('/login', async (req, res) => {
    try {
        // Panggil API login
        const response = await axios.post(`http://localhost:${port}/api/auth/login`, {
            username: req.body.username,
            password: req.body.password
        });
        // Cek jika respons dari API adalah sukses
        req.session.token = response.data.data.token;
        req.session.role = response.data.data.role;
        if (response.status == 200) {
            if (req.session.role === 'admin') {
                res.redirect('/admin');
            } else {
                // karena berhasil login maka token disimpan di localstorage
                res.redirect('/user/Tkami');
            }
        } else {
            // Jika autentikasi gagal, kirimkan pesan error ke halaman login
            res.render('login', { error: 'Login failed. Please try again.' });
        }
    } catch (error) {
        console.log(error)
        res.render('login', { error: error.response.data.message });
    }
});


app.post('/signup', async (req, res) => {
    try {
        // Panggil API login
        const response = await axios.post(`http://localhost:${port}/api/auth/register`, {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        // Cek jika respons dari API adalah sukses
        req.session.token = response.data.data.token;
        req.session.role = response.data.data.role;
        if (response.status == 200) {
            if (req.session.role === 'admin') {
                res.redirect('/admin');
            } else {
                // karena berhasil login maka token disimpan di localstorage
                res.redirect('/user/Tkami');
            }
        } else {
            // Jika autentikasi gagal, kirimkan pesan error ke halaman login
            res.render('login', { error: 'Login failed. Please try again.' });
        }
    } catch (error) {
        console.log(error)
        res.render('login', { error: error.response.data.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
