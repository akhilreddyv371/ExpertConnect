const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Student = require("../models/Student");
const sequelize = require("../config/database");
const Mentor = require("../models/Mentor");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post("/student/register", async (req, res) => {
  const { email, password, role } = req.body.user;
  const {
    name,
    area_of_interest,
    class_schedule,
    extra_activities,
    preferred_mentor,
  } = req.body.student;

  const transaction = await sequelize.transaction();

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create(
      {
        email: email,
        password: hashedPassword,
        role: role,
      },
      { transaction }
    );

    // Create the student and link it to the user
    const student = await Student.create(
      {
        name: name,
        email: email, // Optional: can be same or different
        area_of_interest: area_of_interest,
        class_schedule: class_schedule,
        extra_activities: extra_activities,
        preferred_mentor: preferred_mentor,
        // Associate the student with the user
        student_id: user.userId, // Set this if needed
      },
      { transaction }
    );

    // Optionally update the user with the student_id
    await user.update({ student_id: student.studentId }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: "User and student registered successfully",
      user: {
        email: user.email,
        role: user.role,
      },
      student: {
        name: student.name,
        area_of_interest: student.area_of_interest,
      },
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Handle errors
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

router.post("/mentor/register", async (req, res) => {
  const { email, password, role } = req.body.user;
  const { name, availability_schedule, expertise, back_to_back_preference } =
    req.body.mentor;
  const transaction = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      {
        email: email,
        password: hashedPassword,
        role: role,
      },
      { transaction }
    );

    const mentor = await Mentor.create(
      {
        name: name,
        email: email,
        availability_schedule: availability_schedule,
        expertise: expertise,
        back_to_back_preference: back_to_back_preference,
      },
      { transaction }
    );

    await user.update({ mentor_id: mentor.mentorId }, { transaction });
    await transaction.commit();
    res.status(201).json({
      user: {
        email: user.email,
        role: user.role,
      },
      mentor: {
        name: mentor.name,
        expertise: mentor.expertise,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log("Unable to register mentor ", error.message);
    res.send(500).json({ message: "Unable to register mentor" }, error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(500).json({ message: "User not found" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(400).json({ message: "Password not matched" });
  }
  const JSON_SECRET = process.env.JSON_SECRET;
  const token = jwt.sign(
    { userId: user.userId, role: user.role },
    "this is my secret",
    {
      expiresIn: "1h",
    }
  );
  res.status(200).json({ message: "Login Successful", token });
});

module.exports = router;
