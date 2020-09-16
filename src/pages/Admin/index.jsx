import React, { Component } from 'react'
import MyCard from "./components/MyCard/index";
import { Row, Col, Statistic, Tooltip, Tabs, Card, DatePicker } from 'antd';
import { QuestionCircleOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import ReactEcharts from 'echarts-for-react';
import { ColumnChart, AreaChart } from 'bizcharts';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default class Admin extends Component {

	state = {
		data: [
			{
				type: '家具家电',
				sales: 38,
			},
			{
				type: '粮油副食',
				sales: 52,
			},
			{
				type: '生鲜水果',
				sales: 61,
			},
			{
				type: '美容洗护',
				sales: 145,
			},
			{
				type: '母婴用品',
				sales: 48,
			},
			{
				type: '进口食品',
				sales: 38,
			},
			{
				type: '食品饮料',
				sales: 38,
			},
			{
				type: '家庭清洁',
				sales: 38,
			},
		],
		data2: [
			{ year: '1991', value: 3 },
			{ year: '1992', value: 4 },
			{ year: '1993', value: 3.5 },
			{ year: '1994', value: 5 },
			{ year: '1995', value: 4.9 },
			{ year: '1996', value: 6 },
			{ year: '1997', value: 7 },
			{ year: '1998', value: 9 },
			{ year: '1999', value: 13 },
		]
	}

	//Echarts柱状图配置
	initBarChart = () => (
		{
			title: {
				text: '商品销售报表', //主标题文字
				show: false, //是否展示标题
				link: 'https://www.baidu.com', //主标题点击跳转的链接
				textStyle: {
					color: '#000' //主标题的样式
				},
				subtext: '按季度统计'//副标题
			},
			tooltip: { //提示框配置
				trigger: 'axis', //提示框触发类型
				axisPointer: { //坐标轴指示器配置项
					type: 'cross' //十字准星指示器
				},
				// triggerOn:'click', //提示框触发的条件
				// showDelay:500 //浮层显示的延迟
				formatter: '{b0}的{a0}: {c0}个' //弹窗格式化模板
			},
			legend: { //图例配置
				data: ['销量', '库存'],
				show: false
				// formatter: '总公司{name}'
				// icon:'image://https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=127665095,1206639163&fm=26&gp=0.jpg'
			},
			xAxis: { //x轴配置
				data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子", "皮鞋"],
				show: false
			},
			yAxis: { show: false }, //y轴配置
			series: [
				{ //表格展示相关的配置(系列列表)
					name: '销量', //该组数据的名字是什么（需要和legend.data对应）
					type: 'bar', //控制图标的类型 bar柱状图 line：折线图 pie：饼图 
					data: [50, 200, 360, 100, 100, 200, 170] //具体的数据
				},
				{ //表格展示相关的配置(系列列表)
					name: '库存', //该组数据的名字是什么（需要和legend.data对应）
					type: 'bar', //控制图标的类型 bar柱状图 line：折线图 pie：饼图 
					data: [150, 280, 460, 170, 120, 220, 270] //具体的数据
				}
			]
		}
	)

	handleTab = (key) => {
		console.log(key);
	}

	getDate = (a, b) => {
		console.log('aaaaaaa', a, 'bbbbbb', b);
	}

	render() {
		return (
			<>
				<Row gutter={[10, 10]}>
					<Col xs={24} sm={24} md={12} lg={6} xl={6}>
						<MyCard
							left="总销售额"
							right={
								<Tooltip title="按订单计算">
									<QuestionCircleOutlined />
								</Tooltip>
							}
							content={
								<>
									<Statistic value={13450} prefix={"￥"} />
									<div>
										周同比：40%<CaretUpOutlined style={{ color: 'red' }} />&nbsp;
									日同比：30%<CaretDownOutlined style={{ color: 'green' }} />
									</div>
								</>
							}
							footer={
								<Statistic valueStyle={{ fontSize: '16px' }} value={13450} prefix={"日销售额：￥"} suffix="元" />
							}
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6} xl={6}>
						<MyCard
							left="支付笔数"
							right={
								<Tooltip title="按用户计算">
									<QuestionCircleOutlined />
								</Tooltip>
							}
							content={
								<>
									<Statistic value={356344} suffix="次" />
									<ReactEcharts option={this.initBarChart()} />
								</>
							}
							footer={<Statistic valueStyle={{ fontSize: '16px' }} value={13450} prefix="总店销售额 ：￥" suffix="元" />}
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6} xl={6}>
						<MyCard
							left="访问量"
							right={
								<Tooltip title="按用户计算">
									<QuestionCircleOutlined />
								</Tooltip>
							}
							content={
								<ColumnChart
									style={{ top: '21px' }}
									data={this.state.data}
									title={{
										visible: false,
										text: '基础柱状图',
									}}
									// width={200}
									// height={200}
									forceFit
									padding={0}
									xField='type'
									xAxis={{ visible: false }}
									yField='sales'
									yAxis={{ visible: false }}
								/>
							}
							footer="890"
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6} xl={6}>
						<MyCard
							left="运营统计"
							right={<QuestionCircleOutlined />}
							content={
								<AreaChart
									data={this.state.data2}
									title={{
										visible: false,
										text: '面积图',
									}}
									xField='year'
									xAxis={{ visible: false }}
									yAxis={{ visible: false }}
									yField='value'
								/>
							}
							footer="890"
						/>
					</Col>
				</Row>
				<Card>
					<Tabs
						defaultActiveKey="1"
						onChange={this.handleTab}
						tabBarExtraContent={
							<RangePicker
								onChange={this.getDate}
								format='YYYY-MM-DD'
							/>
						}
					>
						<TabPane tab="销售量" key="sale">
							<ReactEcharts option={this.initBarChart()} />
						</TabPane>
						<TabPane tab="访问量" key="visit">
							<AreaChart
								data={this.state.data2}
								title={{
									visible: false,
									text: '面积图',
								}}
								xField='year'
								xAxis={{ visible: false }}
								yAxis={{ visible: false }}
								yField='value'
							/>
						</TabPane>
					</Tabs>
				</Card>
			</>
		)
	}
}
