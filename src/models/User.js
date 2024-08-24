const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Student = require("./Student");
const Mentor = require("./Mentor");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "mentor"),
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "studentId",
    },
    allowNull: true,
  },
  mentor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Mentor,
      key: "mentorId",
    },
    allowNull: true,
  },
});

User.belongsTo(Student, { foreignKey: "student_id" });
User.belongsTo(Mentor, { foreignKey: "mentor_id" });

Student.hasOne(User, { foreignKey: "student_id" });
Mentor.hasOne(User, { foreignKey: "mentor_id" });

module.exports = User;
