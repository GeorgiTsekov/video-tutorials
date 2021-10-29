const router = require('express').Router();

const courseService = require('../services/courseService');

router.get('/', async (req, res) => {
    console.log(courses);

    res.render('home', { courses });
});

// router.get('/search', async (req, res) => {
//     let searchedText = req.query?.text;
//     if (!searchedText) {
//         searchedText = '';
//     }
//     let housings = await housingService.search(searchedText);

//     res.render('search', { title: 'Search Housing', housings });
// });

module.exports = router;