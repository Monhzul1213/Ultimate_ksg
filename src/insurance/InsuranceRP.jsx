import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  Typography,
  Form,
  Spin,
  Row,
  Col,
  Card,
  notification,
  Tabs,
  TimePicker,
  DatePicker,
  Upload,
  Modal,
  Icon,
  Popconfirm,
} from "antd";
import "./InsuranceRP.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import Table1 from "./Table1";
import Table2 from "./Table2";
import Table3 from "./Table3";
import Table4 from "./Table4";
import Table5 from "./Table5";
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
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

class InsuranceRP extends React.Component {
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
      fetching: false,
      bufferData: [],
      errorMessage: null,
      previewVisible: false,
      previewImage: "",
      visible: false,
      fileList: [],
      newFileList: [],
      CaseID: undefined,
      tableData: [],
      tDisabled: true,
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
              case "CaseZipCode":
              case "CaseAddress":
              case "CaseReason":
              case "Descr":
              case "SheetNo":
              case "CaseAdviceID":
              case "ProductID":
              case "StateNumber":
              case "CaseStateNumber":
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
                } else values[key] = Table[0][key];
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
              tDisabled: false,
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
  setTableData = (objName, tableData) => {
    this.setState((state) => {
      const { bufferData } = state;
      bufferData[objName] = tableData;
      return {
        bufferData,
      };
    });
  };

  handleOk = (e) => {
    const { newFileList, CaseID, bufferData } = this.state;
    console.log(bufferData);
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
          this.setState({ loading: false, newList: [], visible: false });
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
          this.setState({ loading: false, visible: false, newList: [] });
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
    });
    const { bufferData } = this.state;
    var isCaseDmgInvt = bufferData.Table2;
    var isCaseDmgAbility = bufferData.Table3;
    var isCaseDmgLife = bufferData.Table4;
    var isCaseDmgHealth = bufferData.Table5;
    var isCaseDmgCash = bufferData.Table6;
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IS_305",
          ModuleID: "IN",
          isCase,
          isCaseDmgInvt,
          isCaseDmgAbility,
          isCaseDmgLife,
          isCaseDmgHealth,
          isCaseDmgCash,
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
          loading: false,
          invoiceMode: BaseInvoiceMode.View,
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
    const { bufferData, CaseID } = this.state;
    this.setState({ loading: true });
    form.resetFields();
    if (CaseID) {
      this.setState({ CaseID: undefined });
    }
    if (bufferData) {
      bufferData.Table2 = [];
      bufferData.Table3 = [];
      bufferData.Table4 = [];
      bufferData.Table5 = [];
      bufferData.Table6 = [];
    }
    this.setState({
      invoiceMode: BaseInvoiceMode.Add,
      loading: false,
      editable: true,
      bufferData,
      fileList: [],
      tDisabled: false,
    });
  };

  onClick = () => {
    const { form } = this.props;
    const { CaseID, bufferData } = this.state;
    this.setState({ loading: true });
    form.resetFields();
    if (CaseID) {
      this.setState({ CaseID: undefined });
    }
    if (bufferData) {
      bufferData.Table2 = [];
      bufferData.Table3 = [];
      bufferData.Table4 = [];
      bufferData.Table5 = [];
      bufferData.Table6 = [];
    }
    this.setState({
      invoiceMode: BaseInvoiceMode.Normal,
      loading: false,
      editable: true,
      tDisabled: true,
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

  handleCancel = () => this.setState({ previewVisible: false });
  handleRCancel = () => this.setState({ visible: false });

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

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  render() {
    const {
      baseData,
      bufferData,
      previewVisible,
      previewImage,
      fileList,
      cookieUser,
      CaseID,
      newFileList,
      newList,
      tDisabled,
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
        xl: { span: 24 },
        xxl: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
        xl: { span: 24 },
        xxl: { span: 12 },
      },
      labelAlign: "left",
    };
    const formItem = {
      style: { marginBottom: "0px" },
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
        <Spin spinning={this.state.loading}>
          <Card>
            <Tabs defaultActiveKey="1" className="profile-tabs">
              <TabPane tab="Үндсэн" key="1">
                <Form className="stepF" {...formItemLayou}>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Дуудлагын дугаар :" {...formItem}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item className="backr" label="-" {...formItem}>
                        <Button
                          shape="circle"
                          icon="plus"
                          onClick={this.onClickNew}
                          type="primary"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Тохиолдлын огноо :" {...formItem}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Тохиолдлын цаг :" {...formItem}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item
                        label="Тохиолдол бүртгэсэн огноо :"
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Салбар :" {...formItem}>
                        {getFieldDecorator("SiteID", {
                          initialValue: cookieUser && cookieUser.SiteID,
                          rules: required,
                        })(
                          <Select
                            onChange={this.onChangeControls}
                            disabled={disabledEdit}
                            allowClear={true}
                            showSearch
                            optionFilterProp="children"
                          >
                            {baseData &&
                              baseData.Table4.map((item) => (
                                <Option key={item.SiteID}>
                                  {item.SiteID} - {item.Name}
                                </Option>
                              ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Мэдээлэгч :" {...formItem}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Холбоо барих утас :" {...formItem}>
                        {getFieldDecorator("ContactPhone", {
                          rules: greaterThan,
                        })(
                          <Input
                            onChange={this.onChangeControls}
                            disabled={disabledEdit}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Тохиолдлын төлөв :" {...formItem}>
                        {getFieldDecorator("Status", {
                          initialValue: baseData && baseData.Table1[2].ConstKey,
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Тохиолдлын хаяг :" {...formItem}>
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
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="-" {...formItem}>
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
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Тохиолдлын шалтгаан" {...formItem}>
                        {getFieldDecorator("CaseReason")(
                          <TextArea
                            onChange={this.onChangeControls}
                            disabled={disabledEdit}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Нэмэлт" {...formItem}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Баталгааны дугаар" {...formItem}>
                        {getFieldDecorator("SheetNo")(
                          <Input
                            onChange={this.onChangeControls}
                            disabled={disabledEdit}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Бүтээгдэхүүний код" {...formItem}>
                        {getFieldDecorator("ProductID")(
                          <Select
                            dropdownMatchSelectWidth={false}
                            onChange={this.onChangeControls}
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
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
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
                            onChange={this.onChangeControls}
                            disabled={disabledEdit}
                            placeholder="1234УБВ"
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <Form.Item label="Хохирогчийн улсын дугаар" {...formItem}>
                        {getFieldDecorator("CaseStateNumber", {
                          rules: [
                            {
                              pattern: /^\d{4}[А-ЯҮӨа-яүө]{3}$/g,
                              message: "Машин дугаараа оруулана уу.",
                            },
                          ],
                        })(
                          <Input
                            onChange={this.onChangeControls}
                            disabled={disabledEdit}
                            placeholder="1234УБВ"
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Form>
                  <Tabs defaultActiveKey="1" tabPosition="left">
                    <TabPane tab="Эд хөрөнгө" key="1">
                      <Table1
                        tableData={bufferData && bufferData.Table2}
                        tableD={bufferData && bufferData.Table}
                        setTableData={this.setTableData}
                        tD={tDisabled}
                      />
                    </TabPane>
                    <TabPane tab="Хөдөлмөрийн чадвар алдалт" key="2">
                      <Table2
                        tableData={bufferData && bufferData.Table3}
                        setTableData={this.setTableData}
                        tableDData={baseData && baseData.Table5}
                        tableDData1={baseData && baseData.Table}
                        tD={tDisabled}
                      />
                    </TabPane>
                    <TabPane tab="Амь нас" key="3">
                      <Table3
                        tableData={bufferData && bufferData.Table4}
                        setTableData={this.setTableData}
                        tableDData={baseData && baseData.Table5}
                        tableDData1={baseData && baseData.Table}
                        tD={tDisabled}
                      />
                    </TabPane>
                    <TabPane tab="Эрүүл мэнд" key="4">
                      <Table4
                        tableData={bufferData && bufferData.Table5}
                        setTableData={this.setTableData}
                        tableDData={baseData && baseData.Table5}
                        tableDData1={baseData && baseData.Table}
                        tD={tDisabled}
                      />
                    </TabPane>
                    <TabPane tab="Мөнгө хөрөнгө" key="5">
                      <Table5
                        tableData={bufferData && bufferData.Table6}
                        setTableData={this.setTableData}
                        tableDData={baseData && baseData.Table5}
                        tableDData1={baseData && baseData.Table}
                        tD={tDisabled}
                      />
                    </TabPane>
                  </Tabs>
                </Form>
                <Form>
                  <Form.Item
                    className={disabledEdit ? "dis" : "backr"}
                    style={{
                      textAlign: "center",
                      background: "white",
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    <Popconfirm
                      title="Болих үйлдэл хийхдээ итгэлтэй байна уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={this.onClick}
                      disabled={disabledEdit}
                    >
                      <Button type="primary" disabled={disabledEdit}>
                        Болих
                      </Button>
                    </Popconfirm>
                    <Button
                      disabled={disabledEdit}
                      htmlType="submit"
                      type="primary"
                      onClick={this.handleSubmit}
                      style={{ margin: "20px" }}
                    >
                      Хадгалах
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Зургийн мэдээлэл" key="3">
                <div className="backr">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onRemove={this.handleRemove}
                  />
                  <Modal
                    width="60vw"
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
                    listType="picture-card"
                    onChange={this.handleRChange}
                    multiple={true}
                    fileList={newList}
                    name="file"
                    {...props}
                  >
                    Зураг нэмэх
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
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(InsuranceRP);

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
