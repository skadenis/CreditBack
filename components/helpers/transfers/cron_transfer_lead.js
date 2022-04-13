let DataBase = require('../../DataBase');
let asyncForEach = require('../../functions/asyncForEach');
let transfer_lead = require('./transfer_lead');

module.exports = async function transfer(){
    let leads_to_transfer = await new DataBase('leads').getBy('transfered', false);

    await asyncForEach(leads_to_transfer, async function(lead){
        await transfer_lead(lead);
    });
}