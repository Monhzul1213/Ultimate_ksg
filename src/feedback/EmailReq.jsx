import React from "react";
import {
  Typography,
  Card,
  Input,
  Row,
  Col,
  Form,
  Button,
  Upload,
  notification,
  Spin,
} from "antd";
import request from "./../insurance/PostRequest";
import "./EmailReq.css";
import cookie from "react-cookies";
import { ExcelRenderer } from "react-excel-renderer";

const { Text } = Typography;
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
      profile_image: undefined,
      queryID: "Web_hrEmail",
    };
  }

  handleSubmit = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      const hrWorkMail = [];
      hrWorkMail.push(values);
      request
        .post("Execute_Query", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({ QueryID: this.state.queryID, hrWorkMail }),
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLayount = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      labelAlign: "left",
    };
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    return (
      <div style={{ margin: "27px" }}>
        <h3>Мэйл бүртгэх</h3>
        <h4 style={{ marginBottom: "25px" }}>
          Хүний нөөц / Хүсэлт / <Text color="#6b747b">Мэйл бүртгэх</Text>
        </h4>
        <div>
          <Spin spinning={this.state.loading}>
            <Card>
              <Form {...formLayount}>
                <Row gutter={12}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                    <Form.Item
                      label="Ажилтны код"
                      {...formItemLayout}
                      className="step-for"
                    >
                      {getFieldDecorator("EmpCode", { rules: required })(
                        <Input />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                    <Form.Item
                      label="Ажилтны нэр"
                      {...formItemLayout}
                      className="step-for"
                    >
                      {getFieldDecorator("EmpName", { rules: required })(
                        <Input />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                    <Form.Item
                      label="И-мэйл"
                      {...formItemLayout}
                      className="step-for"
                    >
                      {getFieldDecorator("WorkMail", { rules: required })(
                        <Input />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                    <Button
                      onClick={this.handleSubmit}
                      type="primary"
                      style={{
                        fontWeight: "bold",
                        background: "#0A5287",
                        borderWidth: "0px",
                        width: "100%",
                        marginTop: "4px",
                      }}
                    >
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
  }
}
const EditableFormTable = Form.create()(Dashboard);
export default EditableFormTable;
