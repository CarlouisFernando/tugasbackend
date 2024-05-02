
const mongoose = require('mongoose');

// Define Schema and Model for form data
const FormDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
}, { collection: 'kritik' }); // Specify collection name

const FormDataModel = mongoose.model('FormData', FormDataSchema);
module.exports = FormDataModel;