const userRepository = require('../repository/users.repository');
const r = require('../utils/utils');
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const hashcg = (str, mode, hash) => {
    // Buat hash
    if(mode === 1) {
        return bcrypt.hashSync(str, salt);
    } else
    // Compare hash
    if (mode === 2) {
        return bcrypt.compareSync(str, hash);
    }
}

const isValid = (i) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*\d)(?=.*\W)[\w\W\d]{8,}$/;
    if(
        emailRegex.test(i.email) &&
        pwRegex.test(i.password)
        === 
        true
    ) 
    {return true;} 
    else 
    {return false;}
}

exports.registerUser = async (req, res) => {
    try {
        let info = req.query;
        if(!isValid(info)) {
            r.resp(res, false, 400, "Input is invalid.", null);
        } else {
            let temp = hashcg(info.password, 1, null);
            info.password = temp;
            const user = await userRepository.registerUser(info);
            if(user) {
                r.resp(res, true, 200, "User created successfully", user);
            } else {
                r.resp(res, false, 400, "Email already used", null);
            }
        }
    } catch (error) {
        r.resp(res, false, 500, "Error registering user", error);
    }
}

exports.loginUser = async(req, res) => {
    try {
        let info = req.query;
        let plaintext = info.password;
        const user = await userRepository.loginUser(info.email);
        if(!user) {
            r.resp(res, false, 400, "Incorrect password or email", null);
        } else {
            let hashpw = user.password;
            if(hashcg(plaintext, 2, hashpw) === true) {
                r.resp(res, true, 200, "Login successful", user);
            } else {
                r.resp(res, false, 400, "Incorrect password or email", null);
            }
        }
    } catch (error) {
        r.resp(res, false, 500, "Error logging in", error);
    }
}

exports.getEmail = async(req, res) => {
    if(!req.params.email) {
        return r.resp(res, false, 400, "Email is required", null);
    }
    
    try {
        const user = await userRepository.getEmail(req.params.email);
        if(user) {
            r.resp(res, true, 201, "User found", user);
        } else {
            r.resp(res, false, 404, "User not found", null)
        }
    } catch (error) {
        r.resp(res, false, 500, "Error retrieving user", error);
    }
}



exports.updateUser = async(req, res) => {
    if(!req.body.id || !req.body.username || !req.body.password || !req.body.email) {
        return r.resp(res, false, 400, "ID, name, password and email are required", null);
    }
    
    try {
        let info = req.body;
        if(!isValid(info)) {
            r.resp(res, false, 400, "Password is invalid.", null);
        } else {
            let temp = hashcg(info.password, 1, null);
            info.password = temp;
            const user = await userRepository.updateUser(info);
            if(user) {
                r.resp(res, true, 201, "User updated successfully", user);
            } else {
                r.resp(res, false, 404, "User not found", null)
            }
        }
    } catch (error) {
        r.resp(res, false, 500, "Error updating user", error);
    }
}




exports.deleteUser = async(req, res) => {
    if(!req.params.id) {
        return r.resp(res, false, 400, "User ID is required", null);
    }
    
    try {
        const user = await userRepository.deleteUser(req.params.id);
        if(user) {
            r.resp(res, true, 201, "User deleted successfully", user);
        } else {
            r.resp(res, false, 404, "Username not found or already exists", null)
        }
    } catch (error) {
        r.resp(res, false, 500, "Error deleting user", error);
    }
}


exports.topUpUser = async (req, res) => {
    try {
        if(req.query.amount <= 0) {
            r.resp(res, false, 400, "Amount must be larger than 0", null);
        } else {
            const user = await userRepository.topUpUser(req.query);
            if(user) {
                r.resp(res, true, 200, "User topped up successfully", user);
            } else {
                r.resp(res, false, 400, "User not found", null);
            }
        }
    } catch (error) {
        r.resp(res, false, 500, "Error topping user up", error);
    }
}
