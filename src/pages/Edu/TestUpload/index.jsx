import React, { Component } from 'react'
import { Button, Upload, message } from "antd";
import * as qiniu from 'qiniu-js'
import { reqQiniuToken } from "@/api/upload";

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

  customRequest = async({file})=>{
    const key = '小果果'+Date.now()//交给七牛云时文件的名字
    const {uploadToken:token} = await reqQiniuToken()
    const putExtra = {}
    const config = {}
    const observable = qiniu.upload(file, key, token, putExtra, config)
    observable.subscribe()
  }

  render() {
    return (
      <Upload
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
      >
        <Button>点我上传一个文件</Button>
      </Upload>
    )
  }
}
