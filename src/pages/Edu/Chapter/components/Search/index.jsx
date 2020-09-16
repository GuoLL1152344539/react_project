import React, { Component } from 'react'
import { Card, Form, Select, Button } from "antd";
import { reqAllCourse } from "@/api/edu/course";
import { reqChapterListByCourseId } from "@/api/edu/chapter";
import Pubsub from 'pubsub-js'
import {FormattedMessage} from 'react-intl'
import './index.less'

const { Item } = Form
const { Option } = Select
export default class Search extends Component {

  state={
    courseList:[],
  }

  // 获取所有章节
  getAllCourse = async () => {
    const courseList = await reqAllCourse()
    this.setState({courseList})
    // console.log(courseList);
  }

  // 搜索按钮的回调
  handleFinish = async (values)=>{
    const {courseId} = values
    const result = await reqChapterListByCourseId(1,5,courseId)
    Pubsub.publish('chapter_list',result)
  }

  // 重置按钮的回调
  resetForm = () => {
    this.refs.form.resetFields();
    Pubsub.publish('chapter_list',[])
  }

  // 组件挂载完成的钩子
  componentDidMount() {
    this.getAllCourse()
  }

  render() {
    const {courseList} = this.state
    return (
      <Card>
        <Form 
          ref="form"
          layout="inline" 
          initialValues={{ courseId: '' }}
          onFinish={this.handleFinish}
        >
          <Item
            label={<FormattedMessage id="select_course"/>}
            name="courseId"
            wrapperCol={{ span: 4 }}
            rules={[
              { required: true, message: '必须选择一个课程' }
            ]}
          >
            <Select className="select_course">
              <Option value="">{<FormattedMessage id="please_select_course"/>}</Option>
              {
                courseList.map((c)=>{
                  return <Option value={c._id} key={c._id}>{c.title}</Option>
                })
              }
            </Select>
          </Item>
          <Item>
            <Button type="primary" htmlType="submit">{<FormattedMessage id="search"/>}</Button>
          </Item>
          <Item>
            <Button onClick={this.resetForm}>{<FormattedMessage id="reset"/>}</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
