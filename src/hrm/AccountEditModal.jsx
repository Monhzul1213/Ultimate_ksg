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
import "./AccountEditModal.css";

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
      request
        .post("Profile_Modify", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            BusinessObject: { ProfileType: "Account" },
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
    const formLayount = {
      labelCol: 24,
      wrapperCol: 24,
    };

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
          width="800px"
          bodyStyle={{ padding: "30px" }}
        >
          <Spin spinning={this.state.loading} style={{ height: "100%" }}>
            <Form {...formLayount}>
              <h3
                align="center"
                style={{ marginBottom: "20px", fontSize: "16pt" }}
              >
                <b>Цалингийн данс, даатгал</b>
              </h3>

              <Row gutter={35} type="flex">
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Банкны нэр
                    </p>
                    {getFieldDecorator("BankName", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].BankName
                          : "",
                    })(
                      <Input
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Дансны дугаар
                    </p>
                    {getFieldDecorator("CardNumber", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].CardNumber
                          : "",
                    })(
                      <Input
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={35} type="flex">
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Даатгуулагчийн төрөл
                    </p>
                    <div className="select-fontsize">
                      {getFieldDecorator("NDSHTypeID", {
                        initialValue:
                          this.state.data &&
                          this.state.data.EmpDtl &&
                          this.state.data.EmpDtl.length > 0
                            ? this.state.data.EmpDtl[0].NDSHTypeID
                            : "",
                      })(
                        <Select
                          size="large"
                          style={{ marginBottom: "8px" }}
                          disabled
                        >
                          {this.state.data &&
                            this.state.data.NDSHType &&
                            this.state.data.NDSHType.map((item, index) => (
                              <Option key={item.NDSHTypeID}>
                                {item.Descr}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </div>
                  </Form.Item>
                </Col>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      НД дэвтрийн дугаар
                    </p>
                    {getFieldDecorator("NDDNumber", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].NDDNumber
                          : "",
                    })(
                      <Input
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={35} type="flex">
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      ЭМД дэвтрийн дугаар
                    </p>
                    {getFieldDecorator("EMDNumber", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].EMDNumber
                          : "",
                    })(
                      <Input
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...columnConfig}>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Хувийн имэйл хаяг
                    </p>
                    {getFieldDecorator("Email", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].Email
                          : "",
                    })(
                      <Input
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
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
                      background: "#0A5287",
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

export default class TsalinEdit extends React.Component {
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
