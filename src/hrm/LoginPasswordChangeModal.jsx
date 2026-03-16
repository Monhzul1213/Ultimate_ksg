import React from "react";
import {
  Typography,
  Card,
  Input,
  Row,
  Col,
  Form,
  Button,
  notification,
  Spin,
  Modal,
} from "antd";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";

const { Text } = Typography;

class LoginPasswordChange extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    console.log(".....................................", props.isNewPass);

    this.state = {
      visible: props.isNewPass == 0 ? true : false,
      loading: false,
      LoggedSysuser,
      confirmDirty: false,
      cookieUser,
      // passPolicyLen: 10,
      passwordRules: {
        length: false,
        upper: false,
        lower: false,
        digit: false,
      },
      passwordRulesConfirm: {
        length1: false,
        upper1: false,
        lower1: false,
        digit1: false,
      },
    };
  }

  // componentDidMount() {
  //   request
  //     .post("Execute_Query", {
  //       token: this.state.LoggedSysuser.token,
  //       cpnyID: "SLUL",
  //       json: JSON.stringify({ QueryID: "SM_WEB_01" }),
  //     })
  //     .then((res) => {
  //       const data = res.data;
  //       if (data.retType == 0) {
  //         this.setState({ passPolicyLen: data?.Table[6]?.ConfigValue });
  //         return;
  //       }
  //       this.setState({ passPolicyLen: 10, loading: false });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      this.setState({ loading: true });

      request
        .post("Get_PasswordChange", {
          token: this.state.LoggedSysuser.token,
          empCode: this.state.cookieUser.userID,
          loginPassNew: values.loginPassNew,
        })
        .then((res) => {
          this.setState({ loading: false });

          if (res.data.retType === "") {
            notification.error({
              message: "Анхаар",
              description: res.data.retDesc,
            });
            return;
          }

          notification.success({
            message: "Амжилттай хадгаллаа",
          });
          this.setState({ visible: false });
          this.handleClose();
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    });
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    // if (value && this.state.confirmDirty) {
    //   form.validateFields(["loginPassNew"], { force: true });
    // }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Нууц үг таарахгүй байна!");
    } else {
      callback();
    }
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleClose = () => {
    this.setState({ visible: false });
    if (this.props.onClose) this.props.onClose();
  };
  handlePasswordChange = (e) => {
    const value = e.target.value;

    const rules = {
      length: value.length >= this.state.passPolicyLen,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      digit: /\d/.test(value),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    this.setState({
      passwordRules: rules,
    });

    this.props.form.setFieldsValue({ password: value });
  };
  handlePasswordChangeConfirm = (e) => {
    const value = e.target.value;

    const rules = {
      length1: value.length >= this.state.passPolicyLen,
      upper1: /[A-Z]/.test(value),
      lower1: /[a-z]/.test(value),
      digit1: /\d/.test(value),
      symbol1: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    this.setState({
      passwordRulesConfirm: rules,
    });

    this.props.form.setFieldsValue({ loginPassNew: value });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, loading } = this.state;

    return (
      <Modal
        title="Нууц үг солих"
        visible={visible}
        // onCancel={this.handleClose}
        footer={null}
      >
        <Spin spinning={loading}>
          <Card>
            <Form layout="vertical">
              <Row gutter={12}>
                <Col span={24}>
                  <Form.Item label="Шинэ нууц үг" hasFeedback>
                    {getFieldDecorator("password")(
                      <Input.Password onChange={this.handlePasswordChange} />
                    )}
                    <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                      <li
                        style={{
                          color: this.state.passwordRules.length
                            ? "green"
                            : "red",
                        }}
                      >
                        Хамгийн багадаа {this.state.passPolicyLen} тэмдэгт
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRules.upper
                            ? "green"
                            : "red",
                        }}
                      >
                        Том үсэг агуулсан (A-Z)
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRules.lower
                            ? "green"
                            : "red",
                        }}
                      >
                        Жижиг үсэг агуулсан (a-z)
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRules.digit
                            ? "green"
                            : "red",
                        }}
                      >
                        Тоо агуулсан (1234567890)
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRules.symbol
                            ? "green"
                            : "red",
                        }}
                      >
                        Тэмдэгт агуулсан (!@#$%^&)
                      </li>
                    </ul>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Нууц үг баталгаажуулах" hasFeedback>
                    {getFieldDecorator("loginPassNew", {
                      rules: [
                        {
                          validator: this.compareToFirstPassword,
                        },
                      ],
                    })(
                      <Input.Password
                        onChange={this.handlePasswordChangeConfirm}
                      />
                    )}
                    <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                      <li
                        style={{
                          color: this.state.passwordRulesConfirm.length1
                            ? "green"
                            : "red",
                        }}
                      >
                        Хамгийн багадаа {this.state.passPolicyLen} тэмдэгт
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRulesConfirm.upper1
                            ? "green"
                            : "red",
                        }}
                      >
                        Том үсэг агуулсан (A-Z)
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRulesConfirm.lower1
                            ? "green"
                            : "red",
                        }}
                      >
                        Жижиг үсэг агуулсан (a-z)
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRulesConfirm.digit1
                            ? "green"
                            : "red",
                        }}
                      >
                        Тоо агуулсан (1234567890)
                      </li>
                      <li
                        style={{
                          color: this.state.passwordRulesConfirm.symbol1
                            ? "green"
                            : "red",
                        }}
                      >
                        Тэмдэгт агуулсан (!@#$%^&)
                      </li>
                    </ul>
                  </Form.Item>
                </Col>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button
                    onClick={this.handleSubmit}
                    type="primary"
                    loading={loading}
                  >
                    Хадгалах
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Spin>
      </Modal>
    );
  }
}

const WrappedLoginPasswordChange = Form.create()(LoginPasswordChange);
export default WrappedLoginPasswordChange;
