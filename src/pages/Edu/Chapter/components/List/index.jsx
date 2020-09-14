import React, { Component } from 'react'
import { Card, Button, Table } from "antd";
import { PlusOutlined, FullscreenOutlined, PlusCircleOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import Pubsub from 'pubsub-js'
import { reqAllLessonListByCourseId } from "@/api/edu/lesson";
import { withRouter } from "react-router-dom";
import './index.less'

@withRouter
class List extends Component {

  state={
    chapterList:[]
  }

  handleExpand = async (isExpanded, record)=>{
    if (isExpanded) {
      const lessonList = await reqAllLessonListByCourseId(record._id)
      const chapterList = this.state.chapterList.map((chapter)=>{
        if (chapter._id === record._id) {
          chapter.children = lessonList
        }
        return chapter
      })
      this.setState({chapterList})
    }
  }

  componentDidMount(){
    // 组件挂载完毕，订阅消息，用于接收search组件的搜索结果
    this.msg_id = Pubsub.subscribe('chapter_list', (_, data)=>{
      const items = data.items.map(chapter=> ({...chapter,children:[]}))
      // 获取结果后，存储到自身状态，供table组件读取使用
      this.setState({chapterList:items})
    })
  }

  componentWillUnmount(){
    // 组件卸载前，取消订阅
    Pubsub.unsubscribe(this.msg_id)
  }

  render() {
    const {chapterList} = this.state
    // 表格的列配置
    const columns = [
      {
        title: '章节名称',
        dataIndex:'title',
      },
      {
        title: '是否免费',
      },
      {
        title: '视频',
      },
      {
        title: '操作',
        render:(data)=>(
          <>
            {
              'free' in data ? null:
              <Button 
                onClick={()=>{this.props.history.push('/edu/chapter/addlesson', {id:data._id})}} 
                className="mar_right_btn" 
                type="primary" 
                icon={<PlusCircleOutlined/>} 
              />
            }
            <Button className="mar_right_btn" type="primary" icon={<FormOutlined/>} />
            <Button type="danger" icon={<DeleteOutlined/>} />
          </>
        )
      },
    ];
    return (
      <Card
        title="章节列表"
        extra={
          <>
            <Button type="primary" className="mar_right_btn" icon={<PlusOutlined />}>新增章节</Button>
            <Button type="danger">批量删除</Button>
            <Button type="text" className="link_btn" icon={<FullscreenOutlined/>}/>
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
    )
  }
}

export default List
