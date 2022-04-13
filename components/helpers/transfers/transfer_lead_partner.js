let Unicredit = require('./partners/unicredit');
let Getcredit = require('./partners/getcredit');

module.exports = async function transferLead(lead, partner){

    let res = undefined;
    switch (partner){
        case 'unicredit':
            res =  await Unicredit(lead);
            break;
        case 'getcredit':
            res = await Getcredit(lead);
            break;

    }

    return res;
}