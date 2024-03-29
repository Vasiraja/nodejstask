const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Nodemailer configuration
let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: "rktechcoding@gmail.com", // Update with your Gmail email
    pass: "Rktechcoding#7", // Update with your Gmail password
  }
});

 function generateVerificationToken() {
  const tokenLength = 16;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex]; 
  }
  return token;
}

async function sendVerificationEmail(email, token) {
  try {
    let mailOptions = {
      from: 'rktechcoding@gmail.com', // Update with your Gmail email
      to: email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email: http://localhost:3000/auth/verify/${token}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

const phoneRegex = /^[6-9]\d{9}$/;  

exports.signup = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;
 
    if (!phoneRegex.test(mobileNumber)) {
      return res.status(400).json({ error: 'Invalid mobile number. Please enter a 10-digit number starting with 6, 7, 8, or 9' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const newUser = new User({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      emailVerified: false,
      verificationToken
    });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'User created successfully. Please verify your email.', verificationToken });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    if (!user.emailVerified) {
      return res.status(401).json({ error: 'Email not verified' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'User not found or token expired' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined; 
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

