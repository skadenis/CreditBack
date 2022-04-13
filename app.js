let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let {make_null_today_transfered} = require('./components/helpers');
let cron_transfer_lead = require('./components/helpers/transfers/cron_transfer_lead');


let cron = require('node-cron');
let cors = require('cors');

let apiRouter = require('./routes/api');

let app = express();

let corsOptions = {
    credentials: true,
};

app.options('*', cors(corsOptions))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



cron.schedule('*/1 * * * *', async function() {
    await cron_transfer_lead();
});

cron.schedule('0 0 * * *', async function() {
    await make_null_today_transfered();
});

app.use('/api', apiRouter);

module.exports = app;
