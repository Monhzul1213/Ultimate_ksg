import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Modal,
  Row,
  Col,
  Spin,
  notification,
} from "antd";
import React from "react";
import request from "./../insurance/PostRequest";
import cookie from "react-cookies";

const { Option } = Select;
class App extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
    };
  }

  handleOk = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      this.setState({ loading: true });
      if (errors) return;

      this.setState({ loading: true });
      Object.keys(values).forEach((key) => {
        this.state.data.EmpDtl[0][key] = values[key];
      });
      this.state.data.EmpDtl[0].RowStatus = "U";
      request
        .post("Profile_Modify", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            BusinessObject: { ProfileType: "EmergencyContact" },
            EmpDtl: this.state.data.EmpDtl,
          }),
        })
        .then((res) => {
          if (res.data.retType !== 0) {
            this.setState({ loading: false });
            notification["error"]({
              message: "Анхаар",
              description: res.data.retDesc,
            });
            return;
          }

          form.resetFields();
          notification["success"]({
            message: "",
            description: "Амжилттай хадгаллаа.",
          });

          this.setState({ visible: false });
          this.props.onSuccess(res.data.retData);
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    });
  };

  handleCancel = (e) => {
    this.props.onSuccess();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    return (
      <div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Хадгалах"
          footer={null}
          width="800px"
          bodyStyle={{ padding: "30px" }}
        >
          <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <Form>
              <h3
                align="center"
                style={{ marginBottom: "20px", fontSize: "16pt" }}
              >
                <b>Яаралтай үед холбогдох</b>
              </h3>
              <Row>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "16px",
                    }}
                  >
                    Яаралтай үед холбогдох хүний мэдээлэл
                  </p>
                  {getFieldDecorator("EmergencyContact", {
                    initialValue:
                      this.state.data &&
                      this.state.data.EmpDtl &&
                      this.state.data.EmpDtl.length > 0
                        ? this.state.data.EmpDtl[0].EmergencyContact
                        : "",
                  })(
                    <Input
                      size="large"
                      style={{ fontSize: "13pt", fontFamily: "Arial" }}
                    />
                  )}
                </Form.Item>
              </Row>
              <Form.Item
                wrapperCol={{
                  xs: {
                    span: 24,
                    offset: 7,
                  },
                  sm: { span: 17, offset: 8 },
                }}
                style={{ marginBottom: "0px" }}
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={this.handleOk}
                  style={{
                    width: "250px",
                    height: "50px",
                    marginTop: "40px",
                    marginBottom: "0px",
                    background: "#0A5287",
                    border: "none",
                  }}
                >
                  <p
                    style={{
                      marginBottom: "2px",
                      fontSize: "14pt",
                    }}
                  >
                    <b>Хадгалах</b>
                  </p>
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const WrappedDynamicRule = Form.create({ name: "dynamic_rule" })(App);

export default class EmergencyEdit extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <WrappedDynamicRule
        data={this.props.data}
        visible={this.props.visible}
        onSuccess={this.props.onSuccess}
      />
    );
  }
}
