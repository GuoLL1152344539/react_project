import React, { Component } from 'react'
import { Card, Button, Form, Input, Select, Divider, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqNo1SubjectPagination, reqAddSubject } from '@/api/edu/subject'
// 引入css
import './index.less'
const { Item } = Form
const { Option } = Select
// let page = 1
export default class AddSubject extends Component {
  state = {
    no1SubjectInfo: {
      total: 0,
      items: []
    },
  }
  // 根据页码、页大小获取一级分类数据
  getNo1Subject = async (page) => {
    const { no1SubjectInfo } = this.state
    const { items } = no1SubjectInfo
    const result = await reqNo1SubjectPagination(page, 5)
    this.setState({
      no1SubjectInfo: {
        items: [...items, ...result.items],
        total: result.total
      }
    })
  }
  // 加载更多按钮的回调函数
  loadMore = () => {
    this.page++
    this.getNo1Subject(this.page)
  }
  handleFinish = async (valus)=>{
    await reqAddSubject(valus)
    message.success('新增分类成功！')
		this.props.history.goBack()
    // this.props.history.push('/edu/subject/list')
  }
  componentDidMount() {
    this.page = 1//页码
    this.getNo1Subject(1)
  }
  render() {
    return (
      <Card
        title={
          <div>
            <Button onClick={() => { this.props.history.push('/edu/subject/list') }} type="link" icon={<ArrowLeftOutlined />}></Button>
            <span>添加课程分类</span>
          </div>
        }
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 6 }}
          initialValues={{
            subject_parent: ''
          }}
          onFinish={this.handleFinish}
        >
          <Item
            name="title"
            label="分类名"
            rules={[
              { required: true, message: "分类名不能为空" },
              { max: 12, message: "分类名不能超过12位" },
              { min: 2, message: "分类名不能小于2位" },
            ]}
          >
            <Input placeholder="请输入分类名" />
          </Item>
          <Item
            name="parentId"
            label="所属父级分类"
            labelAlign="right"
            rules={[
              { required: true, message: "所属父级分类不能为空" },
            ]}
          >
            <Select
              dropdownRender={(options) => {
                const {no1SubjectInfo} = this.state
                const {total,items} = no1SubjectInfo
                return (
                  <div>
                    {options}
                    <Divider className="divider" />
                    {
                      total === items.length ?
                      <Button type="link" disabled>不能再点了</Button>:
                      <Button type="link" onClick={this.loadMore}>加载更多</Button>
                    }
                  </div>
                )
              }}
            >
              <Option value="">请选择分类</Option>
              <Option value="0" className="first_subject">一级分类</Option>
              {
                this.state.no1SubjectInfo.items.map((no1Sub) => {
                  return <Option key={no1Sub._id} value={no1Sub._id}>{no1Sub.title}</Option>
                })
              }
            </Select>
          </Item>
          <Item wrapperCol={{ offset: 3 }}>
            <Button type="primary" htmlType="submit">确认</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
