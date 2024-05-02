const User = require("../models/User");
const Order = require("../models/Pesanan");

const { generateToken } = require("../utils/jwt");
const { default: mongoose } = require("mongoose");
const Menu = require("../models/Menu");
const FormDataModel = require("../models/FormData");


class FormController {
    // Method untuk membuat formulir baru
    static async createForm(req, res, next) {
        const email = req.body.email;
        const message = req.body.message;

        const name = req.user.name;// Anda perlu pastikan bahwa `req.user` sudah tersedia
        const formData = new FormDataModel({
            name: name, email: email, message: message
        });
        // Simpan data formulir baru
        formData.save();
        res.redirect("/user/Tkami");
    }
    // Method untuk mendapatkan semua formulir
    static async getForm(req, res, next) {
        const forms = await FormDataModel.find();
        console.log(forms)
        res.render("admin/saran/index", { forms });
    }

    // Method untuk mendapatkan detail formulir
    static async getFormDetail(req, res, next) {
        const id = req.params.id;
        var saran = await FormDataModel.findById(id);
        res.render("admin/saran/edit", { saran });
    }
    // Method untuk memperbarui formulir
    static async update(req, res, next) {
        const id = req.params.id;
        const email = req.body.email;
        const message = req.body.message;

        try {
            // Temukan dokumen dengan id yang diberikan
            const saran = await FormDataModel.findByIdAndUpdate(id, {
                email: email,
                message: message
            }, { new: true });

            if (!saran) {
                // Jika dokumen tidak ditemukan, tangani kasus ini
                return res.status(404).send('Saran not found');
            }

            // Kirim respons dengan dokumen yang diperbarui
            res.redirect("/admin/saran",);
        } catch (error) {
            // Tangani kesalahan yang terjadi selama pembaruan
            console.error('Error updating saran:', error);
            res.status(500).send('Error updating saran');
        }
    }
    // Method untuk mencari dan menghapus formulir
    static async findAndDelete(req, res, next) {
        const id = req.params.id;

        try {
            // Temukan dokumen dengan id yang diberikan dan hapus
            const deletedSaran = await FormDataModel.findOneAndDelete({ _id: id });

            if (!deletedSaran) {
                // Jika dokumen tidak ditemukan, tangani kasus ini
                return res.status(404).send('Saran not found');
            }

            // Kirim respons dengan dokumen yang dihapus
            res.redirect("/admin/saran",);

        } catch (error) {
            // Tangani kesalahan yang terjadi selama penghapusan
            console.error('Error deleting saran:', error);
            res.status(500).json({ error: 'Error deleting saran' });
        }
    }



}

module.exports = FormController;
