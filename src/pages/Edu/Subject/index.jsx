import React, { Component } from 'react'
// 引入antd的Card组件/Button组件
import { Card, Button, Table, Tooltip, Input } from 'antd'
// 引入icon图标
import { PlusCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
// 引入reqAllSubject发送请求
import { reqNo1SubjectPagination, reqAllNo2SubjectByNo1Id, reqUpdateSubject } from '@/api/edu/subject'
// 引入css
import './index.less'


export default class Subject extends Component {
  state = {
    // 存储一级分类的数据
    no1SubjectInfo: {
      items: [], //当前页的一级分类数据
      total: 0, //数据总数
    },
    pageSize: 3,//页大小
    expandedRowKeys: [],//展开了的一级分类
    loading: false,
    editSubjectId: '',//当前编辑的id
    editSubjectTitle: '',//当前编辑的名字

  }
  // 根据页码和页大小请求数据
  getNo1SubjectPagination = async (page, pageSize = this.state.pageSize) => {
    // 展示loading
    this.setState({ loading: true })
    let { items, total } = await reqNo1SubjectPagination(page, pageSize)
    // 加工请求回来的一级分类数组，给每一项都加children属性，目的是可以展开
    items = items.map((no1Subject) => ({ ...no1Subject, children: [] }))
    this.setState({
      no1SubjectInfo: { items, total },
      pageSize,
      expandedRowKeys: [],
      loading: false
    })
  }
  handleExpand = async (expandedIds) => {
    const { expandedRowKeys, no1SubjectInfo } = this.state
    // 如果是展开
    if (expandedIds.length > expandedRowKeys.length) {
      // 获取当前展开项的id
      const currentId = expandedIds.slice(-1)[0]
      // 获取当前展开项
      const currentSubject = no1SubjectInfo.items.find(sub => sub._id === currentId)
      if (currentSubject.children && !currentSubject.children.length) {
        // 请求数据
        const { items } = await reqAllNo2SubjectByNo1Id(currentId)
        // console.log(items);
        const formatedNo1Items = no1SubjectInfo.items.map(no1Subject => {
          if (no1Subject._id === currentId) {
            no1Subject.children = items
            // 如果当前项的children没有数据，就删掉
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
    // 维护好
    this.setState({ expandedRowKeys: expandedIds })
  }
  // 点击编辑按钮的回调
  handleEdit = ({ _id, title }) => {
    return () => {
      this.setState({ editSubjectId: _id, editSubjectTitle: title })
    }
  }
  // 点击编辑按钮的回调
  handleTitleChange = (event) => {
    this.setState({ editSubjectTitle: event.target.value })
  }
  updateSubject = async () => {
    // 调用递归函数，传入数组，实现修改title
    let updateData = this.updateNo1SubjectInfo(this.state.no1SubjectInfo.items)
    const { editSubjectId, editSubjectTitle, no1SubjectInfo } = this.state
    // 调用接口，发送请求，修改数据
    const result = await reqUpdateSubject(editSubjectId, editSubjectTitle)
    // 更新状态
    this.setState({ editSubjectId: '', editSubjectTitle: '', no1SubjectInfo: { ...no1SubjectInfo, items: [...updateData] } })
  }
  // 递归更新状态数据
  updateNo1SubjectInfo = (data) => {
    // 取出更新后的状态数据
    let { editSubjectId, editSubjectTitle } = this.state
    // 将传进来的data-数组用map方法遍历加工并返回加工后的数组
    return data.map((item) => {
      // 判断当前操作项的id是否与当前item的id相等
      if (item._id === editSubjectId) {
        // 若相等，修改title并返回当前对象
        return {
          ...item,
          title: editSubjectTitle
        }
      }
      // 不相等有可能是二级分类，先判断是否有二级分类
      if (item.children) {
        // 有二级分类则将当前二级分类的数组传给递归函数，继续判断修改title
        item.children = this.updateNo1SubjectInfo(item.children)
      }
      // 如果以上不满足，则返回当前对象
      return { ...item }
    })
  }

  componentDidMount() {
    // 初始化第一页数据
    this.getNo1SubjectPagination(1)
  }
  render() {
    // dataSource是表格的数据源，后期一定是通过服务器获取
    const { no1SubjectInfo: { items, total }, pageSize, expandedRowKeys, loading, editSubjectId } = this.state
    // columns是表格的列配置
    const columns = [
      {
        title: '分类名',//列名
        // dataIndex: 'title',//列索引，数据索引项
        key: '_id',
        width: '80%',
        render: ({ _id, title }) => (
          _id === editSubjectId ?
            <Input onChange={this.handleTitleChange} className="edit_input" type="text" defaultValue={title} /> :
            title
        )
      },
      {
        title: '操作',
        // dataIndex: '_id',
        key: '_id',
        align: 'center',
        // render做高级设置:dataIndex指定值时，render的参数是指定的值，不指定dataIndex时，接收整个操作项
        render: (subject) => (
          subject._id === editSubjectId ?
            <div className="edit_btn_group">
              <Button size="small" type="primary" className="ok_btn" onClick={this.updateSubject}>确定</Button>
              <Button size="small">取消</Button>
            </div> :
            <>
              <Tooltip placement="top" title="编辑分类">
                <Button onClick={this.handleEdit(subject)} type="primary" icon={<FormOutlined />}></Button>
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
        // loading={loading}
        >
          <Table
            dataSource={items}
            columns={columns}
            rowKey="_id"
            loading={loading}
            expandable={{
              // onExpand: this.handleExpand,//展开的回调---传入：是否展开、当前展开项
              expandedRowKeys,//告诉table展开哪些项
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
              onChange: this.getNo1SubjectPagination,//页码改变的回调
              onShowSizeChange: (_, pageSize) => { this.getNo1SubjectPagination(1, pageSize) },//切换页大小的回调
            }}
          />
        </Card>
      </div>
    )
  }
}
