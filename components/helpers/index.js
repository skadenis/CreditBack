let DataBase = require('../DataBase/index');

async function GetSourceID(token){
    let info = await new DataBase('source').getBy('token', token);

    return info.length > 0 ? info[0].id : null;
}

async function make_null_today_transfered(){
    await new DataBase('transfer_partners').DB_query('UPDATE transfer_partners SET today_transfered = 0 WHERE true');
}

module.exports = {
    GetSourceID: GetSourceID,
    make_null_today_transfered: make_null_today_transfered
}