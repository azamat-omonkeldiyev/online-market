require("dotenv").config();
const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userValidationSchema = require("../validation/user.validate");
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
}

function genRefreshToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}

// Register with phone User
const register = async (req, res) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let { phone, email, password, region_id, name, ...rest } = req.body;

    let userEmail = await User.findOne({ where: { email } });
    if (userEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let userPhone = await User.findOne({ where: { phone } });
    if (userPhone) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    let usernameFound = await User.findOne({ where: { name } });
    if (usernameFound) {
      return res.status(400).json({
        message: "Username already exists. Please change your username..",
      });
    }

    let region = await Region.findByPk(region_id);
    if (!region) return res.status(404).json({ message: "region not found" });

    let hash = bcrypt.hashSync(password, 10);
    let newUser = await User.create({
      ...rest,
      name,
      region_id,
      email,
      phone,
      password: hash,
    });

    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    let { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json("please enter name and password...");
    }

    let user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(400).json("user not found");
    }
    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    let access_token = genToken(user);
    let refresh_token = genRefreshToken(user);

    res.json({ access_token, refresh_token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    let { email, phone } = req.body;
    if (!email || !phone) {
      return res
        .status(400)
        .json({ message: "please enter the phone and email" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({ message: "the format of email is incorrect" });

    if (phone && !/^\d{9}$/.test(phone))
      return res
        .status(400)
        .json({
          message:
            "the amount of numbers should be at least 9(example: 936005412)",
        });

    if (email && (await User.findOne({ where: { email } })))
      return res.status(409).json({ message: "Email already exists" });

    if (phone && (await User.findOne({ where: { phone } })))
      return res.status(409).json({ message: "Phone already exists" });

    const token = totp.generate(email + process.env.TOTP_SECRET);
    console.log(token);

    // await sendSms(phone,token);
    await sendEmail(email, token);
    return res.json(`The otp is sent to your email and phone.[${token}]`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};

const verify = async (req, res) => {
  let { email, otp } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    let match = totp.verify({
      token: otp,
      secret: email + process.env.TOTP_SECRET,
    });
    console.log(otp, email);
    res.json({ verified: match });
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: error.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    const { region_id, page = 1, limit = 10, sort = "ASC" } = req.query;

    const whereCondition = region_id ? { region_id } : {};

    const users = await User.findAndCountAll({
      where: whereCondition,
      include: { model: Region },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["name", sort.toUpperCase()]],
    });

    res.status(200).json({
      total: users.count,
      page: parseInt(page),
      data: users.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Region },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Me
const me = async (req, res) => {
  try {
    console.log(req.userId);
    let data = await User.findByPk(req.userId, { include: Region });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// get refresh token
const refresh = async (req, res) => {
  try {
    let { refresh_token } = req.body;

    if (!refresh_token)
      return res.status(400).json("refresh_token is not provided");

    let data = jwt.verify(refresh_token, "secret_boshqa");
    let token = genToken(data.id);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid refresh token" });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
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
  me,
};
