let express = require('express');
let router = express.Router();
let Policy = require('cors');

let DataBase = require('../components/DataBase/index');
let {GetSourceID} = require('../components/helpers')

/* GET home page. */
router.get('/', async function(req, res, next) {
    let data = await new DataBase('leads').getAll();
    res.json(data);
});

router.post('/add-lead', Policy(), async function(req, res, next) {
    await new DataBase('leads').add({
        phone: req.body.phone,
        utm: req.body.utm,
        source: await GetSourceID(req.body.token)
    });

    res.json({status: 200}).status(200);
});

module.exports = router;
