import React, { Component } from 'react'
import { Drawer } from 'antd'
import BMap from 'BMap'
import echarts from 'echarts'
import './index.scss'
import 'echarts/extension/bmap/bmap.js'


let option = {

    
    tooltip: {
        trigger: 'item',
        formatter: function(e) {
            return e.data.name
        }
    },
    bmap: {
        center: [],
        zoom: 15,
        roam: true,
    },
    series: [
        {
            // name: 'pm2.5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            effectType: 'ripple',
            data: [],
            itemStyle: {
                normal: {
                    color: 'red'
                }
            }
        }
    ]
};

class Map extends Component {
    state = {
        visible: false,
        placement: 'left',
        address: '北京天安门',
        point: [],
    };

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        this.setState({
            visible: nextProps.visible,
            address: nextProps.address,
            name: nextProps.name
        })
    }
    componentDidUpdate() {
        // console.log('componentDidMount',this.refs['allmap']);
        let _this = this
        if (this.refs['allmap']) {
            let { BMap } = window
            let myChart = echarts.init(document.getElementById('allmap'))
            // console.log("option",option);
            myChart.setOption(option)
            // console.log(this.state.address);
            let address = this.state.address
            // console.log('bmap', BMap);
            // var map = new BMap.Map("allmap");
            // var point = new BMap.Point(116.331398, 39.897445);
            // map.centerAndZoom(point, 12);
            // map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            // map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(address, function (point) {
                if (point) {
                    let points = [point.lng,point.lat,20]
                    myChart.setOption({
                        series: {
                            data: [{
                                name: _this.state.name,
                                value: points
                            }]
                        },
                        bmap: {
                            center: points
                        }
                    })
                    // map.centerAndZoom(point, 16);
                    // map.addOverlay(new BMap.Marker(point));
                } else {
                    alert("您选择地址没有解析到结果!");
                }
            }, "北京市");
        }
    }
    onClose = () => {
        this.setState({
            visible: false,
        });
        this.props.onClose(false)
    };
    render() {
        return (
            <Drawer
                className='map-contain'
                title="地理位置"
                placement={this.state.placement}
                closable={true}
                onClose={this.onClose}
                visible={this.state.visible}
                width={"50vw"}
                maskClosable={false}
            >
                <div id="allmap" ref='allmap' className='allmap'></div>
            </Drawer>
        );
    }
}

export default Map;