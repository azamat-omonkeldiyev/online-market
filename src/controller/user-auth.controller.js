require("dotenv").config();
const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const userValidationSchema = require("../validation/user.validate");
const { totp } = require("otplib");
const { sendEmail, sendSms } = require("./../sent-otp-funcs/sent-otp-funcs");
// const upload = require("./../multer/multer");
const Region = require("../model/region.model");

totp.options = { step: 1000, digits: 6 };

function genToken(user) {
    let token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRY }
    );    
    return token;
};
  
function genRefreshToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

// Register with phone User
const register = async (req, res) => {
    try {
      const { error } = userValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      let { phone, email, password,region_id, name, ...rest } = req.body;

      let userEmail = await User.findOne({ where: { email } });
      if (userEmail) {
        return res.status(400).send({ message: "Email already exists" });
      }

      let userPhone = await User.findOne({ where: { phone } });
      if (userPhone) {
        return res.status(400).send({ message: "Phone already exists" });
      }

      let usernameFound = await User.findOne({ where: { name } });
      if (usernameFound) {
        return res.status(400).send({ message: "Username already exists. Please change your username.." });
      };

      let region = await Region.findByPk(region_id);
      if(!region) return res.status(404).send({message: "region not found"});



      let hash = bcrypt.hashSync(password, 10);
      let newUser = await User.create({
        ...rest,
        name,
        region_id,
        email,
        phone,
        password: hash
      });

      res.send(newUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    };
};


const login = async (req,res) => {
    try {
        let {name, password} = req.body;
        if(!name || !password ){
            return res.status(400).send("username va password kiriting!...");
        }

        let user = await User.findOne({where: {name}});
        if(!user){
            return res.status(400).send("user not found");
        }
        let isMatch = bcrypt.compareSync(password,user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid password" });
        };

        let access_token = genToken(user);
        let refresh_token = genRefreshToken(user)

        res.send({ access_token, refresh_token });

    } catch (error) {
        console.log(err);
        res.status(500).send({message : error.message})
    }
};

const sendOtp = async (req, res) => {
  let { email , phone} = req.body;
  try {

    let emailFound = await User.findOne({ where: { email } });
    if (emailFound) {
      return res.status(409).send({ message: "Email already exists" });
    };

    let phoneFound = await User.findOne({ where: { phone } });
    if (phoneFound) {
      return res.status(409).send({ message: "Phone already exists" });
    };

    const token = totp.generate(email + process.env.TOTP_SECRET);
    console.log(token);

    // await sendSms(phone,token);
    await sendEmail(email,token);
    return res.send(`Email pochtangizga va telefon raqamingizga parol yuborildi.\n${token}`);
  } catch (error) {
    console.log(err);
    res.status(500).send({ err: error.message });
  }
};

const verify = async (req, res) => {
  let { email, otp } = req.body;
  try {

    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(409).send({ message: "User already exists" });
    }

    let match = totp.verify({ token: otp, secret: email + process.env.TOTP_SECRET });
    console.log(otp, email);
    res.send({ verified: match });
  } catch (error) {
    console.log(err);
    res.status(500).send({ error: error.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include : {model: Region}
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user){
        return res.status(404).json({ error: "User not found" }); 
    } 
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// get refresh token
const refresh = async (req,res) => {
    try {
        let {refresh_token} = req.body;
  
        if(!refresh_token) return res.status(400).send("refresh_token not provided");
  
        let data = jwt.verify(refresh_token, "secret_boshqa");
        let token = genToken(data.id);
        res.send({token});
  
    } catch (error) {
        console.log(error);
        res.send({message : "Invalid refresh token"});
    }
  };

// Update User
const updateUser = async (req, res) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error){
        return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findByPk(req.params.id);
    if (!user){
        return res.status(404).json({ error: "User not found" });
    } 
    await user.update(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user){
        return res.status(404).json({ error: "User not found" });
    };
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  login,
  refresh,
  register,
  verify,
  sendOtp,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
