import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Registering User

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // hashin the password comming from front-end

    const salt = bcrypt.genSalt();
    const passwordHash = bcrypt.hash(password, salt);

    const newUser = new User({
      // this User is the model we created through mongoose
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    });

    // saving User along with sending the saved User in JSON fromat in responce to request
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // 201 status code means something is saved
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_STRING);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
