import React from 'react';
import { Typography, Card, Input, Row, Col, Form, Button, Upload, notification,Spin } from 'antd';
import request from "./../insurance/PostRequest";
import "./LoginPasswordChange.css";
import cookie from "react-cookies";

const { Text } = Typography;
class LoginPasswordChange extends React.Component {
   constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
     const cookieUser = cookie.load("LoggedSysuser");
     
     this.state = {
       data: props.data,
       visible: props.visible,
       loading: false,
       LoggedSysuser,
       profile_image: undefined,
       confirmDirty: false,
       cookieUser
    };
  }

  handleSubmit = (e) => {
      const { form } = this.props;
      form.validateFields((errors, values) => {
        if (errors) return;
        this.setState({ loading: true });
      request
        .post("Get_PasswordChange", { 
          token: this.state.LoggedSysuser.token,
          empCode: this.state.cookieUser.EmpCode,
          loginPassNew: values.loginPassNew
          })
        .then((res) => {
          if (res.data.retType == "") {
            this.setState({ loading: false });
            notification["error"]({
              message: "Анхаар",
              description: res.data.retDesc,
            });
            return;
        }
          this.setState({ loading: false });
          notification["success"]({
            message: "",
            description: "Амжилттай хадгаллаа.",
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    });
  };
   validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['loginPassNew'], { force: true });
    }
    callback();
    };
      compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Нууц үг буруу оруулсан байна!');
    } else {
      callback();
    }
    };
      handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
     const formLayount = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      labelAlign: "left",
    };
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
        return (
            <div style={{ margin: '27px' }}>
              <h3>Нууц үг солих</h3>
              <h4 style={{ marginBottom: '25px' }}>Хүний нөөц / Систем менежер / <Text color='#6b747b' >Нууц үг солих</Text></h4>
            <div>
                <Spin spinning={this.state.loading}>
            <Card>
                <Form {...formLayount}>
                <Row gutter={12}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                      <Form.Item label="Шинэ нууц үг" {...formItemLayout} className="step-for" hasFeedback>
                      {getFieldDecorator('password',  {   rules: [
                        { required: true, message: 'Мэдээлэл оруулах шаардлагатай!',},
                        { validator: this.validateToNextPassword }]})(<Input.Password />)}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                      <Form.Item label="Нууц үг баталгаажуулах" {...formItemLayout} className="step-for" hasFeedback>
                      {getFieldDecorator('loginPassNew',  { rules: [ {required: true,message: 'Мэдээлэл оруулах шаардлагатай!',},
                      { validator: this.compareToFirstPassword, },],})(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                      </Form.Item> 
                    </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                            <Button onClick={this.handleSubmit} type="primary" style={{ fontWeight: "bold", background: "#00358d", borderWidth: "0px",width: "100%", marginTop: "4px" }}>
                            Хадгалах
                        </Button>
                  </Col>
              </Row>
            </Form>
              </Card>
              </Spin>
         </div>
        </div>
        );
    };
}
const EditableFormTable = Form.create()(LoginPasswordChange);
export default EditableFormTable;