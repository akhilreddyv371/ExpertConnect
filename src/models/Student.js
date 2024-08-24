const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Student = sequelize.define("Student", {
  studentId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  area_of_interest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class_schedule: {
    type: DataTypes.JSON,
  },
  extra_activities: {
    type: DataTypes.JSON,
  },
  preferred_mentor: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Student;
