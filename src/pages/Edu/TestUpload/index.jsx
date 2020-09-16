import React, { Component } from 'react'
import { Button, Upload, message } from "antd";
import * as qiniu from 'qiniu-js'
import { reqQiniuToken } from "@/api/upload";
import ReactEcharts from 'echarts-for-react';

const MAX_VIDEO_SIZE = 1024 * 1024 * 8//视频大小，限制为最大8MB
export default class TestUpload extends Component {

  beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size <= MAX_VIDEO_SIZE) {
        resolve(file)
      } else {
        reject('您上传的视频超出8MB')
        message.warning('视频大小不得超过8MB')
      }
    })
  }

  customRequest = async ({ file }) => {
    const key = '小果果' + Date.now()//交给七牛云时文件的名字
    const { uploadToken: token } = await reqQiniuToken()
    const putExtra = {}
    const config = {}
    const observable = qiniu.upload(file, key, token, putExtra, config)
    observable.subscribe()
  }

  initBarChart = () => {
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(220, 220, 220, 0.8)'
        }
      }]
    }
  }

  initPieChart = () => ({
    // 标题
    title: {
      text: '多雷达图'//主标题文字
    },
    // 提示框组件
    tooltip: {
      // trigger: 'axis'
      trigger: 'item'
    },
    legend: {
      left: 'center',
      data: ['某软件', '某主食手机', '某水果手机', '降水量', '蒸发量']
    },
    radar: [
      {
        indicator: [
          { text: '品牌', max: 100 },
          { text: '内容', max: 100 },
          { text: '可用性', max: 100 },
          { text: '功能', max: 100 }
        ],
        center: ['25%', '40%'],
        radius: 80
      },
      {
        indicator: [
          { text: '外观', max: 100 },
          { text: '拍照', max: 100 },
          { text: '系统', max: 100 },
          { text: '性能', max: 100 },
          { text: '屏幕', max: 100 }
        ],
        radius: 80,
        center: ['50%', '60%'],
      },
      {
        indicator: (function () {
          var res = [];
          for (var i = 1; i <= 12; i++) {
            res.push({ text: i + '月', max: 100 });
          }
          return res;
        })(),
        center: ['75%', '40%'],
        radius: 80
      }
    ],
    series: [
      {
        type: 'radar',
        tooltip: {
          trigger: 'item'
        },
        areaStyle: {},
        data: [
          {
            value: [60, 73, 85, 40],
            name: '某软件'
          }
        ]
      },
      {
        type: 'radar',
        radarIndex: 1,
        areaStyle: {},
        data: [
          {
            value: [85, 90, 90, 95, 95],
            name: '某主食手机'
          },
          {
            value: [95, 80, 95, 90, 93],
            name: '某水果手机'
          }
        ]
      },
      {
        type: 'radar',
        radarIndex: 2,
        areaStyle: {},
        data: [
          {
            name: '降水量',
            value: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 75.6, 82.2, 48.7, 18.8, 6.0, 2.3],
          },
          {
            name: '蒸发量',
            value: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 35.6, 62.2, 32.6, 20.0, 6.4, 3.3]
          }
        ]
      }
    ]
  })

  render() {
    return (
      <>
        <Upload
          beforeUpload={this.beforeUpload}
          customRequest={this.customRequest}
        >
          <Button>点我上传一个文件</Button>
        </Upload>
        <ReactEcharts option={this.initBarChart()} />
        <ReactEcharts option={this.initPieChart()} />
      </>
    )
  }
}
