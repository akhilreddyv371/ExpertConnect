const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Student = require("./Student");
const Mentor = require("./Mentor");

const Booking = sequelize.define("Booking", {
  BookingId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: "studentId",
    },
  },
  mentor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Mentor,
      key: "mentorId",
    },
  },
  scheduled_start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  scheduled_end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  is_premium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  payment_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled"),
    defaultValue: "Pending",
  },
});

// Define associations
Student.hasMany(Booking, { foreignKey: "student_id" });
Mentor.hasMany(Booking, { foreignKey: "mentor_id" });
Booking.belongsTo(Student, { foreignKey: "student_id" });
Booking.belongsTo(Mentor, { foreignKey: "mentor_id" });

module.exports = Booking;
