const mongoose = require('mongoose');

// Define schema for the order
const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for users
        required: true
    },
    items: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu', // Assuming you have a Menu model for menu items
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    }
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
