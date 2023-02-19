const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegexp = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

const userSchema = Schema(
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
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
      default: "",
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

const verifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required field email`,
  }),
});
// const schemas = { registerSchema, loginSchema };
const User = model("user", userSchema);

module.exports = { User, registerSchema, loginSchema, verifyEmailSchema };

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGZhN2NkYzI1MTI2ZWIzODM3YWQ0NyIsImlhdCI6MTY3NTYwMTg5OCwiZXhwIjoxNjc1Njg4Mjk4fQ.1d1v6tgewyoPafoWlwphD5DtwwxaZNa-JjEq0doGQE0"
