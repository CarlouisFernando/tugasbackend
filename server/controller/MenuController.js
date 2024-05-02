const { default: mongoose } = require("mongoose");
const Menu = require("../models/Menu");
const Order = require("../models/Pesanan");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

class MenuController {

    // user menu
    static async uMenu(req, res, next) {

        var menus = await Menu.find();
        return res.render('menu', { menus });
    }


    static async aMenu(req, res, next) {
        var menus = await Menu.find();
        return res.render('admin/menu/index', { menus });
    }


    static async edit(req, res) {

        const id = req.params.id
        const menu = await Menu.findById(id)

        return res.render('admin/menu/edit', {
            menu
        });
    }


    static async update(req, res, next) {
        try {
            const { name, description, price } = req.body;
            const id = req.params.id;

            // Find the menu item by ID
            let menu = await Menu.findById(id);

            // Update the menu item properties
            if (name) menu.name = name;
            if (description) menu.description = description;
            if (price) menu.price = price;

            const image = req.file;

            if (image) {
                menu.image = image.filename;
            }

            // Save the updated menu item
            await menu.save();
            res.redirect('/admin/menu');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }


    static async deleteMenu(req, res, next) {
        try {
            const id = req.params.id;
            // Find the menu item by ID
            let menu = await Menu.findById(id);
            await menu.deleteOne();
            res.redirect('/admin/menu');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }


    static async createMenu(req, res, next) {
        try {
            const { name, description, price } = req.body;
            // Mendapatkan informasi gambar yang diunggah
            const image = req.file;
            if (!image) {
                return res.status(400).json({ message: 'Image is required' });
            }
            // Buat menu baru dengan informasi yang diberikan
            const newMenu = new Menu({
                name: name,
                description: description,
                price: price,
                // Menyimpan nama gambar sebagai bagian dari dokumen menu
                image: image.filename // Simpan nama file gambar
            });
            // Simpan menu ke database
            await newMenu.save();
            res.redirect('/admin/menu');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    }



    static async getMenuListByIds(req, res, next) {

        try {
            const { menuIds } = req.body; // Assuming the menuIds are sent in the request body

            // Find menu items based on the provided IDs
            const menuList = await Menu.find({ _id: { $in: menuIds } });

            res.json(menuList); // Return the menu list as JSON response
        } catch (error) {
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
    };


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


}

module.exports = MenuController;
