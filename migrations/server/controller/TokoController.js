const User = require("../models/User");
const Order = require("../models/Pesanan");

const { generateToken } = require("../utils/jwt");
const { default: mongoose } = require("mongoose");
const Menu = require("../models/Menu");
const Toko = require("../models/Toko");

class TokoController {
    // Method untuk mendapatkan daftar toko
    static async get(req, res) {
        try {
            var tokos = await Toko.find();
            res.render("admin/settings/index", { tokos });
        } catch (error) {
            // Mengatasi kesalahan yang terjadi selama penyisipan order
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    }

    // Method untuk menambahkan toko baru
    static async add(req, res, next) {
        const alamat = req.body.alamat
        const jam_buka = req.body.jam_buka
        const kontak = req.body.kontak;



        await new Toko({
            alamat: alamat, jam_buka: jam_buka, kontak: kontak
        }).save()
        res.redirect("/admin/settings");
    }

    // Method untuk menghapus toko berdasarkan ID
    static async deleteById(req, res, next) {
        const id = req.params.id;
        const deleteToko = await Toko.findOneAndDelete({ _id: id });
        res.redirect("/admin/settings");
    }
    // Method untuk menampilkan halaman edit toko
    static async edit(req, res, next) {
        const id = req.params.id;
        const toko = await Toko.findById(id);
        res.render("admin/settings/edit", { toko });
    }
    // Method untuk memperbarui data toko
    static async updateToko(req, res, next) {
        const alamat = req.body.alamat;
        const jam_buka = req.body.jam_buka;
        const kontak = req.body.kontak;
        const id = req.params.id;

        try {
            // Temukan dan perbarui data berdasarkan ID
            const updatedToko = await Toko.findByIdAndUpdate(id, {
                alamat: alamat,
                jam_buka: jam_buka,
                kontak: kontak
            }, { new: true });

            if (!updatedToko) {
                // Jika data tidak ditemukan, kirimkan respons dengan status 404
                return res.status(404).json({ message: 'Data not found' });
            }
            // Jika data berhasil diperbarui, kirimkan respons berhasil
            res.redirect("/admin/settings");
        } catch (error) {
            // Tangani kesalahan yang terjadi selama proses pembaruan
            console.error('Error updating data:', error);
            res.status(500).json({ error: 'Failed to update data' });
        }
    }




}

module.exports = TokoController;
