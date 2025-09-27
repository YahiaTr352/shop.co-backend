const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateSignUp, validateLogin } = require("../utils/validation");

const SignupUser = async(req,res) => {
    const {name , email , password , passwordC} = req.body;

    const errors = validateSignUp({name , email , password , passwordC});
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    try{
    
    const existingEmail = await User.findOne({email});

    if(existingEmail) {
       return res.status(400).json({email : "email is registerd"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password , salt);

        const user = new User({
            name,
            email,
            password : hashedPassword,
            role : "User"
        })

        await user.save();    
        const token = jwt.sign({Id : user._id , role : user.role} , process.env.TOKEN_SECRET_KEY);

        res.status(200).json({user , token});
        
    }catch(error){
         console.log(error);
         res.status(500).json({message : "something went wrong."});
    }
   
}

const SignupAdmin = async (req, res) => {
    const { name, email, password, passwordC } = req.body;

    const errors = validateSignUp({name , email , password , passwordC});
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    try {
        const existingName = await User.findOne({ name });
        const existingEmail = await User.findOne({ email });

        if (existingName) {
            return res.status(400).json({ name: "Name is used" });
        }

        if (existingEmail) {
            return res.status(400).json({ email: "Email is used" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "Admin"
        });

        await newUser.save();

        console.log("Admin Created:", newUser);

        const token = jwt.sign({ Id: newUser._id, role: newUser.role }, process.env.TOKEN_SECRET_KEY);
        res.status(200).json({ user: newUser, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong while signing up" });
    }
};


const LoginUser = async(req,res) => {
    const {email , password} = req.body;
    const errors = validateLogin({email , password});

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    try{
    const user = await User.findOne({email});
    
    if(!user){
       return res.status(400).json({password : "Invaild email or password"});
    }

    const isVaildPassword = await bcrypt.compare(password , user.password);

    if(!isVaildPassword){
        return res.status(400).json({password : "Invaild email or password"});
    }

    const token = jwt.sign({Id : user._id , role : user.role} , process.env.TOKEN_SECRET_KEY);
    res.status(200).json({user , token});
}catch(error){
    res.status(500).json({message : "something went wrong."});
}

}

const LoginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const errors = validateLogin({email , password});

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    try {
        const existingEmail = await User.findOne({ email });

        if (!existingEmail) {
            // console.log(existingEmail);
            return res.status(400).json({ password: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, existingEmail.password);

        if (!existingEmail || !isValidPassword) {
            return res.status(400).json({ password: "Invalid email or password" });
        }

        const token = jwt.sign(
            { Id: existingEmail._id, role: existingEmail.role },
            process.env.TOKEN_SECRET_KEY
        );

        res.status(200).json({ user: existingEmail, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while logging in" });
    }
};


module.exports = {
    SignupUser,
    LoginUser,
    SignupAdmin,
    LoginAdmin
}