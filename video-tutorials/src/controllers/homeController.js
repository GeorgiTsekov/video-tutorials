const router = require('express').Router();

const courseService = require('../services/courseService');

router.get('/', async (req, res) => {
    let course = await courseService.getAll();

    res.render('home', { course });
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