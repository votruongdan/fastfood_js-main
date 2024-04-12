const User = require('../models/User');
const { verifyToken } = require('../helpers');

function Authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    verifyToken(token);
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
}
async function Authorize(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const data = verifyToken(token);
    const user = await User.findOne({ _id: data._id });
    if (!user) {
      return res.redirect('/login');
    }
    if (!user.role) {
      return res.redirect('/');
    }
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
}
function LoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    try {
      verifyToken(token);
      return res.redirect('/');
    } catch (error) {}
  }
  next();
}

module.exports = {
  Authenticate,
  Authorize,
  LoggedIn,
};
