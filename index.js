const express = require('express')
const app = express()
const port = 3000
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.set('view engine', 'ejs')


app.use(express.static('public'))
// go to login page
app.get('/', (req, res) =>{
    res.render('login')
})
//go to main page
app.get('/Tkami', (req, res) =>{
    res.render('Tkami')
})
//go to menu
app.get('/menu', (req, res) =>{
    res.render('menu')
})
// go to signup
app.get('/signup', (req, res) =>{
    res.render('signup')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

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

// Memasukkan data insight
const FormDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { collection: 'kritik' }); // Specify collection name


// Create a model
const FormData = mongoose.model('FormData', FormDataSchema);

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In your app.js or server.js file

// In your app.js or server.js file

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Check if the username exists in the database
    User.findOne({ username })
        .then(existingUser => {
            if (!existingUser) {
                // Username does not exist, render login page with error message
                return res.render('login', { error: 'Account is not registered', username });
            }
            
            // Check MongoDB for user with provided credentials
            User.findOne({ username, password })
                .then(user => {
                    if (!user) {
                        // User found, but password is incorrect
                        return res.render('login', { error: 'Invalid password', username });
                    }

                    // User found, authentication successful
                    // Redirect to the "/Tkami" page
                    res.redirect('/Tkami');
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});


// Route to handle form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        // Create a new document in MongoDB
        const formData = new FormData({ name, email, message });
        await formData.save();
        res.status(201).send('Form data saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//-------
// User model
const User = require('./views/models/User');

// In your app.js or server.js file

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});


// In your app.js or server.js file

app.post('/signup', (req, res) => {
    const { email, username, password } = req.body;
    
    // Create new user
    const newUser = new User({ email, username, password });

    // Save user to MongoDB
    newUser.save()
        .then(user => {
            // Redirect to the login page
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error registering user');
        });
});


        