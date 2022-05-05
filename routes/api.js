let express = require('express');
let router = express.Router();
let Policy = require('cors');

let DataBase = require('../components/DataBase/index');
let {GetSourceID} = require('../components/helpers')

/* GET home page. */
router.get('/', async function(req, res, next) {
    let yesterday = await new DataBase().DB_query('    SELECT source.name, count(*) FROM leads JOIN source on source.id = leads.source where to_char( now() - INTERVAL \'1 DAY\', \'YYYY-MM-DD\') = to_char(time, \'YYYY-MM-DD\') GROUP BY source.name;\n')
    let today = await new DataBase().DB_query('    SELECT source.name, count(*) FROM leads JOIN source on source.id = leads.source where to_char( now() - INTERVAL \'0 DAY\', \'YYYY-MM-DD\') = to_char(time, \'YYYY-MM-DD\') GROUP BY source.name;\n')

    res.json({
        yesterday: yesterday,
        today: today
    })
});

router.post('/add-lead', Policy(), async function(req, res, next) {
    await new DataBase('leads').add({
        phone: req.body.phone,
        utm: req.body.utm,
        region: req.body['6'],
        source: await GetSourceID(req.body.token)
    });

    res.json({status: 200}).status(200);
});

module.exports = router;
