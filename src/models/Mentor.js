const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Mentor = sequelize.define("Mentor", {
  mentorId: {
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
  availability_schedule: {
    type: DataTypes.JSON,
  },
  expertise: {
    type: DataTypes.JSON,
    allowNull:true
  },
  back_to_back_preference: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Mentor;
