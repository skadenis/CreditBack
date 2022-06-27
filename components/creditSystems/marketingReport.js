'use strict';
let RP = require('request-promise');
let AsyncForEach = require('../functions/asyncForEach');

// Получение всех статусов в CRM системе
async function crm_status_list(){
    let options = {
        'method': 'POST',
        'url': 'https://bitrix24.newhc.by/rest/17/gdejttx57edni0iq/crm.status.list.json',
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': 'BITRIX_SM_SALE_UID=0'
        },
        body: JSON.stringify({
            "select": [
                "ID",
                "NAME"
            ],
            "order": {
                "SORT": "ASC"
            },
            "filter": {
                "ENTITY_ID": "STATUS"
            }
        })
    };

    let statuses = [];

    await RP(options, function (error, response) {
        if (error) throw new Error(error);
        statuses = JSON.parse(response.body).result;
    });

    let resStatus = [];
    await AsyncForEach(statuses, function (status){
        if(status.SEMANTICS === "S" || status.SEMANTICS === 'F'){
            resStatus.push(status);
        }
    })

    resStatus.push({
        "ID": "82",
        "ENTITY_ID": "STATUS",
        "STATUS_ID": "2",
        "NAME": "Встреча назначена",
        "NAME_INIT": "",
        "SORT": "90",
        "SYSTEM": "N",
        "COLOR": "#FFA900",
        "SEMANTICS": "",
        "CATEGORY_ID": "0",
        "EXTRA": {
            "SEMANTICS": "process",
            "COLOR": "#FFA900"
        }
    });
    resStatus.push({
        "ID": "83",
        "ENTITY_ID": "STATUS",
        "STATUS_ID": "3",
        "NAME": "Встреча подтверждена",
        "NAME_INIT": "",
        "SORT": "100",
        "SYSTEM": "N",
        "COLOR": "#FFF100",
        "SEMANTICS": "",
        "CATEGORY_ID": "0",
        "EXTRA": {
            "SEMANTICS": "process",
            "COLOR": "#FFF100"
        }
    });
    resStatus.push({
        "ID": "84",
        "ENTITY_ID": "STATUS",
        "STATUS_ID": "4",
        "NAME": "Был в офисе",
        "NAME_INIT": "",
        "SORT": "110",
        "SYSTEM": "N",
        "COLOR": "#C6DF9C",
        "SEMANTICS": "",
        "CATEGORY_ID": "0",
        "EXTRA": {
            "SEMANTICS": "process",
            "COLOR": "#C6DF9C"
        }
    });

    return resStatus;
}
// Получение всех источников трафика
async function crm_status_list_source(){

    let options = {
        'method': 'POST',
        'url': 'https://bitrix24.newhc.by/rest/17/gdejttx57edni0iq/crm.status.list.json',
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': 'BITRIX_SM_SALE_UID=0'
        },
        body: JSON.stringify({
            "order": {
                "SORT": "ASC"
            },
            "filter": {
                "ENTITY_ID": "SOURCE",
                "SYSTEM": "N",
            }
        })
    };

    let sources = [];

    await RP(options, function (error, response) {
        if (error) throw new Error(error);
        sources = JSON.parse(response.body).result;
    });

    let resSource = [];
    await AsyncForEach(sources, function (source){
        console.log(source);
        if(Number(source.ID) > 100){
            resSource.push(source);
        }
    })

    return resSource;
}
// Получение общей информации по источнику
async function getLeadsCount(SOURCE_ID, STATUS_ID, START, FINISH){

    let options = {
        'method': 'POST',
        'url': 'https://bitrix24.newhc.by/rest/17/gdejttx57edni0iq/crm.lead.list.json',
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': 'BITRIX_SM_SALE_UID=0'
        },
        body: JSON.stringify({
            "FILTER": {
                ">DATE_CREATE": START,
                "<DATE_CREATE": FINISH,
                "SOURCE_ID": SOURCE_ID,
                "STATUS_ID": STATUS_ID
            },
            "SELECT": [
                "ID",
                "DATE_CREATE",
                "STATUS_ID",
                "TITLE"
            ]
        })
    };

    let total = 0;

    await RP(options, function (error, response) {
        if (error) throw new Error(error);
        total = JSON.parse(response.body).total;
    });

    return total;
}
//Получение общего кол-во лидов
async function getLeadsAllCount(SOURCE_ID, START, FINISH){

    let options = {
        'method': 'POST',
        'url': 'https://bitrix24.newhc.by/rest/17/gdejttx57edni0iq/crm.lead.list.json',
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': 'BITRIX_SM_SALE_UID=0'
        },
        body: JSON.stringify({
            "FILTER": {
                ">DATE_CREATE": START,
                "<DATE_CREATE": FINISH,
                "SOURCE_ID": SOURCE_ID,
            },
            "SELECT": [
                "ID",
                "DATE_CREATE",
                "STATUS_ID",
                "TITLE"
            ]
        })
    };

    let total = 0;

    await RP(options, function (error, response) {
        if (error) throw new Error(error);
        total = JSON.parse(response.body).total;
    });

    console.log(total);

    return total;
}

// Заропс на отчет
async function make_report(start, finish){
    let statuses = await crm_status_list();
    let sources = await crm_status_list_source();

    let report = {};
    report.statuses = statuses;
    report.content = [];
    await AsyncForEach(sources, async function(source, sourceKey){

        report.content.push({name: source.NAME, statuses:{}, leads: await getLeadsAllCount(source.STATUS_ID, start, finish)})
        await AsyncForEach(statuses, async function(status, statusKey){
            report.content[sourceKey].statuses[statusKey] = await getLeadsCount(source.STATUS_ID, status.STATUS_ID, start, finish);

        });
    });

    return report;
}

module.exports = async function make_PDF_repost(start, finish){
    let data = await make_report(start, finish);
    let dd = {
        pageSize: 'A2',
        pageOrientation: 'landscape',
        content: [
            {
                table: {
                    widths: [],
                    body: [[]]
                }
            }
        ]
    }

    dd.content[0].table.widths.push('*');
    dd.content[0].table.widths.push(60);
    dd.content[0].table.body[0].push({text:"Источник", fillColor: '#fff'});
    dd.content[0].table.body[0].push({text:"Лидов", fillColor: '#ffb85c'});

    await AsyncForEach(data.statuses, async function(status){
        dd.content[0].table.widths.push(60);
        dd.content[0].table.body[0].push({text: status.NAME, fillColor: status.COLOR});
    });

    await AsyncForEach(data.content, async function(partner, pKey){
        dd.content[0].table.body.push([]);
        dd.content[0].table.body[pKey+1].push(partner.name);
        dd.content[0].table.body[pKey+1].push({text:partner.leads, fillColor: '#ffb85c'});
        await AsyncForEach(data.statuses, async function(status,sKey){
            dd.content[0].table.body[pKey+1].push({text: partner.statuses[sKey], fillColor: status.COLOR, fillOpacity: 0.5});
        });
    })


    return dd;
}


