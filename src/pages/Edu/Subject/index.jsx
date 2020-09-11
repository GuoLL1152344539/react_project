import React, { Component } from 'react'
// 引入antd的Card组件/Button组件
import { Card, Button, Table, Tooltip } from 'antd'
// 引入icon图标
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
// 引入reqAllSubject发送请求
import { reqNo1SubjectPagination, reqAllNo2SubjectByNo1Id } from '@/api/edu/subject'

import './index.less'


export default class Subject extends Component {
  state = {
    // 存储一级分类的数据
    no1SubjectInfo: {
      items: [], //当前页的一级分类数据
      total: 0, //数据总数
    },
    pageSize: 3,//页大小
    expandedRowKeys: [],//
  }
  // 根据页码和页大小请求数据
  getNo1SubjectPagination = async (page, pageSize = this.state.pageSize) => {
    let { items, total } = await reqNo1SubjectPagination(page, pageSize)
    // 加工请求回来的一级分类数组，给每一项都加children属性，目的是可以展开
    items = items.map((no1Subject) => ({ ...no1Subject, children: [] }))
    this.setState({
      no1SubjectInfo: { items, total },
      pageSize,
      expandedRowKeys: []
    })
  }
  // handleExpand = async(expanded,record)=>{
  //   if (expanded) {
  //     const {items} = await reqAllNo2SubjectByNo1Id(record._id)
  //     // console.log(items);
  //     const {no1SubjectInfo, expandedRowKeys} = this.state
  //     const formatedNo1Items = no1SubjectInfo.items.map((no1Subject)=>{
  //       if (no1Subject._id === record._id) {
  //         no1Subject.children = items
  //       }
  //       return no1Subject
  //     })
  //     // 维护状态
  //     this.setState({
  //       no1SubjectInfo:{...no1SubjectInfo, items:formatedNo1Items},
  //       expandedRowKeys:[record._id,...expandedRowKeys]
  //     })
  //   }
  // }
  handleExpand = async (expandedIds) => {
    const { expandedRowKeys, no1SubjectInfo } = this.state
    if (expandedIds.length > expandedRowKeys.length) {
      // 获取当前展开项的id
      const currentId = expandedIds.slice(-1)[0]
      // 获取当前展开项
      const currentSubject = no1SubjectInfo.items.find((sub)=>sub._id === currentId)
      if (!currentSubject.children.length) {
        // 请求数据
        const { items } = await reqAllNo2SubjectByNo1Id(currentId)
        // console.log(items);
        const formatedNo1Items = no1SubjectInfo.items.map((no1Subject) => {
          if (no1Subject._id === currentId) {
            no1Subject.children = items
            !items.length && delete no1Subject.children
          }
          return no1Subject
        })
        // 维护状态
        this.setState({
          no1SubjectInfo: { ...no1SubjectInfo, items: formatedNo1Items }
        })
      }
    }
    this.setState({ expandedRowKeys: expandedIds })
  }

  componentDidMount() {
    // 初始化第一页数据
    this.getNo1SubjectPagination(1)
  }
  render() {
    // dataSource是表格的数据源，后期一定是通过服务器获取
    const { no1SubjectInfo: { items, total }, pageSize, expandedRowKeys } = this.state
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
            expandable={{
              // onExpand: this.handleExpand,//展开的回调---传入：是否展开、当前展开项
              expandedRowKeys,//告诉table展开哪些项
              // onExpandedRowsChange:(expandedIds)=>{this.setState({expandedRowKeys:expandedIds})}
              onExpandedRowsChange: this.handleExpand
              // expandedRowRender: record => {//展开某项的回调
              //   // 获取当前一级分类的id，发请求获取对应的二级分类数据
              //   console.log(record._id);
              //   this.getNo2SubjectPagination(record._id)
              //   // return一个结构展示
              // },
              // rowExpandable: () => true,
            }}
            pagination={{
              pageSize,
              total,
              showSizeChanger: true,//切换页大小
              showQuickJumper: true,//跳到第几页
              pageSizeOptions: ['3', '5', '8', '10'],
              // onChange:(page)=>{this.getNo1SubjectPagination(page)},
              // 简化写法
              onChange: this.getNo1SubjectPagination,//页码改变的回调
              onShowSizeChange: (_, pageSize) => { this.getNo1SubjectPagination(1, pageSize) },//切换页大小的回调
            }}
          />
        </Card>
      </div>
    )
  }
}
