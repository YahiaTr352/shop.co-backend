const User = require("../models/User");
const bcrypt = require("bcryptjs");

const DeleteUser = async(req,res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(400).json({message : "user is not found"});
        }

        await user.deleteOne();
        res.status(200).json("user deleted successfully");
    }catch(error){
        res.status(400).json({message : "something went wrong while deleting the user"});
    }
}

const EditUser = async (req, res) => {
    const { name, email, password, passwordC } = req.body;
    const updatedData = {};
    const errors = {};
  
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(400).json({ message: "user is not found" });
      }

      if (!name) errors.name = "name is required";
      if (!email) errors.email = "email is required";
      if (password && password !== passwordC)
        errors.passwordC = "passwords do not match";
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }

      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ email: "email is already registered" });
        }
      }

      if (name) updatedData.name = name;
      if (email) updatedData.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedData.password = hashedPassword;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "something went wrong while updating the user",
      });
    }
  };
  

const GetAllUsers = async(req,res) => {

    try{
        const users = await User.find({});
        res.status(200).json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({message : "something went wrong while getting all the users"});
    }
}

const GetUsersByRole = async (req, res) => {
  try {
    const users = await User.find({ role: "User" });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong." });
  }
};

const GetUser = async(req,res) => {
    
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(400).json({message : "user is not found"});
        }

        res.status(200).json(user);

    }catch(error){
        console.log(error);
        res.status(500).json({message : "something went wrong while getting the user"});
    }
}


module.exports = {
    DeleteUser,
    EditUser,
    GetAllUsers,
    GetUsersByRole,
    GetUser
}