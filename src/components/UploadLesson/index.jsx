import React, { Component } from 'react'
import { Upload, Button, message } from "antd";
import { UploadOutlined } from '@ant-design/icons'
const MAX_VIDEO_SIZE = 1024 * 1024 * 8//8MB
export default class UploadLesson extends Component {

  // 视频上传之前调用，用于对上传的文件进行类型的限制
  beforeUpload = (file) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      if (file.size <= MAX_VIDEO_SIZE) {
        resolve(file)
      } else {
        reject('您上传的视频超出8MB')
        message.warning('视频大小不得超过8MB')
      }
    })
  }

  customRequest = () => {

  }

  render() {
    return (
      <Upload
        // action="https://www.baidu.com"//上传的地址，简单的而上传用来
        // method="post"//上传请求的方式
        accept="video/mp4"//对上传的文件进行类型的限制
        beforeUpload={this.beforeUpload}//视频上传之前调用
        customRequest={this.customRequest}//用于真正执行上传
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    )
  }
}
