'use strict';

const { default: mongoose } = require('mongoose');
const User = require('../server/models/User');

module.exports = {
  async up(db, client) {
    mongoose.connect('mongodb://localhost:27017/saran', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Tambahkan logika untuk menambahkan admin ke dalam basis data
    await User.create({
      email: 'admin@example.com',
      username: 'admin',
      password: '123',
      role: 'admin'
    });
  },

  async down(db, client) {
    // Tambahkan logika untuk menghapus admin dari basis data
    await User.deleteOne({ email: 'admin@example.com' });
  }
};
