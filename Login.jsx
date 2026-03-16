import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Form, Icon, Input, Button, Checkbox, notification } from "antd";
import "./Login.css";
import axios from "axios";
import cookie from "react-cookies";

class NormalLoginForm extends React.Component {
  componentDidMount() {
    cookieUser: cookie.remove("LoggedSysuser");
  }

  state = {
    a: 1,
    user: "",
    pass: "",
  };

  handleSubmit = (e) => {
    cookie.save("username", this.state.user, { path: "/" });
    cookie.setRawCookie("EmpCode", null);
    cookie.setRawCookie("UserID", null);
    this.props.onSuccess(this.state.user, this.state.pass);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', e.state);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator("username", {
            //rules: [{ required: false, message: 'Нэвтрэх нэр оруулна уу!' }],
          })(
            <Input
              onChange={(a) => {
                this.setState({
                  user: a.target.value,
                });
              }}
              style={{ height: "45px" }}
              prefix={
                <Icon type="user" style={{ color: "rgba(85,85,85,1)" }} />
              }
              placeholder="Имэйл, утас, эсвэл ажилтны код"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            //rules: [{ required: false, message: 'Нууц үг оруулна уу!' }],
          })(
            <Input
              onChange={(a) => {
                this.setState({
                  pass: a.target.value,
                });
              }}
              style={{ height: "45px" }}
              prefix={
                <Icon type="lock" style={{ color: "rgba(85,85,85,1)" }} />
              }
              type="password"
              placeholder="Нууц үг"
            />,
          )}
          {<Checkbox>Намайг сана</Checkbox>}
          <a className="login-form-forgot" href="">
            Нууц үг мартсан
          </a>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ height: "45px" }}
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
  NormalLoginForm,
);

export default WrappedNormalLoginForm;
