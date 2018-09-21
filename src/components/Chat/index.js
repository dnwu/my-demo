import React, { Component } from 'react';
import { Drawer, Button } from 'antd'
import axios from 'axios'
import io from 'socket.io-client'
import './index.scss'
let { baseUrl } = require('../../config/index.js')

const socket = io(baseUrl);
console.log(socket);
class Chat extends Component {
    state = {
        userName: '',
        list: [],
        listDOM: []
    }
    async componentDidMount() {
        let url = baseUrl + '/chat'
        let data = await axios.get(url)
        this.setState({
            list: data.data.data
        }, () => {
            this.list(this.state.list)
        })

        // this.scrollBottom()
        let _this = this
        socket.on('chat message', function (msg) {
            let list = _this.state.list
            list.push(msg)
            _this.list(list)
            _this.scrollBottom()
        });


    }

    componentWillReceiveProps(props) {
        // console.log(props);
        this.setState({
            chatVisible: props.chatVisible,
            userName: props.name
        })
    }

    scrollBottom = () => {
        let anchorDOM = this.refs.anchor
        if (!anchorDOM) return
        anchorDOM.click()
    }
    list = (data) => {

        let listDOM = data.map((item, index) => {
            if (item.name === this.state.userName) {
                return (
                    <div className="req" key={index}>
                        <div className="avatar">
                            <div className="img">

                            </div>
                            <div className="name">{item.name}</div>
                        </div>
                        <div className="mes">{item.mes}</div>
                    </div>
                )
            } else {
                return (
                    <div className="res" key={index}>
                        <div className="avatar">
                            <div className="img">

                            </div>
                            <div className="name">{item.name}</div>
                        </div>
                        <div className="mes">{item.mes}</div>
                    </div>
                )
            }
        })
        this.setState({
            listDOM
        })
    }
    onClose = () => {
        this.setState({
            chatVisible: false,
            placement: 'right',
        });
        this.props.chatClose(false)
    };
    sendMes = () => {
        let mes = this.refs.textarea.value
        let name = window.sessionStorage.getItem('name')
        if (!mes || !name) return
        let _this = this
        let info = {
            name: name,
            mes: mes
        }

        let url = baseUrl + '/send-mes'
        axios.post(url, info).then(data => {
            _this.refs.textarea.value = ''
            socket.emit('chat message', info)
        })





    }
    render() {
        return (
            <Drawer
                className='chat-contain'
                title="聊天室"
                placement={this.state.placement}
                closable={true}
                onClose={this.onClose}
                visible={this.state.chatVisible}
                width={"50vw"}
                maskClosable={false}
            >
                <div className="contain" ref='contain'>
                    <a href="#bottom" ref='anchor' className='anchor'></a>
                    <div className="scroll" ref='scoll'>
                        {this.state.listDOM}
                        <a name='bottom' href="#"></a>
                    </div>
                </div>
                <div className="text">
                    <textarea ref='textarea' name="mes" id="" rows="3"></textarea>
                </div>
                <div className="btn">
                    <Button onClick={this.sendMes} type='primary'>发送</Button>
                </div>
            </Drawer>
        );
    }
}

export default Chat;