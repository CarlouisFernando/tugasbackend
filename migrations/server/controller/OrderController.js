const User = require("../models/User");
const Order = require("../models/Pesanan");

const { generateToken } = require("../utils/jwt");
const { default: mongoose } = require("mongoose");
const Menu = require("../models/Menu");

class OrderController {

    static async createOrder(req, res) {
        try {
            // Mendapatkan data dari permintaan
            const { items, totalPrice } = req.body;
            console.log(items)

            // Membuat array dari ID-menu
            const menuIds = JSON.parse(items).map(itemId => new mongoose.Types.ObjectId(itemId));

            // Mencari menu berdasarkan ID-menu yang ada dalam daftar items
            const menuList = await Menu.find({ _id: { $in: menuIds } });
            const menuIdList = menuList.map(item => ({ menuId: item }));

            const user = req.user;

            // Membuat order baru
            const newOrder = new Order({
                customer: user.id,
                items: menuIdList,
                totalPrice: totalPrice
            });

            // Menyimpan order ke dalam basis data
            await newOrder.save();

            // Mengarahkan pengguna ke halaman pesanan setelah order berhasil dibuat
            res.redirect("/user/pesanan");
        } catch (error) {
            // Mengatasi kesalahan yang terjadi selama penyisipan order
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    }

    static async getPesanan(req, res, next) {
        const user = req.user;
        try {
            // Mencari pesanan berdasarkan customerI/d
            const orders = await Order.find({ customer: user.id }).populate({
                path: 'items.menuId',
                model: 'Menu' // Nama model untuk menu items
            });
            // Jika pesanan ditemukan, kirimkan respons dengan data pesanan
            res.render("pesanan", { orders });
        } catch (error) {
            // Tangani kesalahan yang terjadi saat mencari pesanan
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }


    static async adminGetPesanan(req, res, next) {
        const user = req.user;
        try {
            // Mencari pesanan berdasarkan customerI/d
            const orders = await Order.find().populate({
                path: 'customer',
                model: 'User' // Ganti dengan nama model untuk customer
            }).populate({
                path: 'items.menuId',
                model: 'Menu' // Nama model untuk menu items
            });



            // Jika pesanan ditemukan, kirimkan respons dengan data pesanan
            res.render("admin/pesanan/index", { orders });
        } catch (error) {
            // Tangani kesalahan yang terjadi saat mencari pesanan
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }



    static async selesaiPesanan(req, res, next) {
        const id = req.params.id;
        try {
            const updatedOrder = await Order.findOneAndUpdate(
                { _id: id }, // Kriteria pencarian, dalam hal ini berdasarkan id
                { status: true }, // Data yang akan diperbarui, misalnya status diganti menjadi true
            );
            res.redirect("/admin/pesanan");
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ error: 'Failed to update order' });
        }
    }
    //untuk menolak dan menghapus pesanan
    static async tolak(req, res, next) {
        const id = req.params.id;
        try {
            const updatedOrder = await Order.findOneAndDelete(id);
            res.redirect("/admin/pesanan");
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ error: 'Failed to update order' });
        }
    }

}

module.exports = OrderController;
