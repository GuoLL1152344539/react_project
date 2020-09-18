import React, { Component } from "react";
import { Form, Input, Button, Row, Col, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
  MobileOutlined,
  MailOutlined,

} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login,loginSuccessSync } from "@/redux/actions/login";
import { reqVerifyCode } from "@/api/phone";
import { reqPhoneLogin } from "@/api/acl/login";
import "./index.less";

const { TabPane } = Tabs;
const { Item } = Form;

@withRouter
@connect(
  () => ({}),
  { login, loginSuccessSync }
)
class LoginForm extends Component {

  state = {
    canClick: true,//按钮是否可以点击
    time: 10,//倒计时的时间
    loginType: 'user'
  }

  gotoAdmin = (token) => {
    localStorage.setItem("user_token", token);
    this.props.history.replace("/");
  }

  handleLogin = async () => {
    const { loginType } = this.state
    if (loginType === 'user') {
      // 校验数据
      await this.refs.loginForm.validateFields(['username', 'password'])
      //获取用户输入的用户名、密码
      let { username, password } = this.refs.loginForm.getFieldsValue(['username', 'password'])
      let response = await this.props.login(username, password)
      this.gotoAdmin(response)
    } else {
      // 校验数据
      await this.refs.loginForm.validateFields(['phone', 'verifyCode'])
      // 获取手机号、验证码
      let { phone, verifyCode } = this.refs.loginForm.getFieldsValue(['phone', 'verifyCode'])
      const tokenObj = await reqPhoneLogin(phone, verifyCode)
      this.props.loginSuccessSync(tokenObj)
      this.gotoAdmin(tokenObj.token)
    }

  }

  reqVerifyCode = async () => {
    await this.refs.loginForm.validateFields(['phone'])
    const {phone} = this.refs.loginForm.getFieldsValue(['phone'])
    this.setState({ canClick: false })
    this.timer = setInterval(() => {
      let { time } = this.state
      time--
      if (time <= 0) {
        this.setState({ time: 10, canClick: true })
        clearInterval(this.timer)
        return
      }
      this.setState({ time })
    }, 1000);
    await reqVerifyCode(phone)
    message.success('验证码发送成功,请注意查收')
  }

  render() {
    const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    return (
      <>
        <Form
          ref="loginForm"
          name="normal_login"
          className="login-form"
        >
          <Tabs
            onChange={key => this.setState({ loginType: key })}
            defaultActiveKey="user"
            tabBarStyle={{ display: "flex", justifyContent: "center" }}
          >
            <TabPane tab="账户登录" key="user">
              <Item name="username" rules={[{ required: true, message: '用户名必须填写' }]}>
                <Input
                  prefix={<UserOutlined className="form-icon" />}
                  placeholder="用户名：admin"
                />
              </Item>
              <Item name="password" rules={[{ required: true, message: '用户名必须填写' }]}>
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  type="password"
                  placeholder="密码: 111111"
                />
              </Item>
            </TabPane>
            <TabPane tab="手机号登录" key="phone">
              <Item name="phone" rules={[
                { required: true, message: '手机号不能为空' },
                { pattern: phoneReg, message: '请输入正确的手机号' }
              ]}>
                <Input
                  prefix={<MobileOutlined className="form-icon" />}
                  placeholder="手机号"
                />
              </Item>
              <Row justify="space-between">
                <Col span={13}>
                  <Item name="verifyCode" rules={[
                    { required: true, message: '验证码不能为空' },
                    { pattern: /^\d+$/, message: '请输入正确的验证码' },
                    { max: 6, message: '验证码为6位' },
                    { min: 6, message: '验证码为6位' }
                  ]}>
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="验证码"
                    />
                  </Item>
                </Col>
                <Col span={10}>
                  {
                    this.state.canClick ?
                      <Button onClick={this.reqVerifyCode} className="verify-btn">获取验证码</Button> :
                      <Button disabled className="verify-btn">获取验证码({this.state.time})</Button>
                  }
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <Item>
            <Button
              type="primary"
              onClick={this.handleLogin}
              className="login-form-button"
            >
              登录
            </Button>
          </Item>
          <Item>
            <Row justify="space-between">
              <Col>
                <span>
                  第三方账号登录：
                  <GithubOutlined className="login-icon" />
                  <WechatOutlined className="login-icon" />
                  <QqOutlined className="login-icon" />
                </span>
              </Col>
            </Row>
          </Item>
        </Form>
      </>
    );
  }
}

export default LoginForm;
