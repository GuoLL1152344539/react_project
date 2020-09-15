import React, { Component } from 'react'
import { Card, Form, Button, Input, Switch } from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import UploadLesson from "@/components/UploadLesson";
import { reqAllLesson } from "@/api/edu/lesson";

const { Item } = Form

export default class AddLesson extends Component {

  handleFinish = async (values)=>{
    values.chapterId = this.props.location.state.id
    const result = await reqAllLesson(values)
    console.log(result);
    this.props.history.goBack()
  }

  render() {
    return (
      <Card
        title={
          <div>
            <Button 
              onClick={() => { this.props.history.push('/edu/chapter/list') }} 
              type="link" 
              icon={<ArrowLeftOutlined />}>
            </Button>
            <span>添加课时</span>
          </div>
        }
      >
        <Form 
          onFinish={this.handleFinish}
          wrapperCol={{span:4}}
          initialValues={{
            isfree:false
          }}
        >
          <Item
            name="title"
            label="课时名"
            rules={[
              {required:true, message:'必须输入课时名'}
            ]}
          >
            <Input placeholder="请输入课时名" />
          </Item>
          <Item
            name="free"
            valuePropName="checked"//默认Item所包裹的内容，自动收集value值，但是Switch组件内部维护的不是value值，需要valuePropName属性指定一下
            label="是否免费"
          >
            <Switch checkedChildren="是" unCheckedChildren="否"  />
          </Item>
          <Item
            name="video"
            label="课时视频"
          >
            <UploadLesson/>
          </Item>
          <Item
            // name="add"
          >
            <Button type="primary" htmlType="submit">添加</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
