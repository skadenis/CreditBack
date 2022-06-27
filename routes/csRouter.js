let express = require('express');
let router = express.Router();
let Policy = require('cors');

let marketingReport = require('../components/creditSystems/marketingReport');

router.post('/marketing', Policy(), async function(req, res, next) {
    let data = await marketingReport(req.body.startDate, req.body.finishDate);
    res.json(data).status(200);
});

module.exports = router;
