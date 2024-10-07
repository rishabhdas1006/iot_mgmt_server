const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const Lecture = require("../models/lectureModel");

const formatDate = (data) => {
	const date = new Date(Date.parse(data)).toLocaleDateString("en-GB");
	return date;
};

const getLecturesTeacher = asyncHandler(async (req, res) => {
	if (req.user.role != "teacher") {
		res.status(401);
		throw new Error("Not authorised");
	}
	const { date } = req.body;

	const lectures = await Lecture.find({
		date: formatDate(date),
		teacher: req.user._id,
	}).sort("-createdAt");
	if (lectures.length > 0) res.status(200).json(lectures);
	else res.status(200).json([]);
});

const getLecturesStudent = asyncHandler(async (req, res) => {
	if (req.user.role != "student") {
		res.status(401);
		throw new Error("Not authorised");
	}

	const { date } = req.body;

	const lectures = await Lecture.find({
		date: formatDate(date),
		presentStudents: req.user._id,
	}).sort("-createdAt");
	res.status(200).json(lectures);
});

module.exports = {
	getLecturesTeacher,
	getLecturesStudent,
};
