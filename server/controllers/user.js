const User = require('../models/user');
const nodemailer = require('nodemailer');

// Function to generate a random numeric OTP
const generateNumericOTP = (length) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// Function to send verification email
const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verification Code',
            text: `Welcome to Remedo 👩‍⚕️ 
            Your verification code is: ${otp}.
            Kindly Enter The Same and proceed with slot booking!    BE SAFE!    BE HEALTHY! 🙂`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error.message);
        throw error;
    }
};

const signup = async (req, res) => {
    try {
        const { name, email } = req.body;

        let existingUser = await User.findOne({ email });

        const otp = generateNumericOTP(6);

        if (existingUser) {
            existingUser.otp = otp;
            await existingUser.save();

            await sendVerificationEmail(email, otp);

            return res.json({ message: 'User already exists. New OTP sent successfully.', existingUser });
        }

        // Use "pending" as the initial verification status
        const newUser = new User({ name, email, verificationStatus: 'pending', otp });
        await newUser.save();

        // Send verification email with OTP
        await sendVerificationEmail(email, otp);

        res.json({ message: 'User signed up successfully. Verification email sent.', newUser });
    } catch (error) {
        console.error('Error signing up:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            // User not found, create a new user
            const newUser = new User({ email, verificationStatus: 'verified', otp });
            await newUser.save();

            return res.json({ message: 'User verified successfully.' });
        }

        // Check if the OTP matches
        if (user.otp != otp.toString()) {
            return res.status(404).json({ error: 'Incorrect OTP.' });
        }


        // Update the verification status to "verified"
        user.verificationStatus = 'verified';
        await user.save();

        res.json({ message: 'User verified successfully.' });
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signup,
    verifyOTP,
};
