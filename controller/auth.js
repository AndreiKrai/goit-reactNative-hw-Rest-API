const RequestError = require("../errors/helpers/requestErors");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw RequestError(409, "Email in use");
    }
    // хешування паролю,складність 10
    const hasPasword = await bcrypt.hash(password, 10);
    const result = await User.create({ name, email, password: hasPasword });
    res.status(201).json({ name: result.name, email: result.email });
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
    const token = "jfvnpvifpvij";
    res.json({ token });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = { register, login };
