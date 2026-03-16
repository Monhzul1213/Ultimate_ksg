import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Modal,
  Row,
  Col,
  notification,
  Avatar,
  Spin,
  DatePicker,
  Upload,
  message,
  Icon,
} from "antd";
import React from "react";
import request from "./../insurance/PostRequest";
import cookie from "react-cookies";
import moment from "moment";
import "./ProfileFullEditModal.css";
import male from "@/image/male.png";
import female from "@/image/female.png";

const dateFormat = "YYYY.MM.DD";
const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load("LoggedSysuser");

    this.state = {
      data: props.data,
      visible: props.visible,
      loading: false,
      LoggedSysuser,
      profile_image: undefined,
    };
  }

  handleOk = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      console.log({ errors: errors });
      if (errors) return;

      this.setState({ loading: true });

      let EmpDtl = [...this.state.data.EmpDtl];

      if (EmpDtl.length === 0) EmpDtl.push({ RowStatus: "I" });
      else if (EmpDtl[0].RowStatus !== "I") EmpDtl[0].RowStatus = "U";

      Object.keys(values).forEach((key) => {
        if (moment.isMoment(values[key]))
          EmpDtl[0][key] = values[key].format(dateFormat);
        else EmpDtl[0][key] = values[key];
      });
      EmpDtl[0].profile_image = this.state.profile_image;
      request
        .post("Profile_Modify", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            BusinessObject: { ProfileType: "Profile" },
            EmpDtl,
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
          this.setState({ loading: false });
          notification["success"]({
            message: "",
            description: "Амжилттай хадгаллаа.",
          });

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

  handleChange = (info) => {
    getBase64(info.file.originFileObj, (imageUrl) =>
      this.setState({
        profile_image: imageUrl,
      })
    );
    info.file.status = "done";
  };

  render() {
    var EmpDtl;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    const formLayount = {
      labelCol: 24,
      wrapperCol: 24,
    };
    const dateFormat = "YYYY.MM.DD";
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];

    const columnConfig = {
      xs: { span: 24 }, //<576px
      sm: { span: 12 }, //≥576px
    };
    const uploadButton = (
      <div>
        <Button
          type="primary"
          style={{ background: "#e6e6e6", border: "none" }}
          shape="circle"
          icon="edit"
        />
        {/* <Icon type={this.state.loading ? 'loading' : 'edit'} /> */}
      </div>
    );

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
                style={{ marginBottom: "30px", fontSize: "16pt" }}
              >
                <b>Хувийн мэдээлэл</b>
              </h3>

              <Form.Item
                style={{ marginBottom: "140px" }}
                wrapperCol={{
                  xs: {
                    span: 24,
                    offset: 8,
                  },
                  sm: {
                    span: 24,
                    offset: 10,
                  },
                }}
              >
                <div style={{ position: "absolute" }}>
                  <div>
                    <Avatar
                      size={120}
                      icon={
                        <img
                          src={
                            this.state.data &&
                            this.state.data.EmpDtl &&
                            this.state.data.EmpDtl[0] &&
                            this.state.data.EmpDtl[0].Gender === "M"
                              ? male
                              : female
                          }
                        />
                      }
                      src={
                        this.state.profile_image
                          ? this.state.profile_image
                          : this.state.data &&
                            this.state.data.EmpDtl &&
                            this.state.data.EmpDtl.length > 0
                          ? request.host +
                            "avatars/" +
                            this.state.data.EmpDtl[0].EmpCode +
                            ".jpg?" +
                            Date.now()
                          : ""
                      }
                    />
                  </div>
                  <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                    <Upload
                      accept=".jpg"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={this.handleChange}
                    >
                      {" "}
                      <div> {uploadButton} </div>
                    </Upload>
                  </div>
                </div>
              </Form.Item>

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
                      Овог
                    </p>
                    {getFieldDecorator("EmpLName", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].EmpLName
                          : "",
                      rules: required,
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
                      Нэр
                    </p>
                    {getFieldDecorator("EmpFName", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].EmpFName
                          : "",
                      rules: required,
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
                      Last Name
                    </p>
                    {getFieldDecorator("LastName1", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].LastName1
                          : "",
                      rules: required,
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
                      First Name
                    </p>
                    {getFieldDecorator("FirstName1", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].FirstName1
                          : "",
                      rules: required,
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
                      Утасны дугаар
                    </p>
                    {getFieldDecorator("Phone", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].Phone
                          : "",
                      rules: required,
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
                      Ажлын имэйл хаяг
                    </p>
                    {getFieldDecorator("WorkMail", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].WorkMail
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
                      Төрсөн огноо
                    </p>
                    {getFieldDecorator("BirthDate", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl[0] &&
                        this.state.data.EmpDtl[0].BirthDate &&
                        moment(
                          this.state.data.EmpDtl[0].BirthDate,
                          "YYYY-MM-DDTHH:mm:ss.sssZ"
                        ),
                      rules: required,
                    })(
                      <DatePicker
                        placeholder="Төрсөн огноогоо оруулана уу."
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        format={dateFormat}
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
                      Хүйс
                    </p>
                    {getFieldDecorator("Gender", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].Gender
                          : "",
                      rules: required,
                    })(
                      <Select
                        size="large"
                        style={{
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                      >
                        {this.state.data &&
                          this.state.data.Gender &&
                          this.state.data.Gender.map((item, index) => (
                            <Option key={item.ConstKey}>
                              {item.ValueStr1}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item {...formItemLayout}>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "black",
                        fontSize: "16px",
                        fontFamily: "Arial",
                      }}
                    >
                      Хаяг
                    </p>
                    {getFieldDecorator("Addr1", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].Addr1
                          : "",
                      rules: required,
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
                      Компани
                    </p>
                    {getFieldDecorator("CpnyName", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].CpnyName
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
                      Хэлтэс
                    </p>
                    {getFieldDecorator("DepartmentDescr", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].DepartmentDescr
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
                      Албан тушаал
                    </p>
                    {getFieldDecorator("PosDescr", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].PosDescr
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
                      Ажилтны код
                    </p>
                    {getFieldDecorator("EmpCode", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].EmpCode
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
                      Ажилд орсон огноо
                    </p>
                    {getFieldDecorator("HireDate", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl[0] &&
                        this.state.data.EmpDtl[0].HireDate &&
                        moment(
                          this.state.data.EmpDtl[0].HireDate,
                          "YYYY-MM-DDTHH:mm:ss.sssZ"
                        ),
                    })(
                      <DatePicker
                        placeholder="Ажилд орсон огноо"
                        size="large"
                        style={{
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: "13pt",
                          fontFamily: "Arial",
                        }}
                        format={dateFormat}
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
                      Шууд удирдлага
                    </p>
                    {getFieldDecorator("LeaderEmpName", {
                      initialValue:
                        this.state.data &&
                        this.state.data.EmpDtl &&
                        this.state.data.EmpDtl.length > 0
                          ? this.state.data.EmpDtl[0].LeaderEmpName
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

export default class ProfileFullEdit extends React.Component {
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
