const Student = require("../models/Student");
const Booking = require("../models/Bookings");
const Mentor = require("../models/Mentor");
const express = require("express");
const { Op, fn, col } = require("sequelize");

const router = express.Router();

router.post("/:studentId/book", async (req, res) => {
  const { mentorID, scheduledStartTime, duration, area_of_interest } = req.body;
  const { studentId } = req.params;

  try {
    const student = await Student.findByPk(studentId);

    // Check whether student exists
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Calculate the end time based on duration
    const scheduledEndTime = new Date(
      new Date(scheduledStartTime).getTime() + duration * 60000
    );

    let payableAmount = 0;
    switch (duration) {
      case 30:
        payableAmount = 2000;
        break;
      case 45:
        payableAmount = 3000;
        break;
      case 60:
        payableAmount = 4000;
        break;
      default:
        return res.status(400).json({ message: "Invalid duration" });
    }

    // Premium service
    if (mentorID !== null) {
      payableAmount += 500;
    }

    let selectedMentorId = mentorID;
    if (!selectedMentorId) {
      const availableMentor = await Mentor.findOne({
        where: fn(
          "JSON_CONTAINS",
          col("expertise"),
          JSON.stringify([area_of_interest])
        ),
        include: [
          {
            model: Booking,
            required: false,
            where: {
              [Op.or]: [
                {
                  scheduled_start_time: {
                    [Op.between]: [scheduledStartTime, scheduledEndTime],
                  },
                },
                {
                  scheduled_end_time: {
                    [Op.between]: [scheduledStartTime, scheduledEndTime],
                  },
                },
              ],
            },
          },
        ],
      });

      if (!availableMentor) {
        return res.status(404).json({
          message: "No mentors are found for the selected area of interest",
        });
      }
      selectedMentorId = availableMentor.mentorId; // Assuming `mentorId` is the primary key of Mentor
    }

    const lastBooking = await Booking.findOne({
      where: { mentor_id: selectedMentorId },
      order: [["scheduled_end_time", "DESC"]],
    });

    if (lastBooking && lastBooking.scheduled_end_time > scheduledStartTime) {
      scheduledStartTime = lastBooking.scheduled_end_time;
      scheduledEndTime = new Date(
        new Date(scheduledStartTime).getTime() + duration * 60000
      );
    }

    const booking = await Booking.create({
      student_id: studentId,
      mentor_id: selectedMentorId,
      scheduled_start_time: scheduledStartTime,
      scheduled_end_time: scheduledEndTime,
      duration: duration,
      is_premium: Boolean(mentorID), // Assuming `is_premium` is a boolean
      payment_amount: payableAmount,
      status: "Pending",
    });

    // Send a success response
    res.status(201).json({
      message: "Booking created successfully",
      booking: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;
