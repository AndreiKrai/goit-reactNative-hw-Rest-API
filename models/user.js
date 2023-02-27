const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema(
  // if you didn't add some field it woun't apear in userDB
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    email: {
      type: String,
      // match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verificationToken: { type: String },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  //   email: Joi.string().pattern(emailRegex).required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().required(),
});
// const schemas = { registerSchema, loginSchema };
const User = model("user", userSchema);

module.exports = { User, registerSchema, loginSchema, emailSchema };

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGZhN2NkYzI1MTI2ZWIzODM3YWQ0NyIsImlhdCI6MTY3NTYwMTg5OCwiZXhwIjoxNjc1Njg4Mjk4fQ.1d1v6tgewyoPafoWlwphD5DtwwxaZNa-JjEq0doGQE0"
