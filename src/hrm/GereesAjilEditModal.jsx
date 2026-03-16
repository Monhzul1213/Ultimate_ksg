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
import request from "../insurance/PostRequest";
import cookie from "react-cookies";

const { TextArea } = Input;
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
      if (errors) return;

      this.setState({ loading: true });
      Object.keys(values).forEach((key) => {
        this.state.data.EmpDtl[0][key] = values[key];
      });
      this.state.data.EmpDtl[0].RowStatus = "U";
      this.setState({ loading: true });
      request
        .post("Profile_Modify", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            BusinessObject: { ProfileType: "GereesAjil" },
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
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 12 }, //≥576px
    };
    return (
      <div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Хадгалах"
          footer={null}
          width="700px"
          bodyStyle={{ padding: "30px" }}
        >
          <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <Form>
              <h3 style={{ marginBottom: "20px", fontSize: "12pt" }}>
                <b>
                  ГЭРЭЭС - АЖИЛ хүртэл(чиглэл, маршруут болон автобусны буудлын
                  нэр бичнэ)
                </b>
              </h3>
              <Row>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("GereesAjil", {
                    rules: required,
                    initialValue:
                      this.state.data &&
                      this.state.data.EmpDtl &&
                      this.state.data.EmpDtl.length > 0
                        ? this.state.data.EmpDtl[0].GereesAjil
                        : "",
                  })(
                    <TextArea
                      size="large"
                      style={{ fontSize: "12pt", fontFamily: "Arial" }}
                      placeholder="ГЭРЭЭС - АЖИЛ хүртэл(чиглэл, маршруут болон автобусны буудлын нэр бичнэ) "
                    />
                  )}
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "10px",
                    }}
                  >
                    Загварын текст: 13-р хороолол/Гэр/ - Бөхийн өргөө - Багшийн
                    дээд - Номын сан - ХААН Тауэр/АЖИЛ/
                  </p>
                </Form.Item>
              </Row>
              <Row>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("GereesAjil_time", {
                      rules: required,
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].GereesAjil_time
                          : "",
                    })(
                      <Input
                        size="large"
                        style={{ fontSize: "13pt", fontFamily: "Arial" }}
                        placeholder="замд зарцуулах хугацаа"
                      />
                    )}
                  </Form.Item>
                </Col>
                <p
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "270px",
                    color: "black",
                    fontSize: "16px",
                    fontFamily: "Arial",
                  }}
                >
                  минут
                </p>
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
                  <p style={{ marginBottom: "2px", fontSize: "14pt" }}>
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
