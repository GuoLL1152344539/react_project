import React, { Component } from 'react'
import { Card, Button, Table, Modal } from "antd";
import { PlusOutlined, FullscreenOutlined, PlusCircleOutlined, FormOutlined, DeleteOutlined, EyeOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import Pubsub from 'pubsub-js'
import { reqAllLessonListByCourseId } from "@/api/edu/lesson";
import { withRouter } from "react-router-dom";
import { Player } from 'video-react';
// 引入全屏
import screenfull from "screenfull";

import 'video-react/dist/video-react.css'
import './index.less'

@withRouter
class List extends Component {

  state = {
    chapterList: [],
    visible: false,
    lessonTitle: '',//当前正在预览课程的名称
    url: '',
    isFull: false,//标识是否全屏
  }

  // 表格项展开的回调
  handleExpand = async (isExpanded, record) => {
    if (isExpanded) {
      const lessonList = await reqAllLessonListByCourseId(record._id)
      const chapterList = this.state.chapterList.map((chapter) => {
        if (chapter._id === record._id) {
          chapter.children = lessonList
        }
        return chapter
      })
      this.setState({ chapterList })
    }
  }

  showModal = (data) => {
    return () => {
      // console.log('data.video---',data.video);
      this.setState({ visible: true, lessonTitle: data.title, url: data.video })
      // console.log('url----',this.state.url);
    }
  }

  // 弹窗中取消按钮的回调
  handleCancel = e => {
    // console.log(e.target);
    this.setState({
      visible: false,
    });
  }

  // 全屏/退出全屏按钮的回调
  switchFullScreen = () => {
    // console.log('你要全屏');
    // screenfull.request()
    // screenfull.toggle(this.refs.lesson_list)
    screenfull.toggle()
  }

  componentDidMount() {
    // 组件挂载完毕，订阅消息，用于接收search组件的搜索结果
    this.msg_id = Pubsub.subscribe('chapter_list', (_, data) => {
      const items = data.items.map(chapter => ({ ...chapter, children: [] }))
      // 获取结果后，存储到自身状态，供table组件读取使用
      this.setState({ chapterList: items })
    })
    // 监测浏览器全屏的变化
    screenfull.on('change', () => {
      const { isFull } = this.state
      this.setState({ isFull: !isFull })
    })
  }

  componentWillUnmount() {
    // 组件卸载前，取消订阅
    Pubsub.unsubscribe(this.msg_id)
  }

  render() {
    
    const { chapterList, url, visible, lessonTitle, isFull } = this.state
    // 表格的列配置
    const columns = [
      {
        title: '章节名称',
        dataIndex: 'title',
      },
      {
        title: '是否免费',
        // dataIndex:'free',
        render: (data) => ('free' in data ? data.free ? '是' : '否' : null)
      },
      {
        title: '视频',
        render: (data) => ('video' in data ? <Button onClick={this.showModal(data)} className="link_btn" icon={<EyeOutlined />} /> : null)
      },
      {
        title: '操作',
        render: (data) => (
          <>
            {
              'free' in data ?
                <>
                  <Button className="mar_left_btn" type="primary" icon={<FormOutlined />} />
                  <Button className="mar_left2_btn" type="danger" icon={<DeleteOutlined />} />
                </> :
                <>
                  <Button
                    onClick={() => { this.props.history.push('/edu/chapter/addlesson', { id: data._id }) }}
                    className="mar_right_btn"
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  />
                  <Button className="mar_right_btn" type="primary" icon={<FormOutlined />} />
                  <Button type="danger" icon={<DeleteOutlined />} />
                </>
            }
          </>
        )
      },
    ];
    return (
      <>
        {/* 章节列表 */}
        <div ref="lesson_list" style={{backgroundColor:'white'}}>
          <Card
            title="章节列表"
            extra={
              <>
                <Button type="primary" className="mar_right_btn" icon={<PlusOutlined />}>新增章节</Button>
                <Button type="danger">批量删除</Button>
                <Button onClick={this.switchFullScreen} type="text" className="link_btn" icon={isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />} />
              </>
            }
          >
            <Table
              dataSource={chapterList}
              columns={columns}
              rowKey="_id"
              expandable={{
                onExpand: this.handleExpand
              }}
            />
          </Card>
        </div>
        {/* 预览课时弹窗 */}
        <Modal
          title={lessonTitle} // 弹窗的标题
          visible={visible} // 弹窗是否展示
          // onOk={this.handleOk} // 确定按钮的回调
          onCancel={this.handleCancel} // 取消按钮的回调
          footer={null}
          destroyOnClose
        >
          <Player>
            <source src={url} />
          </Player>
        </Modal>
      </>
    )
  }
}

export default List
