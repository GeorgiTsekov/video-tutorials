const router = require('express').Router();

const courseService = require('../services/courseService');
const { isAuth } = require('../middlewares/authMiddleware');


router.get('/', async (req, res) => {
    let courses = await courseService.getAll();

    res.render('course', { courses });
});

router.get('/create', isAuth, (req, res) => {
    res.render('course/create');
});

router.post('/create', isAuth, async (req, res) => {
    try {
        let { title, description, imageUrl, isPublic } = req.body;

        let creator = req.user._id;
        await courseService.create({ title, description, imageUrl, isPublic, creator });

        res.redirect('/');
    } catch (error) {
        res.render('course/create', { error: error.message })
    }
});

router.get('/:courseId/details', async (req, res) => {
    let course = await courseService.getOne(req.params.courseId);
    let courseData = await course.toObject();

    let isOwner = courseData.owner == req.user?._id;

    let tenants = course.getTenants();

    let isAvailable = course.availablePieces > 0;
    let isRented = course.tenants.some(x => x._id == req.user?._id);

    res.render('course/details', { ...courseData, isOwner, tenants, isAvailable, isRented });
});

router.get('/:courseId/rent', isOwner, async (req, res) => {
    await courseService.addTenant(req.params.courseId, req.user?._id);

    res.redirect(`/course/${req.params.courseId}/details`);
});

router.get('/:courseId/delete', isntOwner, async (req, res) => {
    await courseService.delete(req.params.courseId);

    res.redirect('/course');
});

router.get('/:courseId/edit', isntOwner, async (req, res) => {
    let course = await courseService.getOne(req.params.courseId);
    let courseData = await course.toObject();

    res.render('course/edit', { ...courseData });
});

router.post('/:courseId/edit', isntOwner, async (req, res) => {
    try {
        await courseService.edit(req.params.courseId, req.body);

        res.redirect(`/course/${req.params.courseId}/details`);
    }
    catch (error) {
        res.render('course/edit', { error: error.message });
    }
});

async function isOwner(req, res, next) {
    let course = await courseService.getOne(req.params.courseId);
    let courseData = await course.toObject();

    if (courseData.owner == req.user?._id) {
        res.redirect(`/course/${req.params.courseId}/details`);
    } else {
        next();
    }
}

async function isntOwner(req, res, next) {
    let course = await courseService.getOne(req.params.courseId);
    let courseData = await course.toObject();

    if (courseData.owner != req.user?._id) {
        res.redirect(`/course/${req.params.courseId}/details`);
    } else {
        next();
    }
}

module.exports = router;