const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegex = /^[a-z0-9]+@[a-z].+\.[a-z]{2,3}$/;
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
    name: {
      type: String,
    },
    //   subscription: {
    //     type: String,
    //     enum: ["starter", "pro", "business"],
    //     default: "starter",
    //   },
    //   token: {
    //     type: String,
    //     default: null,
    //   },
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  //   email: Joi.string().pattern(emailRegex).required(),
  email: Joi.string().required(),

  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const schemas={registerSchema, loginSchema}
const User = model("user", userSchema);

module.exports = { User,schemas  };
