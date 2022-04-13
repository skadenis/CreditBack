let qs =  require('qs');
let axios = require('axios');

const https = require('https');

// At request level
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = async function transfer(info){
    let data = {
        phone: info.phone,
    };

    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: 'http://api.getcredit.by/newlead/senddata.php?token=a4ede1f80de0dff39f271c263f344185',
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
