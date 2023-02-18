const RequestError = require("../errors/helpers/requestErors");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { assert } = require("joi");

dotenv.config();
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw RequestError(409, "Email in use");
    }
    // хешування паролю,складність 10
    const hasPasword = await bcrypt.hash(password, 10);
    const result = await User.create({ email, password: hasPasword });
    res
      .status(201)
      .json({ email: result.email, subscription: result.subscription });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw RequestError(401, "Email or password wrong");
    }
    // порівняння хешу паролю
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw RequestError(401, "Email or password wrong");
    }
    console.log(user);
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({ message: "logout success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (e) {
    next(e);
  }
};

module.exports = { register, login, logout, getCurrent };
