const mongoose = require('mongoose');

// Skema untuk menu
const TokoSchema = new mongoose.Schema({
    alamat: {
        type: String,
        required: true
    },
    jam_buka: {
        type: String,
        required: true
    },
    kontak: {
        type: String,
        required: true
    }
});

// Membuat model Menu berdasarkan skema
const Toko = mongoose.model('Toko', TokoSchema);

// Menyediakan model Menu untuk digunakan di luar file
module.exports = Toko;
