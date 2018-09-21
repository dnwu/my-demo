const mongoose = require('mongoose')
const path = require('path')
const { resolve } = path
const { Schema } = mongoose

let url = 'mongodb://localhost/info'

mongoose.connect(url, { useNewUrlParser: true })

mongoose.connection.on('disconnected', () => {
    mongoose.connect(url, { useNewUrlParser: true })
})

let infoData = require(resolve(__dirname, '../json/info.json'))
let chatData = require(resolve(__dirname, '../json/chat.json'))

const infoSchema = new Schema({
    name: String,
    address: String,
    size: String,
    area: String,
    detialUrl: String,
    unitPrice: String,
    price: String
})
const chatSchema = new Schema({
    name: { type: String, default: '逍遥' },
    mes: { type: String, default: '欢迎您' },
    date: { type: Date, default: Date.now }
})
const InfoModel = mongoose.model('InfoModel', infoSchema)
const chatModel = mongoose.model('chatModel', chatSchema)
mongoose.connection.on('open', async () => {
    console.log('数据库连接成功');
    const infoList = await InfoModel.find({}).exec()
    const chatList = await chatModel.find({}).exec()

    if (!infoList.length) InfoModel.insertMany(infoData, () => {
        console.log('数据写入成功');
    })
    if (!chatList.length) chatModel.insertMany(chatData, (err) => {
        console.log('chatModel数据写入成功',err);
    })
})

module.exports.InfoModel = InfoModel
module.exports.chatModel = chatModel


