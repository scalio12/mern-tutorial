const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Admin = require('../models/adminModel')

// @desc    Register Admin
// @route   POST /api/admin
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw Error("Please add all fields")
  } 

  //check if admin exist
  const adminExists = await Admin.findOne({ email })

  if (adminExists) {
    res.status(400);
    throw Error("Admin already exists")
  }

  //hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //create admin
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  if (admin) {
    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } else {
    res.status(400);
    throw Error("Invalid Admin data")
  }
})

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  //check for admin email
  const admin = await Admin.findOne({ email })

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    })
  } else {
    res.status(400);
    throw Error("Invalid credentials");
  }
})

// @desc    Get Admin data
// @route   GET /api/admin/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await Admin.findById(req.admin.id)

  res.status(200).json({
    id: __id,
    name,
    email
  })
}) 

    //generate JWT
    const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_ADMIN, {
        expiresIn: "30d",
        });
    };

  module.exports = {
    registerAdmin,
    loginAdmin,
    getMe
  }