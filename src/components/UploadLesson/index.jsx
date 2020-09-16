import React, { Component } from 'react'
import { Upload, Button, message } from "antd";
import { UploadOutlined } from '@ant-design/icons'
import * as qiniu from 'qiniu-js'
import { reqQiniuToken } from "@/api/upload";
const MAX_VIDEO_SIZE = 1024 * 1024 * 8//视频大小，限制为最大8MB
export default class UploadLesson extends Component {

  // 视频上传之前调用，用于对上传的文件进行类型的限制
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

  customRequest = async ({ file, onError, onProgress, onSuccess }) => {
    //  创建一个视频的监测者
    const observer = {
      next({ total }) {
        /*
          七牛在上传时，是一点一点上传的，每次传完一点，都会调用next方法，
          传入一个对象，对象中包含着-->文件总大小、已完成大小、完成的百分比
        */
        onProgress({ percent: total.percent })
      },
      error(err) {
        /*
          如果七牛上传视频中遇到一些问题，导致失败了，就会调error，且传入错误对象
        */
        onError()
        console.log('服务器记载了本次错误', err.message);
        message.error('上传失败，请联系管理员')
      },
      complete: (res) => {
        // 如果七牛最终上传成功，则调用complete
        onSuccess()
        this.props.onChange('http://qgoe62675.hn-bkt.clouddn.com/' + res.key)
        message.success('上传成功')
      }
    }
    const key = 'xiaoguoguo' + file.uid//交给七牛云时文件的名字
    const { uploadToken } = await reqQiniuToken()//上传的凭证
    const putExtra = {}
    const config = {}//region: qiniu.region.z1
    const observable = qiniu.upload(file, key, uploadToken, putExtra, config)
    observable.subscribe(observer) // 上传开始
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
        <Button icon={<UploadOutlined />}>点击上传</Button>
      </Upload>
    )
  }
}
