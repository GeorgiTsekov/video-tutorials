const router = require('express').Router();

const housingService = require('../services/housingService');
const { isAuth } = require('../middlewares/authMiddleware');


router.get('/', async (req, res) => {
    let housings = await housingService.getAll();

    res.render('housing', { housings });
});

router.get('/create', isAuth, (req, res) => {
    res.render('housing/create');
});

router.post('/create', isAuth, async (req, res) => {
    try {
        let { name, type, year, city, image, description, availablePieces } = req.body;

        let owner = req.user._id;
        await housingService.create({ name, type, year, city, image, description, availablePieces, owner });

        res.redirect('/housing');
    } catch (error) {
        res.render('housing/create', { error: error.message })
    }
});

router.get('/:housingId/details', async (req, res) => {
    let housing = await housingService.getOne(req.params.housingId);
    let housingData = await housing.toObject();

    let isOwner = housingData.owner == req.user?._id;

    let tenants = housing.getTenants();

    let isAvailable = housing.availablePieces > 0;
    let isRented = housing.tenants.some(x => x._id == req.user?._id);

    res.render('housing/details', { ...housingData, isOwner, tenants, isAvailable, isRented });
});

router.get('/:housingId/rent', isOwner, async (req, res) => {
    await housingService.addTenant(req.params.housingId, req.user?._id);

    res.redirect(`/housing/${req.params.housingId}/details`);
});

router.get('/:housingId/delete', isntOwner, async (req, res) => {
    await housingService.delete(req.params.housingId);

    res.redirect('/housing');
});

router.get('/:housingId/edit', isntOwner, async (req, res) => {
    let housing = await housingService.getOne(req.params.housingId);
    let housingData = await housing.toObject();

    res.render('housing/edit', { ...housingData });
});

router.post('/:housingId/edit', isntOwner, async (req, res) => {
    try {
        await housingService.edit(req.params.housingId, req.body);

        res.redirect(`/housing/${req.params.housingId}/details`);
    }
    catch (error) {
        res.render('housing/edit', { error: error.message });
    }
});

async function isOwner(req, res, next) {
    let housing = await housingService.getOne(req.params.housingId);
    let housingData = await housing.toObject();

    if (housingData.owner == req.user?._id) {
        res.redirect(`/housing/${req.params.housingId}/details`);
    } else {
        next();
    }
}

async function isntOwner(req, res, next) {
    let housing = await housingService.getOne(req.params.housingId);
    let housingData = await housing.toObject();

    if (housingData.owner != req.user?._id) {
        res.redirect(`/housing/${req.params.housingId}/details`);
    } else {
        next();
    }
}

module.exports = router;