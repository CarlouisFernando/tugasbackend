const mongoose = require('mongoose');

// Skema untuk menu
const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

// Membuat model Menu berdasarkan skema
const Menu = mongoose.model('Menu', MenuSchema);

// Menyediakan model Menu untuk digunakan di luar file
module.exports = Menu;
