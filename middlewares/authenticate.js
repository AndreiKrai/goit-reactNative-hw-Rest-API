const jwt = require("jsonwebtoken");
const RequestError = require("../errors/helpers/requestErors");
const { User } = require("../models/user");
const dotenv = require("dotenv");

dotenv.config();
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [bearer, token] = authorization.split(" ");
    console.log(token);

    if (bearer !== "Bearer") {
      console.log("bearer !");

      throw RequestError(401);
    }
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);
    console.log(user);

    if (!user || !user.token || user.token !== token) {
      throw RequestError(401);
    }
    // створюємо req.user для того щоб потім викоритовувати цю інфу далі в контроллерах
    req.user = user;

    next();
  } catch (e) {
    if (!e.status) {
      e.status = 401;
      e.message = "Unauthorized";
    }
    next(e);
  }
};

module.exports = authenticate;
