import React, { Component } from 'react';
import { Button, Badge, Divider, Pagination, Modal, Input, message } from 'antd'
import axios from 'axios'
import './index.scss'
import Map from './../../components/Map/'
import Chat from './../../components/Chat/'
let { baseUrl } = require('../../config/index.js')



class Main extends Component {
    state = {
        pageNum: 12,
        currentPage: 1,
        chatVisible: false,
        nameVisible: false
    }
    componentWillMount() {
        this.list()
    }
    componentDidMount() {
        let name = window.sessionStorage.getItem('name')
        this.setState({
            name
        })
    }
    detialInfo = (url) => {
        window.open(url)
    }
    showPosition = (address, name) => {
        this.setState({
            address,
            name,
            visible: true
        })
    }
    onClose = (status) => {
        this.setState({
            visible: status
        })
    }
    chatClose = (status) => {
        this.setState({
            chatVisible: status
        })
    }
    list = (page) => {
        let url = baseUrl + '/list'
        let dom
        axios.get(url, {
            params: {
                page: page,
                pageNum: this.state.pageNum
            }
        }).then(data => {
            console.log(data.data);
            let result = data.data
            this.setState({
                totalNum: result.totalCount
            })
            dom = result.data.map(item => {
                return (
                    <div className="contain wrap" key={item._id}>
                        <div className="name">{item.name}</div>
                        <div className="size">{item.size}</div>
                        <div className="price">{item.price}</div>
                        <div className="unitPrice">{item.unitPrice}</div>
                        <div className="address">{item.address}</div>
                        <div className="operate">
                            <a href="javacript:void(0)">修改</a>
                            <Divider type="vertical"></Divider>
                            <a href="javacript:void(0)" onClick={this.showPosition.bind(this, item.address, item.name)}>查看地址</a>
                            <Divider type="vertical"></Divider>
                            <a href="javacript:void(0)" onClick={this.detialInfo.bind(this, item.detialUrl)}>详细信息</a>
                        </div>
                    </div>
                )
            })
            this.setState({ dom })
        })
        // return dom
    }
    getInfo = (page) => {
        this.list(page)
        this.setState({
            currentPage: page
        })
    }
    chat = () => {
        let name = window.sessionStorage.getItem('name')
        if (!name) {
            this.setState({
                nameVisible: true
            })
        } else {
            this.setState({
                chatVisible: true
            })
        }
    }
    handleOk = (e) => {
        // console.log(e);
        let name = this.refs.nameInput.input.value
        if (!name) {
            message.warning('你还没给自己起个名字类')
            return
        }
        this.setState({
            chatVisible: true,
            nameVisible: false,
            name
        });
        window.sessionStorage.setItem('name', name)
    }

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            nameVisible: false,
        });
    }
    render() {
        return (
            <div className='main'>
                <div className="top">
                    <Button type="primary" icon="plus">新增</Button>
                    <Badge count={99}>
                        <Button icon="usergroup-add" onClick={this.chat}>聊天室</Button>
                        {/* 给自己起个名字吧 */}
                        <Modal
                            title="给自己起个名字吧"
                            visible={this.state.nameVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <Input ref='nameInput'></Input>
                        </Modal>
                    </Badge>
                </div>
                <div className="list">
                    <div className="title wrap">
                        <div className="name">小区名</div>
                        <div className="size">大小</div>
                        <div className="price">价格</div>
                        <div className="unitPrice">单价</div>
                        <div className="address">地址</div>
                        <div className="operate">操作</div>
                    </div>
                    {/* 列表 */}
                    {this.state.dom}
                    {/* 地图组件 */}
                    <Map
                        visible={this.state.visible}
                        address={this.state.address}
                        name={this.state.name}
                        onClose={this.onClose}
                    ></Map>
                    {/* 聊天室组件 */}
                    <Chat
                        chatVisible={this.state.chatVisible}
                        chatClose={this.chatClose}
                        name={this.state.name}
                    />
                </div>
                <div className="page">
                    <Pagination onChange={this.getInfo} current={this.state.currentPage} pageSize={this.state.pageNum} total={this.state.totalNum} />
                </div>
            </div>
        );
    }
}

export default Main;