const db = require("../models/index.js");
const bcrypt = require('bcrypt');

const getUser = async (username) => {
    const user = await db.User.findOne({ where: { username } });
    if (user === null) {
        return false;
    } else {
        return user;
    }
}

const hashPass = (pass) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const newPass = bcrypt.hashSync(pass, salt);
    return newPass;
}

const checkPass = (pass, newPass) => {
    return bcrypt.compareSync(pass, newPass);
}

module.exports = { getUser,hashPass,checkPass};