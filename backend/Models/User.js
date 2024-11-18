const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    distanceToOffice: { type: String },
    vehicleType: { type: String },
    fuelType: { type: String },
    commuteMethod: { type: String },
    energyUsage: { type: String },
    diet: { type: String },
    recycling: { type: Boolean },
    consent: { type: Boolean },
    date: { type: String },
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
