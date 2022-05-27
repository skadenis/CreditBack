let qs =  require('qs');
let axios = require('axios');

const https = require('https');

// At request level
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = async function transfer(info){
    let data = {
        fields: {
                NAME: '',
                SOURCE_ID: 2,
                PHONE: [
                    {
                        VALUE: info.phone,
                        VALUE_TYPE: 'WORK'
                    }]
            },
        params:{
            REGISTER_SONET_EVENT: 'Y'
        }
    };

    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: 'https://bitrix24.helpcredit.by/rest/17/gdejttx57edni0iq/crm.lead.add.json',
        httpsAgent: agent
    };

    let status = undefined;

    await axios(options)
        .then(async function (response) {
            console.log(response);
            status = 200;
        })
        .catch(async function (err) {
            console.log(err);
            status = 400;
        });

    return status;
}
