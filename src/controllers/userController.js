const userServices = require('../services/userService');

const login = async (req, res) => {
    try {
        const checkUser = await userServices.getUser(req.body.username);
        if (!checkUser) {
            return res.status(200).json({
                EC: 1,
                EM: "username or password not right",
                DT: ''
            })
        }

        const checkPass = userServices.checkPass(req.body.password, checkUser.password);
        if (checkPass) {
            return res.status(200).json({
                EC: 0,
                EM: "login success",
                DT: checkUser
            })
        }

        return res.status(200).json({
            EC: 1,
            EM: "username or password not right",
            DT: ''
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            EC: -1,
            EM: err,
            DT: ''
        })
    }
}

module.exports = {login};