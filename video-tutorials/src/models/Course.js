const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        // maxlength: 60,
    },
    imageUrl: {
        type: String,
        required: true,
        // validate: [/^https?:\/\/.+/i, 'Invalid image url!'],
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: String,
        required: true,
    },
    usersEnrolled: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

courseSchema.method('getTenants', function() {
    return this.tenants.map(x => x.name).join(', ');
});

let Course = mongoose.model('Course', courseSchema);

module.exports = Course;