import React from "react";
import "antd/dist/antd.css";
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  notification,
  Select,
  Modal,
} from "antd";
import "./Login.css";
import Axios from "axios";
import cookie from "react-cookies";
import { BankOutlined } from "@ant-design/icons";
import request from "./../insurance/PostRequest";

const { Option } = Select;

class NormalLoginForm extends React.Component {
  state = {
    user: "",
    pass: "",
    companydata: [],
    companyId: "",

    // ✅ forgot password states
    modalVisible: false,
    okLoading: false,
    username: "",
    loading: false,
  };

  componentDidMount() {
    cookie.remove("LoggedSysuser", { path: "/" });

    // Axios.get("https://app.lotteriahr.mn/get_inPICount.asmx/Get_Config")
    Axios.get("https://app.khangroup.mn/get_inPICount.asmx/Get_Config")

      .then((response) => {
        const ret = response && response.data && response.data.retData;
        const data = ret && ret.BusinessObject ? ret.BusinessObject : [];
        this.setState({ companydata: data });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ companydata: [] });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (err) return;

      cookie.save("username", this.state.user, { path: "/" });
      cookie.setRawCookie("EmpCode", null);
      cookie.setRawCookie("UserID", null);

      this.props.onSuccess(
        e,
        this.state.user,
        this.state.pass,
        values.CpnyID,
        this.state.companydata,
      );
    });
  };

  // ✅ Forgot password modal show/hide
  showModal = () => {
    this.setState({ modalVisible: true, username: "" });
  };

  hideModal = () => {
    this.setState({ modalVisible: false, username: "" });
  };

  // ✅ Forgot password send
  emailSend = () => {
    const uid = (this.state.username || "").trim();

    if (!uid) {
      notification.error({
        message: "Анхаар",
        description: "Нэвтрэх нэр оруулна уу.",
      });
      return;
    }

    this.setState({ okLoading: true, loading: true });

    request
      .post("Login", {
        token: "",
        Name: "Price",
        Password: 'Price123',
        device: navigator.userAgent.replace(/;/g, ""),
      })
      .then((loginRes) => {
        const token =
          loginRes &&
          loginRes.data &&
          loginRes.data.retData &&
          loginRes.data.retData.LoggedSysuser
            ? loginRes.data.retData.LoggedSysuser.token
            : null;

        return request.post("ForgetPassword", {
          token: token,
          UserID: uid,
        });
      })
      .then((res) => {
        const data = res.data;

        if (data.retType !== 0) {
          notification.error({
            message: "Анхаар",
            description: data.retDesc,
          });
          this.setState({ okLoading: false, loading: false });
          return;
        }

        notification.success({
          message: "Амжилттай",
          description: data.retDesc,
        });

        this.setState({
          okLoading: false,
          loading: false,
          modalVisible: false,
          username: "",
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ okLoading: false, loading: false });
        notification.error({
          message: "Алдаа",
          description: "Сэргээх үед алдаа гарлаа.",
        });
      });
  };

  render() {
    const { companydata, modalVisible, okLoading, username } = this.state;
    const { getFieldDecorator, getFieldError, isFieldTouched } =
      this.props.form;

    const cpnyTouched = isFieldTouched("CpnyID");
    const cpnyError = getFieldError("CpnyID");
    const hasCpnyError = !!(cpnyTouched && cpnyError);

    return (
      <>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item
            className="select-fontsize1"
            validateStatus={hasCpnyError ? "error" : undefined}
            help={hasCpnyError ? cpnyError[0] : undefined}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: hasCpnyError ? "#ff4d4f" : "#d9d9d9",
                borderRadius: 4,
                padding: "0 8px",
                height: 60,
              }}
            >
              <BankOutlined
                style={{
                  fontSize: "13pt",
                  margin: 10,
                  color: "rgb(85, 85, 85)",
                }}
              />
              {getFieldDecorator("CpnyID", {
                rules: [{ required: true, message: "Компани сонгоно уу!" }],
                validateTrigger: "onChange",
              })(
                <Select
                  placeholder={"Компани"}
                  size="large"
                  dropdownMatchSelectWidth={false}
                  style={{ flex: 1, border: "none", boxShadow: "none" }}
                  allowClear
                  onChange={(value) => this.setState({ companyId: value })}
                >
                  {companydata.map((item) => (
                    <Option key={item.CpnyID} value={item.CpnyID}>
                      {item.CompanyName}
                    </Option>
                  ))}
                </Select>,
              )}
            </div>
          </Form.Item>

          <Form.Item>
            {getFieldDecorator("username")(
              <Input
                onChange={(a) => this.setState({ user: a.target.value })}
                style={{ height: "60px" }}
                prefix={
                  <Icon
                    type="user"
                    style={{ fontSize: "13pt", color: "#555555" }}
                  />
                }
                placeholder="Имэйл, утас, эсвэл ажилтны код"
              />,
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator("password")(
              <Input
                onChange={(a) => this.setState({ pass: a.target.value })}
                style={{ height: "60px" }}
                prefix={
                  <Icon
                    type="lock"
                    style={{ fontSize: "13pt", color: "#555555" }}
                  />
                }
                type="password"
                placeholder="Нууц үг"
              />,
            )}
          </Form.Item>

          <Checkbox style={{ fontFamily: "Arial", fontSize: "13pt" }}>
            Намайг сана
          </Checkbox>

          <a
            style={{ fontFamily: "Arial", fontSize: "13pt" }}
            className="login-form-forgot"
            onClick={this.showModal}
          >
            Нууц үг мартсан
          </a>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="LoginButtonCss"
              style={{
                height: "60px",
                marginTop: "20px",
                fontFamily: "Arial",
                fontSize: "13pt",
                fontWeight: "bold",
                backgroundColor: "#0A5287",
              }}
            >
              Нэвтрэх
            </Button>
          </Form.Item>
        </Form>

        {/* ✅ Forgot password modal */}
        <Modal
          title="Нууц үг сэргээх"
          visible={modalVisible}
          onOk={this.emailSend}
          onCancel={this.hideModal}
          okText="Сэргээх"
          cancelText="Болих"
          confirmLoading={okLoading}
        >
          <label>Нэвтрэх нэр</label>
          <Input
            placeholder="Нэвтрэх нэр оруулна уу..."
            style={{ marginTop: "10px" }}
            value={username}
            onChange={(e) => this.setState({ username: e.target.value })}
          />
        </Modal>
      </>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
  NormalLoginForm,
);
export default WrappedNormalLoginForm;
