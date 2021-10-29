const Course = require('../models/Course');

exports.create = (courseData) => Course.create(courseData);

exports.getAll = () => Course.find().lean();

exports.getOne = (courseId) => Course.findById(courseId).populate('usersEnrolled');

// exports.getTopHouses = () => Course.find().sort({ createdAt: -1 }).limit(3).lean();

exports.addUsersEnrolled = async (courseId, userId) => {
    let course = await this.getOne(courseId);

    course.usersEnrolled.push(userId);

    return course.save();

    // return Housing.findOneAndUpdate(
    //     { _id: housingId },
    //     {
    //         $push: { tenants: userId },
    //         $inc: { availablePieces: -1 },
    //     },
    //     { runValidators: true }
    // );
}

// exports.delete = (housingId) => Housing.findByIdAndDelete(housingId);

// exports.edit = (housingId, data) => Housing.findByIdAndUpdate(housingId, data, { runValidators: true });

// exports.search = (searchedText) => Housing.find({ type: searchedText }).lean();
// exports.search = (searchedText) => Housing.find({ type: { $regex: searchedText, $options: 'i' } }).lean();