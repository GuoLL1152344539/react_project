import React, { Component } from 'react'
// 引入antd的Card组件/Button组件
import { Card, Button, Table, Tooltip } from 'antd'
// 引入icon图标
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
// 引入reqAllSubject发送请求
import { reqNo1SubjectPagination } from '@/api/edu/subject'

import './index.less'


export default class Subject extends Component {
  state = {
    // 存储一级分类的数据
    no1SubjectInfo: {
      items: [], //当前页的一级分类数据
      total: 0, //数据总数
    },
    pageSize: 3,//页大小
  }
  // 根据页码和页大小请求数据
  getNo1SubjectPagination = async (page, pageSize = this.state.pageSize) => {
    const { total, items } = await reqNo1SubjectPagination(page, pageSize)
    this.setState({
      no1SubjectInfo: { total, items },
      pageSize
    })
  }
  componentDidMount() {
    // 初始化第一页数据
    this.getNo1SubjectPagination(1)
  }
  render() {
    // dataSource是表格的数据源，后期一定是通过服务器获取
    /* const dataSource = [
      {
        key: '1',//每条数据唯一标识
        name: '测试分类1',
        // operation: (
        //   <>
        //     <Button type="primary" icon={<FormOutlined/>}></Button>
        //     <Button type="danger" icon={<DeleteOutlined/>}></Button>
        //   </>
        // )
      },
      {
        key: '2',
        name: '测试分类2',
      },
    ]; */
    const { no1SubjectInfo: { items, total }, pageSize } = this.state
    // columns是表格的列配置
    const columns = [
      {
        title: '分类名',//列名
        dataIndex: 'title',//列索引，数据索引项
        key: '_id',
        width: '80%',
        // render: (item) => '￥'+item.name
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        // render做高级设置
        render: () => (
          <>
            <Tooltip title="编辑分类">
              <Button type="primary" icon={<FormOutlined />}></Button>
            </Tooltip>
            <Tooltip title="删除分类">
              <Button type="danger" icon={<DeleteOutlined />} className="left_btn"></Button>
            </Tooltip>
          </>
        )
        /*
          1.render与dataIndex同时存在的时候，以render为主
          2.render接收到的参数由dataIndex控制，dataIndex若不写，则传递当前数据的整体内容
        */
      },
    ];
    return (
      <div>
        {/* <Card title={<Button type="primary" icon={<PlusCircleOutlined />}>新增分类</Button>}> */}
        <Card
          title={
            <Button type="primary">
              <PlusCircleOutlined />
              新增分类
            </Button>
          }
        >
          <Table
            dataSource={items}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize,
              total,
              showSizeChanger:true,//切换页大小
              showQuickJumper:true,//跳到第几页
              pageSizeOptions:['3','5','8','10'],
              // onChange:(page)=>{this.getNo1SubjectPagination(page)}
              // 简化写法
              onChange:this.getNo1SubjectPagination,//页码改变的回调
              onShowSizeChange:(_,pageSize)=>{this.getNo1SubjectPagination(1,pageSize)},//切换页大小的回调
            }}
          />
        </Card>
      </div>
    )
  }
}
