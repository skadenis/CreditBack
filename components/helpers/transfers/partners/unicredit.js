let qs =  require('qs');
let axios = require('axios');

const https = require('https');

// At request level
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = async function transfer(info){
    let data = {
        secret: '*JHrLR27PDfrvgmzZpAaicR@',
        method: 'crm.lead.add',
        fields: {
            fields: {
                NAME: '',
                LAST_NAME: '',
                SOURCE_ID: '31',
                PHONE: [
                    {
                        VALUE: info.phone,
                        VALUE_TYPE: 'WORK'
                    }]
            },
            VALUE_TYPE: 'WORK'
        }
    };

    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: 'https://api.unicredit.by/',
        httpsAgent: agent
    };

    let status = undefined;

    await axios(options)
        .then(async function (response) {
            status = 200;
        })
        .catch(async function (err) {
            console.log(err);
            status = 400;
        });

    return status;
}
