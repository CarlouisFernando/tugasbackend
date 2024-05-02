const jwt = require('jsonwebtoken');


// Fungsi untuk membuat token JWT
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        username: user.username
        // Anda bisa menambahkan data tambahan yang diperlukan di sini
    };
    // Membuat token dengan menggunakan secret key
    const token = jwt.sign(payload, 'secret_key', { expiresIn: '1h' });
    return token;
}

// Fungsi untuk memverifikasi token JWT
function verifyToken(req, res, next) {
    // Mengambil token dari header Authorization
    const token = req.session.token;

    // Jika token tidak ditemukan
    if (!token) {
        return res.redirect("/login");
    }
    // Verifikasi token menggunakan secret key
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.redirect("/login");
        }
        req.user = decoded;
        next();
    });
}

module.exports = {
    generateToken,
    verifyToken
};
