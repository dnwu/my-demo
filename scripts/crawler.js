const cheerio = require('cheerio')
const rp = require('request-promise')
const fs = require('fs')
let info = []

const sleep = time => new Promise(resolve => setTimeout(resolve, time))
// const sleep = time => new Promise(function(resolve,reject) {
//     setTimeout(() => {
//         resolve()
//     }, time);
// })

const getData = async (page) => {
    const options = {
        uri: `https://zhengzhou.anjuke.com/sale/guanchenga/p${page}/#filtersort`,
        transform: body => cheerio.load(body)
    }
    const $ = await rp(options)

    $('#houselist-mod-new .list-item').each((index, item) => {
        const name = $(item).find('.house-details .comm-address').attr('title')
        const size = $(item).find('.house-details .details-item').eq(0).find('span').eq(0).text()
        const area = $(item).find('.house-details .details-item').eq(0).find('span').eq(1).text()
        const detialUrl = $(item).find('.house-details .house-title a').attr('href')
        const unitPrice = $(item).find('.pro-price .unit-price').text()
        const price = $(item).find('.pro-price .price-det strong').text() + '万'

        info.push({
            name: name.match(/(\S*)\s+/)[1],
            address: name.match(/\s+(\S*)/)[1],
            size,
            area,
            detialUrl,
            unitPrice,
            price
        })
    })

    console.log(info.length);


}

const getTotalData = async () => {
    await getData(1)
    await sleep(5000)
    await getData(2)

    console.log(info.length);

    fs.writeFileSync('./database/json/info.json', JSON.stringify(info, null, 2), "utf8")
}


getTotalData()

exports.getData = getData
