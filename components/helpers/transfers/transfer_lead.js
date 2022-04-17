let DataBase = require('../../DataBase');
let transfer_lead_partner = require('./transfer_lead_partner');

module.exports = async function(lead){
    let partner = await new DataBase('transfer_partners').DB_query('SELECT * FROM transfer_partners WHERE today_transfered < daily_limit ORDER BY priority DESC LIMIT 1');

    if (partner.length > 0){
        let res = await transfer_lead_partner(lead, partner[0].integration_name);

        if(res === 200){
            await new DataBase('leads').edit({
                id: lead.id,
                transfered: true
            });

            await new DataBase('leads_transfers').add({
                lead_id: lead.id,
                partner_id: partner[0].id,
            });

            await new DataBase('transfer_partners').edit({
                id: partner[0].id,
                today_transfered: partner[0].today_transfered + 1
            });
        }

    }else {

    }
}