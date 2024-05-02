const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

class UserController {

    static async get(req, res, next) {
        const user = req.user;
        res.render('settings', { user });
    }

    static async updateUser(req, res, next) {
        const { email, username, password } = req.body;
        const id = req.params.id;

        try {
            // Temukan dan perbarui data pengguna berdasarkan ID
            const updatedUser = await User.findByIdAndUpdate(id, {
                email: email,
                username: username,
                password: password
            }, { new: true });

            if (!updatedUser) {
                // Jika pengguna tidak ditemukan, kirim respons dengan status 404
                return res.status(404).json({ message: 'User not found' });
            }
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    // Tangani kesalahan jika sesi tidak dapat dihapus
                    return res.status(500).send('Error destroying session');
                }
                // Redirect pengguna ke halaman login setelah sesi dihapus
                res.redirect("/login");
            });
        } catch (error) {
            // Tangani kesalahan yang terjadi selama proses pembaruan
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    static async deleteUser(req, res, next) {

        const id = req.params.id;

        try {
            // Temukan dan perbarui data pengguna berdasarkan ID
            await User.findOneAndDelete(id);
            return res.redirect("/login");
        } catch (error) {
            // Tangani kesalahan yang terjadi selama proses pembaruan
            console.error('Error delting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

}

module.exports = UserController;
