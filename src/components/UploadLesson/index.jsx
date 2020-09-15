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
    /*
      onError:是上传给七牛云时出错的回调
      onProgress:进度
      onSuccess:是上传给七牛云成功的回调
    */
    /*
      file:要上传的文件
      key:string-文件资源名
      token:string-上传验证信息，前端通过接口请求后端获得
      putExtra:object-其中的每一项都为可选
        -fname --> string，文件原始文件名，若未指定，则魔法变量中无法使用 fname、ext、suffix
        -customVars --> object，用来放置自定义变量，变量名必须以 x: 开始，自定义变量格式及说明请参考文档
        -metadata --> object，用来防止自定义 meta，变量名必须以 x-qn-meta-开始，自定义资源信息格式及说明请参考文档
        -mimeType --> string，指定所传的文件类型
      config:object-其中的每一项都为可选
        -useCdnDomain --> 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
        -disableStatisticsReport --> 是否禁用日志报告，为布尔值，默认为 false。
        -uphost --> 上传 host，类型为 string， 如果设定该参数则优先使用该参数作为上传地址，默认为 null。
        -region --> 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域。
        -retryCount --> 上传自动重试次数（整体重试次数，而不是某个分片的重试次数）；默认 3 次（即上传失败后最多重试两次）。
        -concurrentRequestLimit --> 分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
        -checkByMD5 --> 是否开启 MD5 校验，为布尔值；在断点续传时，开启 MD5 校验会将已上传的分片与当前分片进行 MD5 值比对，若不一致，则重传该分片，避免使用错误的分片。读取分片内容并计算 MD5 需要花费一定的时间，因此会稍微增加断点续传时的耗时，默认为 false，不开启。
        -forceDirect --> 是否上传全部采用直传方式，为布尔值；为 true 时则上传方式全部为直传 form 方式，禁用断点续传，默认 false。
        -chunkSize --> number，分片上传时每片的大小，必须为正整数，单位为 MB，且最大不能超过 1024，默认值 4。因为 chunk 数最大 10000，所以如果文件以你所设的 chunkSize 进行分片并且 chunk 数超过 10000，我们会把你所设的 chunkSize 扩大二倍，如果仍不符合则继续扩大，直到符合条件。
    */
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
        // console.log(res);
        // console.log('http://qgoe62675.hn-bkt.clouddn.com/' + res.key);
        this.props.onChange('http://qgoe62675.hn-bkt.clouddn.com/' + res.key)
        message.success('上传成功')
      }
    }
    const key = 'xiaoguoguo' + file.uid//交给七牛云时文件的名字
    const { uploadToken } = await reqQiniuToken()//上传的凭证
    const putExtra = {}
    const config = {}//region: qiniu.region.z1
    const observable = qiniu.upload(file, key, uploadToken, putExtra, config)
    const subscription = observable.subscribe(observer) // 上传开始
    console.log('subscription@@@', subscription);
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
