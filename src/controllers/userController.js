const userServices = require('../services/userService');
const { createJWT } = require('../middleware/jwtActions');
const {setValue,getValue} = require('../config/redisConfig');

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
            const payload = {
                username: checkUser.username,
                isAdmin: checkUser.isAdmin,
                expressIn: "1h"
            };

            const jwt = createJWT(payload);

            res.cookie('jwt', jwt, { httpOnly: true }, {
                expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
            });

            return res.status(200).json({
                EC: 0,
                EM: "login success",
                DT: { user: checkUser, jwt: jwt }
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

const register = async (req, res) => {
    try {
        const checkUser = await userServices.getUser(req.body.username);
        if (checkUser) {
            return res.status(200).json({
                EC: 1,
                EM: "username have exits",
                DT: ''
            })
        }

        req.body.password = userServices.hashPass(req.body.password);
        const user = await userServices.createUser(req.body);

        return res.status(200).json({
            EC: user,
            EM: "register success",
            DT: ''
        })

    } catch (err) {
        return res.status(404).json({
            EC: -1,
            EM: err,
            DT: ''
        })
    }
}

const logout = async (req, res) => {
    if (req.cookies) {
        // Set token to none and expire after 1 seconds
        res.cookie('jwt', 'none', {
            expires: new Date(Date.now() + 1 * 1000),
            httpOnly: true,
        })
    }

    return res.status(200).json({
        EC: 0,
        EM: "Logout successful",
        DT: ''
    })
}

const getInformations = (req, res) => {
    if (req.user) {
        return res.status(200).json({
            EC: 0,
            EM: "",
            DT: req.user
        })
    }
    else {
        return res.status(200).json({
            EC: 1,
            EM: "Login please",
            DT: ''
        })
    }
}

const getAllUsers = async (req, res) => {

    // const data = await getValue("allUser"); 
    // if(data){
    //     return res.status(200).json({
    //         EC: 0,
    //         EM: "",
    //         DT: data
    //     })
    // }
    const users = await userServices.getAllUsers();
    //await setValue("allUser", users);
    return res.status(200).json({
        EC: 0,
        EM: "",
        DT: users
    })
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    const user = await userServices.getUserById(id);
    if (user.isAdmin) {
        return res.status(200).json({
            EC: 1,
            EM: "You can't delete this user",
            DT: ""
        })
    }
    await userServices.deleteUser(id);
    return res.status(200).json({
        EC: 0,
        EM: "Delete successfully",
        DT: ""
    })
}

const updateUser = async (req, res) => {
    await userServices.updateUser(req.body);
    return res.status(200).json({
        EC: 0,
        EM: "Update successful",
        DT: ""
    });
}

const getUserById = async (req, res) => {
    const user = await userServices.getUserById(req.params.id);
    if (user) {
        return res.status(200).json({
            EC: 0,
            EM: "",
            DT: user
        });
    }
    else {
        return res.status(200).json({
            EC: 1,
            EM: "User not found",
            DT: ""
        });
    }
}

module.exports = { login, register, logout, getInformations, getAllUsers, deleteUser, updateUser,getUserById };