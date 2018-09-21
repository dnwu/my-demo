const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const cros = require('koa2-cors')
const app = new Koa()
let port = process.env.PORT || 3003;

const { router } = require(path.join(__dirname, '../router/router.js'))


app.use(cros({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
app.use(bodyParser())

app.use(router.routes())

const server = require('http').Server(app.callback())
const io = require('socket.io')(server)


io.on('connection', function (socket) {
    console.log('socket 连接成功');
    socket.on('chat message', function (msg) {

        io.emit('chat message', msg);
    });
});
server.listen(port, () => {
    console.log('服务开启成功' + port);
})


