const RequestError = require("../helpers/requestErors");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../helpers/sendEmail");

dotenv.config();
const { SECRET_KEY } = process.env;
const { BASE_URL } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw RequestError(409, "Email in use");
    }
    // хешування паролю,складність 10
    const hasPasword = await bcrypt.hash(password, 10);
    // make url by mail
    const avatarURL = gravatar.url(email, { s: "200", d: "robohash" }, false);
    const verificationToken = uuidv4();
    const result = await User.create({
      email,
      password: hasPasword,
      avatarURL,
      verificationToken,
    });

    const msg = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${verificationToken}">Click to verify your email</a>`,
    };

    await sendEmail(msg);

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
    if (!user || !user.verify) {
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

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {
  // getting id from req
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;

  const extension = originalname.split(".").pop();
  const filename = `${_id}.${extension}`;
  // place for permanent storage
  const resultUpload = path.join(avatarsDir, filename);
  // take from temp to permanent storage
  await fs.rename(tempUpload, resultUpload);
  // working with img
  Jimp.read(resultUpload)
    .then((avatar) => {
      return avatar.resize(256, 256).write(resultUpload); // resize
    })
    .catch((err) => {
      console.error(err);
    });

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw RequestError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw RequestError(404, "User not found");
  }

  if (user.verify) {
    throw RequestError(400, "Verification has already been passed");
  }

  const msg = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${user.verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(msg);

  res.json({ message: "Verification email sent" });
};
module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyUser,
  resendEmail,
};
