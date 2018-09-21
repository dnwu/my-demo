const { InfoModel, chatModel } = require('./../../schema/info.js')

// 分页查询
module.exports.findByPage = (page, pageNum) => {
    return new Promise((resolve, reject) => {
        InfoModel.find().skip(pageNum * (page - 1)).limit(pageNum).exec(function (err, docs) {
            if (!err) resolve(docs)
            else reject(err)
        })
    })
}
// 获取列表总数
module.exports.findCount = () => {
    return new Promise((resolve, reject) => {
        InfoModel.find().count((err, count) => {
            if (!err) resolve(count)
            else reject(err)
        })
    })
}
// 获取聊天信息
module.exports.chat = () => {
    return new Promise((resolve, reject) => {
        chatModel.find((err, docs) => {
            if(!err) resolve(docs)
            else reject(err)
        })
    })
}

// 存儲聊天信息
module.exports.saveOne = (info) => {
    let infoObj  = {
        ...info,
        date:new Date()
    }
    return new Promise((resolve, reject) => {
        chatModel.insertMany(infoObj, (err, docs) => {
            if(!err) resolve(docs)
            else reject(err)
        })
    })
}