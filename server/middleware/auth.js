const { User } = require('../model/user');

let auth = (req, res, next) => {
    let token = req.cookies.w_auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({
                isAuth: false,
                error: true
            });

        req.token = token;
        req.user = user;
        next();
    });
};
//auth middleware gives information of logged in user with his token
module.exports = { auth };