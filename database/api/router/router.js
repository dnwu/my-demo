const Koa = require('koa')
const Router = require('koa-router')
const api = require('../tools/mongodb.js')
const router = new Router()

router.get('/list',async (ctx,next) => {
    // console.log(ctx.query);
    let page = parseInt(ctx.query.page) || 1
    let pageNum = parseInt(ctx.query.pageNum) || 10
    let data = await api.findByPage(page,pageNum)
    let totalCount = await api.findCount()
    ctx.body = {
        status: 200,
        data,
        totalCount
    }
})

router.get('/chat', async (ctx,next) => {
    let data = await api.chat()
    ctx.body = {
        status: 200,
        data
    }
})

router.post('/send-mes', async (ctx, next) => {
    let infoObj = ctx.request.body
    let data = await api.saveOne(infoObj)
    ctx.body = {
        status: 200,
        data: data
    }
})

module.exports.router = router