require('dotenv').config();
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const page = {}

const authGame = (req,res,next) => {}
const authUser = (req,res,next) => {
  // let path = req.path;
  // let method = req.method;
  // let idx = page_user.findIndex((x)=> x.name === path);
  // let user_auth;
  // if (idx !== -1) {
  //   let token = req.headers.token;
  //   if (token) {
  //     let decoded = jwt.verify(token,SECRET_KEY);
  //     user_auth = (typeof req.params.id !== 'undefined'? page_user[idx].hasParam[method] : page_user[idx].noParam[method]);
  //     let is_user_auth = -1;
  //     if (user_auth)
  //       is_user_auth = user_auth.findIndex((x)=>
  //         ( x === 'login' || (decoded.role === x) || (x === 'id' && decoded.id == req.params.id ) )
  //       );
  //
  //     if (is_user_auth === -1) res.send(`User ${decoded.username} - role ${decoded.role} tak dapat mengakses ${path} ${method}`);
  //     else next();
  //   } else res.send('You must login');
  // }
  // else next();
}


const getUserId = (token,callback) => {
  jwt.verify(token, SECRET_KEY, callback);

}

const getUserDetail = (token) => {
  jwt.verify(token, SECRET_KEY, (err,decoded)=>{
    return err? false : decoded;
  });
}

const createToken = (user_data) => {
  let token = jwt.sign(user_data, SECRET_KEY)
  return token;
}

const hashPassword = (password) => {
  let hashPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  return hashPassword;
}

const checkPassword = (password,hashPassword) => {
  let plainpass  = CryptoJS.AES.decrypt(hashPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return plainpass === password;
}

module.exports = {
  authUser,
  authGame,
  hashPassword,
  getUserId,
  getUserDetail,
  createToken,
  checkPassword
}