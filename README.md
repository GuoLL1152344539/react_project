## day01任务
1. 安装数据库、导入数据、启动服务器、启动项目
2. 项目文件结构分析
			jsconfig.json：vscode所特有的配置文件
			config-overrides.js：复写react脚手架配置
			api：定义接口请求的文件--按照功能点进行拆分的
			assets：公共资源文件(样式、图片)
			utils:公共js文件（工具js）
			components：可复用组件
			pages：路由组件
			config: 配置文件
				asyncComps.js懒加载 
				icon.js图标 
				route.js路由配置
				没有登录的话，只能访问login和404页面，其他页面由后台控制。
			layouts：整体布局模块，每个页面都会用到的固有布局，分为：私有的、公开的
			redux：redux状态管理
3. 在项目中添加一个菜单的流程：
			一、编码：
					1.在：src\pages\Edu建立文件夹：Subject\index.jsx
					2.在：src\config\asyncComps.js文件中，引入上一步的路由组件，并暴露,代码如下：
							const Subject = () => lazy(() => import("@/pages/Edu/Subject"));
							export default {
								....
								Subject
							};
			二、配置：
						1.去系统中：权限管理 ==> 菜单管理 ==> 教育管理后的加号
						2.输入：
								(1).菜单名称:分类管理
								(2).访问路径:/subject/list
								(3).组件路径:Subject
						3.给菜单分配权限：
									去系统中：权限管理 ==> 角色管理 ==> admin后的小齿轮，勾选分类管理
4. 编写分类管理静态组件
			1.使用Card和Table组件
			2.注意Table组件中render和dataIndex属性的配合使用
5. 展示一级分类列表真实数据
			1.理解：真(后端)分页、假(前端)分页
			2.antd中分页器组件的使用
			
## day02任务
1. 如何让表格的某行数据可展开
			(1).第一种办法：expandedRowRender适用于展开自身没来得及显示的属性，不适用于发请求。
						expandedRowRender:(item)=>{
							console.log('展开自身没展示出来',item);
							return item.gmtCreate
						}
			(2).第二种办法：借助数据自身的children属性
2. 给展开按钮加回调：
						第一种设置方式：使用onExpand
								写法：
										expandable={{
											onExpand:(expanded,recod)=>{此处写业务逻辑}
										}}
								优势：好判断是否展开
								劣势：无法重置展开的状态，需要很复杂的手动维护展开项id

						第一种设置方式：使用expandedRowKeys
								写法：
										expandable={{
											expandedRowKeys:(expandedIds)=>{此处写业务逻辑}
										}}
								优势：自动维护展开项id
								劣势：需要手动判断展开还是收缩(写法不难)
3. 页码切换后，清空展开项:用到Table的expandedRowKeys属性
4. 分页器的使用：
		pagination={{
			pageSize,//页大小
			total,//数据总数,
			current,//当前页码
			showSizeChanger:true,//展示快速跳转框
			showQuickJumper:true,
			pageSizeOptions:['1','2','3','4','5','8','10','50'],//页大小备选项
			onChange:(page)=>{this.getNo1SubjectPagination(page)},//页码改变的回调
			onShowSizeChange:(_,pageSize)=>{//页大小改变的回调
				this.getNo1SubjectPagination(1,pageSize)
			} 
		}}

## day03任务
1. 编辑分类
			(1).在Tbale组件的列配置中，render与dataIndex的配合,获取当前分类信息,存入状态
			(2).更新后，不要刷新当前页面，而是自己遍历更新数据(体验好)，用到了一个递归查找：
				//封装更新数据的方法
				const handleData = arr =>{
					return arr.map((subject)=>{
						if(subject._id === editId){
							subject.title = editTitle
						}else{
							//如果某一级分类有children，继续去children里找
							if(subject.children) handleData(subject.children)
						}
						return subject
					})
				}
2. 删除分类
			(1).用到了Modal.confirm组件
					confirm({
							title:'xxxxx, //主标题
							icon: <QuestionCircleOutlined />,//图标
							content: '删除后无法恢复，请谨慎操作！',//副标题
							okText:'确认',
							cancelText:'取消',
							onOk:async()=> {} //弹窗中确认按钮的回调
							onCancel() {} //弹窗中取消按钮的回调
						});
			(2).执行删除
							(1).删除后重新请求当前页的最新数据
							(2).注意分页器中current属性的使用————用来指定当前页码
							(3).每次点击页码按钮后，将当前页码维护进状态
							(4).若当前不是第一页，且只有一条数据，删除后要请求前一页数据
3. 添加新增分类路由：
	一、编码：
			1.定义好AddSubject组件:在src/pages/Edu/Subject/componnets/AddSubject/index.jsx 
			2.在：src\config\asyncComps.js文件中，引入上一步的路由组件，并暴露,代码如下：
					const AddSubject = () => lazy(() => import("@/pages/Edu/Subject/components/AddSubject"));
					export default {
						....
						AddSubject
					};
	二、配置：
				1.去系统中：权限管理 ==> 菜单管理 ==> 教育管理===>分类管理 点击后面的加号
				2.弹窗中输入：
						菜单名称：新增分类
						访问路径：/subject/add
						组件路径：AddSubject
						按钮权限：subject.add
				3.给按钮分配权限：
							去系统中：权限管理 ==> 角色管理 ==> admin后的小齿轮，勾选新增管理
4. 编写新增分类静态组件：
			1.使用：Card、Form组件
			2.Form组件：
					(1).每个表单项都是一个Item
					(2).每个Item都分为：label区、wrapper区，可分别用labelCol、wrapperCol去控制
					(3).每个Item都可以加校验规则，用rules属性，前提：Item必须有name，否则规则失效
					(4).Form组件中任何的输入域，都要用Form组件的initialValues去指定，不允许单独指定
			3.Select组件：
					(1).每个Option必须有value属性
					(2).Select组件中dropdownRender用于指定下拉框中额外的内容。
					(3).dropdownRender值为函数，会接到Select标签体内容。


## day04任务
1. 章节管理静态组件，注意拆分Search组件、List组件
2. Form表单的重置，借助：表单实例对象.resetFields()
3. 新增课时：
			(1).创建文件：在src/pages/Edu/Chapter/components/AddLesson创建index.jsx
			(2).在：src\config\asyncComps.js文件中，引入上一步的路由组件，并暴露,代码如下：
					const AddLesson = () => lazy(() => import("@/pages/Edu/Chapter/components/AddLesson"));
					export default {
						....
						AddLesson
					};
			(3).去系统中：权限管理 ==> 菜单管理 ==> 教育管理 ==>章节管理 后面的加号
			(4).输入：
							菜单名称：新增课时
							访问路径：/chapter/addlesson
							组件路径：AddLesson
							按钮权限：chapter.addlesson
			(5).给菜单分配权限：
							去系统中：权限管理 ==> 角色管理 ==> admin后的小齿轮，新增课时
4. 在List组件中使用withRouter
5. 编写新增课时静态组件
			注意：Switch组件被Item包裹时，默认会取Switch组件的value值，但Switch内部维护的不是value
						是checked，所以需要在Item中追加valuePropName="checked"，声明接收的是checked
6. 文件上传
			(1).在xxxxx创建Upload/index.jsx
			(2).对上传的文件进行类型的限制：使用accept="video/mp4"
			(3).指定customReques属性，值为函数，函数体中写真正上传的逻辑

## day05任务
1. 七牛云上传文件配置+编码流程（通用）
		(1).配置：
					1).登录七牛云账号 ===> 管理控制台
					2).空间管理===>新建空间(注意空间类型要选择：公开空间)
		(2).编码：
					参考：文档===>开发者中心，SDK&工具 ====> 官方SDK
				 	1).安装:yarn add qiniu-js ,引入：import * as qiniu from 'qiniu-js'
					2).修改服务器配置，文件位置：server\config\index.js,内容如下：
							// 七牛云配置
							const ACCESS_KEY = "b4_N1cKskFNSu9qMX98UfzXGvRc5GwYhuBlD7W4K";
							const SECRET_KEY = "-p-rnYrdiJFeZ-XXe1OwnBIwjOmv26YnMvgtCUdd";
							const BUCKET = "atguigu-0422";
							const EXPIRES = 7200;
					3).创建获取七牛token的接口，在api/upload/index.js中编码：
							//用于请求七牛云授权的token
							import request from "@/utils/request";
							const BASE_URL = "/uploadtoken";
							export function reqQiniuToken() {
								return request({
									url: BASE_URL,
									method: "GET",
								});
							}
					4).在customRequest回调中编写如下代码：
							const key = file.uid //交给七牛云时文件的名字
							const {uploadToken:token} = await reqQiniuToken() //获取一个可用的token
							
							const observable = qiniu.upload(file, key, token)
							observable.subscribe() // 上传开始
2. 添加课时-获取表单数据
		注意在自己的上传组件中使用this.props.onChange()去传递上传完毕的视频地址
3. 预览视频：
		使用antd的Modal组件和video-react完成视频播放，注意关闭弹窗时要销毁Modal中的子元素
4. 使用screenfull做全屏切
		注意区分：页签全屏和浏览器全屏


## day06任务
1. Echarts的基本使用流程(非脚手架环境)
			(1).引入 <script src="./echarts.min.js"></script>
			(2).基于准备好的dom，初始化echarts实例
						var myChart = echarts.init(document.getElementById('main'));
			(3).指定图表的配置项和数据
						var option = {}
			(4).使用指定的配置项和数据显示图表。
						myChart.setOption(option);
2. 在react项目中使用Echarts
			(1). 安装依赖： yarn add echarts echarts-for-react
			(2). 引入：import ReactEcharts from 'echarts-for-react';
			(3). 编码：<ReactEcharts option={this.initBarChart()} />
			备注：要编写可以返回配置对象的initBarChart
3. antd的栅格组件的使用——————Grid
			
4. bizCharts的简单使用

5. Tabs、DatePicker组件的使用

6. 国际化
		明确：
				1.国际化是实时翻译吗？——————不是！！！
				2.国际化需要提前定义语言包
				3.国际化分为：
							骨架的国际化：前端自己就可以做
							内容的国际化：需要后端多种语言数据的支持
		自定义国际化-具体步骤如下：
							1).社区精选组件===>应用国际化===>react-intl
							2).yarn add react-intl
							3).创建语言包（中文、英文）
										src/locales/zh_CN.json
										src/locales/zh_TW.json
										src/locales/en.json
							4).App.js中如下操作：
										【1】引入：
												//引入国际化库
												import {IntlProvider} from 'react-intl'
												//引入所有语言包
												import {zh_CN,zh_TW,en} from './locales'
										【2】创建当前语言环境
												<Router history={history}>
													<IntlProvider 
														messages={zh_TW} //指定使用哪个语言包
													>
														<Layout/>
													</IntlProvider>
												</Router>
							5).基本使用：
									方案一：
											在要国际化的组件中引入：import {FormattedMessage} from 'react-intl'
											要国际化的文字，改成：<FormattedMessage id="title"/>
									方案二：
											在要国际化的组件中引入：import {Xxxxxx,injectIntl} from 'react-intl'
											装饰：
												@injectIntl
												class SearchCourse extends Component{}
												export default SearchCourse
											要国际化的文字，改成：this.props.intl.formatMessage({id:'title'})
							6).更多用法：
										<FormattedMessage 
											id="title" 
											values={{name:'tom',age:19}}
											// tagName='button'
											/* values={{
												name:<button style={{backgroundColor:'red'}}>tom</button>,
												age:<button style={{backgroundColor:'blue'}}>19</button>
											}} */
										>
											{(p1,p2)=>{
												console.log(p1,p2);
												return <Button>{p1},{p2}</Button>
											}}
										</FormattedMessage>
						（2）.antd国际化-具体步骤如下：
										引入：
												//引入antd的国际化库
												import {ConfigProvider} from 'antd'
												//引入antd的语言包
												import en from 'antd/es/locale/en_US';
												import zh_CN from 'antd/es/locale/zh_CN';
												import zh_TW from 'antd/es/locale/zh_TW';
										创建语言环境
												<ConfigProvider locale={具体的语言包}>
													.....
												<ConfigProvider/>

