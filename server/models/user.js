const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'unverified'],
        default: 'pending',
    },
    otp: {
        type: Number,
    },
});

// // Compare password method
// userSchema.methods.comparePassword = async function (candidatePassword) {
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     return isMatch;
// };
const User = mongoose.model('User', userSchema);
module.exports = User;
