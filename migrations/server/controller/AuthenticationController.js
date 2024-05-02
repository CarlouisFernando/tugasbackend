const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

class AuthenticationController {
 // Metode untuk menangani login pengguna
    static async login(req, res, next) {
        // Ekstrak username dan password dari body permintaan
        const { username, password } = req.body;     
         // Periksa apakah pengguna ada dalam database
        User.findOne({ username })
            .then(existingUser => {
                 // Jika pengguna tidak ada, kirim tanggapan error
                if (!existingUser) {
                    return res.json({
                        message: 'account not registered',
                        data: null
                    }, 401);
                }
                    // Jika pengguna ada, periksa apakah password benar
                User.findOne({ username, password })
                    .then(user => {
                        // Jika password salah, kirim tanggapan error
                        if (!user) {
                            return res.json({
                                message: 'invalid password',
                                data: null
                            }, 401);
                        }
                          // Jika password benar, buat token dan kirim tanggapan sukses
                        res.json(
                            {
                                message: 'success login',
                                data: {
                                    token: generateToken(user),
                                    role: user.role
                                }
                            }
                        );
                    })
                    .catch(err => {
                        // Tangani kesalahan internal
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    });
            })
            .catch(err => {
                // Tangani kesalahan internal
                console.error(err);
                res.json(
                    {
                        message: err.message,
                        data: null
                    }, 500
                );
            });
    }
    // Metode untuk menangani registrasi pengguna
    static async register(req, res, next) {
        // Ekstrak email, username, dan password dari body permintaan
        const { email, username, password } = req.body;
        // Buat instance pengguna baru
        const newUser = new User({ email, username, password });

         // Simpan pengguna baru ke database
        newUser.save()
            .then(user => {
                // Kirim tanggapan sukses setelah registrasi berhasil
                res.json({
                    data: user, message: "success registered please login"
                }, 201);
            })
            .catch(err => {
                // Tangani kesalahan internal
                res.json(
                    {
                        message: err.message,
                        data: null
                    }, 500
                );
            });
    }
}

module.exports = AuthenticationController;
