import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  Checkbox,
  Typography,
  Form,
  Spin,
  Row,
  Col,
  Card,
  notification,
  Tabs,
  Layout,
  TimePicker,
  DatePicker,
  Upload,
  Modal,
  Icon,
  Popconfirm,
} from "antd";
import "./InsuranceR.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Footer } = Layout;
const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";
const timeFormat = "HH:mm";

function getBase64(file, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};

class InsuranceR extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    var time = new Date(),
      todayT = time.getHours() + "-" + time.getMinutes();

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      baseData: undefined,
      todayT,
      loading: true,
      itemValid: false,
      editable: false,
      LoggedSysuser,
      cookieUser,
      today,
      bufferData: undefined,
      val: false,
      previewVisible: false,
      previewImage: "",
      visible: false,
      fileList: [],
      newFileList: [],
      CaseID: undefined,
      Imgname: undefined,
      check: false,
      newList: [],
    };
  }

  setInvoiceModeNormal() {
    this.setState({
      loading: false,
      invoiceMode: BaseInvoiceMode.Normal,
      bufferData: undefined,
    });
  }

  componentDidMount() {
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IS_177" }),
      })
      .then((res) => {
        const data = res.data;
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return;
        }
        this.setState({ baseData: res.data.retData, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }
  onPressEnterBarCode = (e) => {
    const CaseNo = this.props.form.getFieldValue("CaseNo");
    if (CaseNo) this.getData(CaseNo);
    else this.setInvoiceModeNormal();
  };

  addImage = (newFileList) => {
    this.setState((state) => {
      return {
        fileList: [...state.fileList, ...newFileList],
      };
    });
  };

  getData = (CaseNo) => {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    this.setState({ loading: true });
    var BusinessObject = [{ FieldName: "CaseNo", Value: CaseNo }];

    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: "IS_178", ModuleID: "IN", BusinessObject },
          replacer
        ),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          resetFields();
          setFieldsValue({ CaseNo: CaseNo });
          this.setInvoiceModeNormal();
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        const { Table } = res.data.retData;
        if (Table.length > 0) {
          let values = {};
          Object.keys(getFieldsValue()).forEach((key) => {
            switch (key) {
              case "CaseNo":
              case "CaseContact":
              case "CaseChanelType":
              case "ContactPhone":
              case "Status":
              case "CaseZipCode":
              case "CaseAddress":
              case "CaseReason":
              case "Descr":
              case "SheetNo":
              case "CaseAdviceID":
              case "ProductID":
              case "StateNumber":
              case "CaseStateNumber":
              case "Custom1":
              case "Custom2":
              case "Custom3":
              case "Custom4":
                values[key] = Table[0][key];
                break;
              default:
                if (key.includes("Date")) {
                  if (Table[0][key])
                    values[key] = moment(Table[0][key], dateFormat);
                  else values[key] = null;
                } else if (key.includes("Time")) {
                  if (Table[0][key])
                    values[key] = moment(Table[0][key], timeFormat);
                  else values[key] = null;
                } else if (values.ProductID === "0301") {
                  this.setState({ val: true, check: true });
                } else this.setState({ val: false, check: false });
                break;
            }
          });
          this.getImage(CaseNo).then((CasePics) => {
            const { fileList } = CasePics;
            setFieldsValue(values);
            this.setState({
              bufferData: res.data.retData,
              invoiceMode: BaseInvoiceMode.View,
              loading: false,
              itemValid: true,
              editable: Table[0].Status === "H",
              fileList,
            });
          });
        } else {
          resetFields();
          setFieldsValue({ CaseNo: CaseNo });
          this.setInvoiceModeNormal();
          notification["warning"]({
            message: "Мэдээлэл олдсонгүй.",
            description: "",
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        resetFields();
        notification["error"]({
          message: error.message,
          description: "",
        });
      });
  };
  handleOk = (e) => {
    const { newFileList, CaseID, bufferData } = this.state;
    this.setState({ loading: true });
    if (CaseID === undefined) {
      request
        .post("CasePics_Add", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            CaseNo: bufferData.Table[0].CaseNo,
            isCasePics: newFileList,
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
          notification["success"]({
            message: "Мэдээллийг амжилттай хадгаллаа",
            description: "",
          });
          this.addImage(newFileList);
          this.setState({
            visible: false,
            loading: false,
            newList: [],
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    } else {
      request
        .post("CasePics_Add", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            CaseNo: CaseID,
            isCasePics: newFileList,
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

          notification["success"]({
            message: "Мэдээллийг амжилттай хадгаллаа",
            description: "",
          });
          this.addImage(newFileList);
          this.setState({
            loading: false,
            visible: false,
            newList: [],
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    }
  };

  handleRemove = (file) => {
    this.setState({ loading: true });
    const { bufferData, CaseID } = this.state;
    if (bufferData === undefined) {
      request
        .post("CasePics_Delete", {
          token: this.state.LoggedSysuser.token,
          CaseNo: CaseID,
          file: file.name,
        })
        .then((res) => {
          if (res.data.retType !== 0) {
            notification["error"]({
              message: "Анхаар",
              description: res.data.retDesc,
            });
            return;
          }
          notification["success"]({
            message: "Мэдээллийг амжилттай устгалаа.",
            description: "",
          });
          this.setState({ loading: false });
          this.setState((state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    } else {
      request
        .post("CasePics_Delete", {
          token: this.state.LoggedSysuser.token,
          CaseNo: bufferData.Table[0].CaseNo,
          file: file.name,
        })
        .then((res) => {
          if (res.data.retType !== 0) {
            notification["error"]({
              message: "Анхаар",
              description: res.data.retDesc,
            });
            return;
          }
          notification["success"]({
            message: "Мэдээллийг амжилттай устгалаа.",
            description: "",
          });
          this.setState({ loading: false });
          this.setState((state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error(error);
        });
    }
  };

  getImage = (CaseNo) => {
    return request
      .post("CasePics_List", {
        token: this.state.LoggedSysuser.token,
        CaseNo,
      })
      .then((res) => {
        const data = res.data;
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return { fileList: [] };
        }
        return res.data.retData;
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
        return { fileList: [] };
      });
  };

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      Imgname: file.name,
    });
  };

  handleSubmit = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      const isCase = [];
      isCase.push(values);
      Object.keys(values).forEach((key) => {
        if (key.includes("Date"))
          isCase[0][key] = values[key].format(dateFormat);
        else if (key.includes("Time"))
          isCase[0][key] = values[key].format(timeFormat);
      });
      this.save(isCase);
    });
  };

  save = (isCase) => {
    this.setState({ loading: true });
    isCase.forEach((inv) => {
      if (inv.CaseNo === undefined) inv.RowStatus = "I";
      else if (inv.RowStatus !== "I") inv.RowStatus = "U";
      inv.CreatedProgID = "ERP";
      inv.CreatedUserName = this.state.cookieUser.UserName;
      inv.LastUserName = this.state.cookieUser.UserName;
      inv.IPAddress = "fe80:: ec2b: 66fa: 8bab: ba06 % 3";
      inv.MACAddress = "A4:1F:72:63:44:A1";
      if (inv.isNo === true) {
        return (
          inv.Custom1 ? inv.Custom1 : "",
          inv.Custom2 ? inv.Custom2 : "",
          inv.Custom3 ? inv.Custom3 : "",
          inv.Custom4 ? inv.Custom4 : ""
        );
      }
    });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IS_176",
          isCase,
          ModuleID: "IN",
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
        notification["success"]({
          message:
            res.data.retData &&
            res.data.retData.Table &&
            res.data.retData.Table[0] &&
            res.data.retData.Table[0].CaseNo +
              " " +
              "дугаартай дуудлагын мэдээллийг амжилттай хадгаллаа",
          description: "",
        });
        this.setState({
          invoiceMode: BaseInvoiceMode.View,
          loading: false,
          CaseID: res.data.retData.Table[0].CaseNo,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  onClickNew = () => {
    const { form } = this.props;
    const { CaseID, fileList } = this.state;
    this.setState({ loading: true });
    form.resetFields();
    if (CaseID) {
      this.setState({ CaseID: undefined });
    }
    this.setState({
      invoiceMode: BaseInvoiceMode.Add,
      loading: false,
      editable: true,
      val: false,
      fileList: [],
    });
  };

  onClick = () => {
    const { form } = this.props;
    this.setState({ loading: true });
    const { CaseID } = this.state;
    this.setState({ loading: true });
    form.resetFields();
    if (CaseID) {
      this.setState({ CaseID: undefined });
    }
    this.setState({
      invoiceMode: BaseInvoiceMode.Normal,
      loading: false,
      editable: true,
    });
  };

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };
  handleSelectChange = (value, option) => {
    this.props.form.setFieldsValue({
      CaseAddress: `${
        option &&
        option.props &&
        option.props.children &&
        option.props.children[2]
      }, ${
        option &&
        option.props &&
        option.props.children &&
        option.props.children[4]
      }`,
    });
  };
  handleChange = (e) => {
    if (e.target.checked === true) {
      this.setState({
        val: true,
      });
      this.props.form.setFieldsValue({
        ProductID: "0301",
      });
    } else {
      this.props.form.resetFields([
        "Custom1",
        "Custom2",
        "Custom3",
        "Custom4",
        "ProductID",
      ]);
      this.setState({
        val: false,
      });
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });
  handleRCancel = () => this.setState({ visible: false, newList: [] });

  handleRChange = (info) => {
    this.setState({
      newFileList: info.fileList.reduce((acc, file) => {
        if (file.originFileObj) {
          getBase64(file.originFileObj, (imageUrl) => {
            acc.push({
              name: file.name,
              url: imageUrl,
              uid: file.uid,
            });
          });
        } else {
          getBase64(file, (imageUrl) => {
            acc.push({
              name: file.name,
              url: imageUrl,
              uid: file.uid,
            });
          });
        }
        return acc;
      }, []),
    });
  };

  render() {
    const {
      baseData,
      bufferData,
      val,
      previewVisible,
      previewImage,
      fileList,
      CaseID,
      newFileList,
      Imgname,
      check,
      newList,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    const disabledActive =
      this.state.loading ||
      [BaseInvoiceMode.Add, BaseInvoiceMode.Edit].includes(
        this.state.invoiceMode
      );

    const formItemLayou = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 12 },
        xxl: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 12 },
        xxl: { span: 14 },
      },
      labelAlign: "left",
    };
    const formItem = {
      style: { marginBottom: "0px" },
    };
    const formItem1 = {
      style: { marginBottom: "0px", marginTop: "3px" },
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    const greaterThan = [
      {
        validator: (rule, value, callback) => {
          if (value >= 0) {
            callback();
            return;
          }
          callback("Тоон утга оруулах шаардлагатай.");
        },
        required: true,
      },
    ];
    const Iname = (
      <div>
        <Text>
          <b>{Imgname}</b>
        </Text>
      </div>
    );
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.newList.indexOf(file);
          const ff = state.newList.slice();
          ff.splice(index, 1);
          return {
            newList: ff,
            newFileList: ff,
          };
        });
      },

      beforeUpload: (file) => {
        this.setState((state) => ({
          newList: [...state.newList, file],
        }));
        return false;
      },
      newList,
    };

    return (
      <div style={{ margin: "15px" }}>
        <h3 style={{ marginBottom: "30px" }}>
          Даатгал / Бүртгэл / <Text color="#6b747b">Дуудлага бүртгэх</Text>
        </h3>
        <Layout>
          <Spin spinning={this.state.loading}>
            <Card>
              <Tabs defaultActiveKey="1" className="profile-tabs">
                <TabPane tab="Үндсэн" key="1">
                  <Form {...formItemLayou} className="stepF">
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Дуудлагын дугаар" {...formItem}>
                          {getFieldDecorator("CaseNo", {
                            initialValue: CaseID,
                          })(
                            <Input
                              onPressEnter={this.onPressEnterBarCode}
                              disabled={disabledActive}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          className={disabledEdit ? "back" : "disc"}
                          label={
                            <Button
                              shape="circle"
                              icon="plus"
                              onClick={this.onClickNew}
                              type="primary"
                            />
                          }
                          {...formItem}
                        ></Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Дуудлагын огноо" {...formItem}>
                          {getFieldDecorator("CaseDate", {
                            initialValue: moment(this.state.today, dateFormat),
                            rules: required,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: "100%" }}
                              allowClear={false}
                              format={dateFormat}
                              disabled={disabledEdit}
                              onChange={this.onChangeControls}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Дуудлагын цаг" {...formItem}>
                          {getFieldDecorator("CaseTime", {
                            initialValue: moment(this.state.todayT, timeFormat),
                            rules: required,
                          })(
                            <TimePicker
                              disabled={disabledEdit}
                              style={{ width: "100%" }}
                              format={timeFormat}
                              placeholder=""
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Дуудлага бүртгэсэн огноо"
                          {...formItem}
                        >
                          {getFieldDecorator("CaseRegDate", {
                            initialValue: moment(this.state.today, dateFormat),
                            rules: required,
                          })(
                            <DatePicker
                              placeholder=""
                              style={{ width: "100%" }}
                              allowClear={false}
                              format={dateFormat}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Дуудлагын цаг" {...formItem}>
                          {getFieldDecorator("CaseRegTime", {
                            initialValue: moment(this.state.todayT, timeFormat),
                            rules: required,
                          })(
                            <TimePicker
                              disabled={disabledEdit}
                              style={{ width: "100%" }}
                              format={timeFormat}
                              placeholder=""
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Мэдээлэгч" {...formItem}>
                          {getFieldDecorator("CaseContact", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Дуудлага өгсөн суваг" {...formItem}>
                          {getFieldDecorator("CaseChanelType", {
                            initialValue: "Утас",
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Тохиолдлын хаяг" {...formItem}>
                          {getFieldDecorator("CaseZipCode", {
                            rules: required,
                          })(
                            <Select
                              dropdownMatchSelectWidth={false}
                              onSelect={this.handleSelectChange}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table.map((item) => (
                                  <Option key={item.ZipCodeID}>
                                    {item.ZipCodeID}-{item.ZipCodeName}-
                                    {item.RegionName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item label={" "} {...formItem}>
                          {getFieldDecorator("CaseAddress", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Холбоо барих утас" {...formItem}>
                          {getFieldDecorator("ContactPhone", {
                            rules: greaterThan,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="Тохиолдлын төлөв" {...formItem}>
                          {getFieldDecorator("Status", {
                            initialValue:
                              baseData && baseData.Table1[5].ConstKey,
                          })(
                            <Select
                              onChange={this.onChangeControls}
                              disabled={true}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                            >
                              {baseData &&
                                baseData.Table1.map((item) => (
                                  <Option key={item.ConstKey}>
                                    {item.ConstKey} - {item.ValueStr1}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Тохиолдлын шалтгаан" {...formItem1}>
                          {getFieldDecorator("CaseReason")(
                            <TextArea
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Нэмэлт" {...formItem1}>
                          {getFieldDecorator("Descr")(
                            <TextArea
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Баталгааны дугаар" {...formItem}>
                          {getFieldDecorator("SheetNo")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Зөвлөмж" {...formItem}>
                          {getFieldDecorator("CaseAdviceID")(
                            <Select
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                            >
                              {baseData &&
                                baseData.Table3.map((item) => (
                                  <Option key={item.CaseAdviceID}>
                                    {item.CaseAdviceID} - {item.CaseAdviceDescr}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Бүтээгдэхүүний код" {...formItem}>
                          {getFieldDecorator("ProductID")(
                            <Select
                              dropdownMatchSelectWidth={false}
                              disabled={disabledEdit}
                              allowClear={true}
                              optionFilterProp="children"
                            >
                              {baseData &&
                                baseData.Table2.map((item) => (
                                  <Option key={item.ProductID}>
                                    {item.ProductID} - {item.ProductName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={12}
                        xl={12}
                        xxl={12}
                        style={{
                          textAlign: "left",
                        }}
                      >
                        <Form.Item
                          label={getFieldDecorator("isNo", {
                            valuePropName: "checked",
                            initialValue: check,
                          })(
                            <Checkbox
                              disabled={disabledEdit}
                              onChange={this.handleChange}
                            >
                              ТХ даатгал
                            </Checkbox>
                          )}
                          {...formItem}
                        ></Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Улсын дугаар" {...formItem}>
                          {getFieldDecorator("StateNumber", {
                            rules: [
                              {
                                pattern: /^\d{4}[А-ЯҮӨа-яүө]{3}$/g,
                                message: "Машин дугаараа оруулана уу.",
                              },
                            ],
                          })(
                            <Input
                              placeholder="1234УБВ"
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Хохирогчын мэдээлэл" {...formItem}>
                          {getFieldDecorator("CaseStateNumber")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Утга1"
                          style={{
                            marginBottom: "0px",
                            display: val ? "none" : "block",
                          }}
                        >
                          {getFieldDecorator("Custom1")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Утга2"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "none" : "block",
                          }}
                        >
                          {getFieldDecorator("Custom2")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Утга3"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "none" : "block",
                          }}
                        >
                          {getFieldDecorator("Custom3")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="Утга4"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "none" : "block",
                          }}
                        >
                          {getFieldDecorator("Custom4")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="ТХ-ийн ангилал"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "block" : "none",
                          }}
                        >
                          {getFieldDecorator("Custom1")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="ТХ-ийн марк"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "block" : "none",
                          }}
                        >
                          {getFieldDecorator("Custom2")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="ТХ-ийн улсын дугаар"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "block" : "none",
                          }}
                        >
                          {getFieldDecorator("Custom3", {
                            rules: [
                              {
                                pattern: /^\d{4}[А-ЯҮӨа-яүө]{3}$/g,
                                message: "Машин дугаараа оруулана уу.",
                              },
                            ],
                          })(
                            <Input
                              placeholder="1234УБВ"
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label="ТХ-ийн загвар"
                          {...formItem}
                          style={{
                            marginBottom: "0px",
                            display: val ? "block" : "none",
                          }}
                        >
                          {getFieldDecorator("Custom4")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Form>
                    <Form.Item
                      className={disabledEdit ? "disc" : "back"}
                      style={{
                        textAlign: "center",
                        background: "white",
                        margin: "0px",
                        padding: "0px",
                      }}
                    >
                      <Popconfirm
                        className="back"
                        title="Болих үйлдэл хийхдээ итгэлтэй байна уу?"
                        okText="Тийм"
                        cancelText="Үгүй"
                        onConfirm={this.onClick}
                        disabled={disabledEdit}
                      >
                        <Button disabled={disabledEdit} type="primary">
                          Болих
                        </Button>
                      </Popconfirm>
                      <Button
                        disabled={disabledEdit}
                        htmlType="submit"
                        onClick={this.handleSubmit}
                        type="primary"
                        style={{ margin: "20px" }}
                      >
                        Хадгалах
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="Зургийн мэдээлэл" key="3">
                  <div className="back">
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onRemove={this.handleRemove}
                    />
                    <Modal
                      title={Iname}
                      centered
                      width="55%"
                      visible={previewVisible}
                      footer={null}
                      onCancel={this.handleCancel}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal>
                    <Upload
                      {...props}
                      onChange={this.handleRChange}
                      name="file"
                      multiple={true}
                      fileList={newList}
                      listType="picture-card"
                    >
                      Нэмэх
                    </Upload>
                    <Button
                      type="primary"
                      onClick={this.handleOk}
                      style={{ width: "105px" }}
                    >
                      Хадгалах
                    </Button>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Spin>
        </Layout>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(InsuranceR);

export default class ContractSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container">
        <WrappedContractForm />
      </div>
    );
  }
}
