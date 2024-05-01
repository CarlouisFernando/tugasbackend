/* Script untuk kritik dan saran */
document.getElementById('submitButton').addEventListener('click', function() {
    var namaInput = document.getElementById('nama').value;
    var emailInput = document.getElementById('email').value;
    var pesanInput = document.getElementById('pesan').value;

    if (!namaInput || !emailInput || !pesanInput) {
        alert('Silahkan isi semua bidang terlebih dahulu!');
    } else {
        alert('Terima kasih telah mengisi kritik/saran.');
    }
});

$('input').on('change', function() {
    $('body').toggleClass('blue');
});
