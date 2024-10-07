const userModel = require('../user/user.model');
const bcrypt = require('bcrypt');
const Utils = require('../utils')
const utils = new Utils();


exports.signUp = async (req, res) => {
    const SALT_ROUND = 10;
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.getUserByEmail(email);
    if(!utils.isCorrectEmail(email))
        return res.status(409).send('Email  phải là của trường HCMUE');
    if (user.length !== 0)
        return res.status(409).send('Email đã được đăng ký');
    else{
        const hashPassword =  await bcrypt.hashSync(password, SALT_ROUND);
        const user = {
            email: email,
            password: hashPassword,
            surname: req.body.surname,
            givenName: req.body.givenName,
            birthday: req.body.birthday,
            gender: req.body.gender 
        }
        const isCreatedUser = await userModel.createUser(user);
        if(isCreatedUser)
            return res.status(201).send('User đã được tạo');
        else
            return res.status(400).send('Có lỗi khi tạo user');
    }
}