import React, { Component } from "react";
import {
  Input,
  Button,
  Select,
  Checkbox,
  Radio,
  Typography,
  Form,
  Spin,
  Row,
  Col,
  Card,
  notification,
  Upload,
  Tabs,
  InputNumber,
  DatePicker,
  Layout,
  Modal
} from "antd";
import "./BQuits.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import BHistory from "./BHistory";
import BDamage from "./BDamage";
import Comput from "./BComput";
import NTImage from "./B_NTImage";
import Control from "./Control";
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const dateFormat = "YYYY.MM.DD";
const timeFormat = "HH:mm";
const { Footer } = Layout;
const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};
function getBase64(file, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}
class Insurance extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    var time = new Date(),
      todayT = time.getHours() + "-" + time.getMinutes();
    this.next = this.next.bind(this);
    this.tab = this.tab.bind(this);
    this.prev = this.prev.bind(this);

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      baseData: undefined,
      todayT,
      loading: false,
      itemValid: false,
      editable: false,
      LoggedSysuser,
      cookieUser,
      today,
      fetching: false,
      bufferData: undefined,
      errorMessage: null,
      previewVisible: false,
      previewImage: "",
      visible: false,
      fileList: [],
      newFileList: [],
      val: false,
      tab: "1",
      current: 0,
      newList: [],
      testData: {},
      testData1: {},
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
        json: JSON.stringify({ QueryID: "IS_182" }),
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
    const IndemnityNo = this.props.form.getFieldValue("IndemnityNo");
    if (IndemnityNo) this.getData(IndemnityNo);
    else this.setInvoiceModeNormal();
  };

  getData = (IndemnityNo) => {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    this.setState({ loading: true });
    var BusinessObject = [{ FieldName: "IndemnityNo", Value: IndemnityNo }];

    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: "IS_181", ModuleID: "IN", BusinessObject },
          replacer
        ),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          resetFields();
          setFieldsValue({ IndemnityNo: IndemnityNo });
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
              case "IndemnityNo":
              case "CaseNo":
              case "ProductID":
              case "EmpCode":
              case "SheetNo":
              case "ContractNo":
              case "CaseChanelType":
              case "CustID":
              case "AgentID":
              case "Status":
              case "RiskID":
              case "DescrStatus":
              case "RiskNote":
              case "IndemLastName":
              case "IndemFirstName":
              case "IndemRegNo":
              case "IndemAddress":
              case "IndemPhone":
              case "CaseLastName":
              case "CaseFirstName":
              case "CaseRegNo":
              case "CaseAddress":
              case "CasePhone":
              case "RequiredAmt":
              case "CalculateAmt":
              case "SolvedAmt":
              case "OrderNo":
              case "CaseStateNumber":
              case "VoidDescr":
              case "PaidAmt":
                values[key] = Table[0][key];
                break;
              case "IsCaseEmp":
              case "IsRequired":
              case "IsCollectMaterial":
              case "IsNavigated":
                values[key] = Table[0][key] === "Y";
            }
          });
          this.getImage(IndemnityNo).then((CasePics) => {
            const { fileList } = CasePics;
            setFieldsValue(values);
            this.setState({
              bufferData: res.data.retData,
              invoiceMode: BaseInvoiceMode.View,
              loading: false,
              itemValid: true,
               editable: Table[0].Status !== "V",
              fileList,
              tDisabled: false,
            });
          });
        } else {
          resetFields();
          setFieldsValue({ IndemnityNo: IndemnityNo });
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
          message: "Нөхөн төлбөрийн дугаар олдсонгүй.",
          description: "",
        });
      });
  };
 getImage = (IndemnityNo) => {
    return request
      .post("CasePics_List", {
        token: this.state.LoggedSysuser.token,
        IndemnityNo,
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

  handleSubmit = (e) => {
    const { form } = this.props;
    form.validateFields((errors, values) => {
      if (errors) return;
      const isIndemnity = [];
      isIndemnity.push(values);
      Object.keys(values).forEach((key) => {
        if (key.includes("Date"))
          isIndemnity[0][key] = values[key].format(dateFormat);
        else if (key.includes("Time"))
          isIndemnity[0][key] = values[key].format(timeFormat);
      });
      this.save(isIndemnity);
    });
  };

  save = (isIndemnity) => {
    this.setState({ loading: true });
    isIndemnity.forEach((ind) => {
      if (ind.IndemnityNo === undefined) ind.RowStatus = "I";
      else if (ind.RowStatus !== "I") ind.RowStatus = "U";
      ind.CreatedUserName = this.state.cookieUser.UserName;
      ind.LastUserName = this.state.cookieUser.UserName;
      ind.IsCaseEmp =
        ind.IsCaseEmp === "Y" || ind.IsCaseEmp === true ? "Y" : "N";
      ind.IsRequired =
        ind.IsRequired === "Y" || ind.IsRequired === true ? "Y" : "N";
      ind.IsCollectMaterial =
        ind.IsCollectMaterial === "Y" || ind.IsCollectMaterial === true
          ? "Y"
          : "N";
      ind.IsNavigated =
        ind.IsNavigated === "Y" || ind.IsNavigated === true ? "Y" : "N";
    });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({
          QueryID: "IS_036",
          isIndemnity,
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
          message: "Мэдээллийг амжилттай хадгаллаа",
          description: "",
        });
        this.setState({
          invoiceMode: BaseInvoiceMode.Add,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  onClickNew = () => {
    const { form } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    this.setState({
      invoiceMode: BaseInvoiceMode.Add,
      loading: false,
      editable: true,
      fileList: [],
    });
  };
    addImage = (newFileList) => {
    this.setState((state) => {
      return {
        fileList: [...state.fileList, ...newFileList],
      };
    });
  };

  handleRemove = (file) => {
    this.setState({ loading: true });
    const { bufferData, CaseID } = this.state;
    if (bufferData === undefined) {
      request
        .post("CasePics_Delete", {
          token: this.state.LoggedSysuser.token,
          IndemnityNo: CaseID,
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
          IndemnityNo: bufferData.Table[0].IndemnityNo,
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

  next() {
    this.setState({
      tab: Math.min(6, parseInt(this.state.tab) + 1).toString(),
    });
  }

  tab(key) {
    this.setState({ tab: key });
  }

  prev() {
    this.setState({
      tab: Math.max(1, parseInt(this.state.tab) - 1).toString(),
    });
  }
  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });
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

    handleOk = (e) => {
    const { newFileList, CaseID, bufferData } = this.state;
    this.setState({ loading: true });
    if (CaseID === undefined) {
      request
        .post("CasePics_Add", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            IndemnityNo: bufferData.Table[0].IndemnityNo,
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
            IndemnityNo: CaseID,
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
 
   onChange1 = (e, record) => {
      this.props.form.setFieldsValue({
        AgentID:  record.props.children[4],
        SheetNo:  record.props.children[8],
        CustID:  record.props.children[2],
        ContractAmt:  record.props.children[10], 
        ProductID:  record.props.children[12]
      });
     this.setState({ testData:  record.props.children[12], testData1: record.props.children[8] });
  };
    onClick = () => {
    const { form } = this.props;
    this.setState({ loading: true });
    form.resetFields();
    this.setState({
      invoiceMode: BaseInvoiceMode.Normal,
      loading: false,
      editable: true,
    });
  };

  render() {
    const { baseData,bufferData,previewVisible,previewImage,newList,fileList,cookieUser, testData, testData1 } = this.state;
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
    const formLayount = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 18 },
        xl: { span: 12 },
        xxl: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 18 },
        xl: { span: 12 },
        xxl: { span: 14 },
      },
      labelAlign: "left",
    };
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };

    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
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
      <div style={{ margin: "27px" }}>
        <h3 style={{ marginBottom: "25px" }}>
          Даатгал / Бүртгэл / <Text color="#6b747b">Нөхөн төлбөр</Text>
        </h3>
        <Layout>
          <Spin spinning={this.state.loading}>
            <Card>
              <Tabs
                defaultActiveKey="1"
                activeKey={this.state.tab}
                onNextClick={this.next}
                onTabClick={this.tab}
                onPrevClick={this.prev}
              >
                <TabPane tab="Бүрдүүлэлт" key="1">
                  <Form {...formLayount} className="step-for">
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Нөхөн төлбөр дугаар"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("IndemnityNo")(
                            <Input
                              onPressEnter={this.onPressEnterBarCode}
                              disabled={disabledActive}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col
                        xs={3}
                        sm={3}
                        md={3}
                        lg={2}
                        xl={1}
                        style={{ textAlign: "right", marginTop: "3px" }}
                      >
                        <Button
                          shape="circle"
                          icon="plus"
                          onClick={this.onClickNew}
                          type="primary"
                        />
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Тохиолдлын дугаар"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("CaseNo", {
                            rules: required,
                          })(
                             <Select
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table4.map((item) => (
                                  <Option key={item.CaseNo}>
                                    {item.CaseNo} - {item.CaseName}
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
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Бүтээгдэхүүн" {...formItemLayout}>
                          {getFieldDecorator("ProductID", {
                            rules: required,
                          })(
                               <Select
                              dropdownMatchSelectWidth={false}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table5.map((item) => (
                                  <Option key={item.ProductID}>
                                    {item.ProductID} - {item.ProductName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item label="Мэргэжилтэн" {...formItemLayout}>
                          {getFieldDecorator("EmpCode", {
                             initialValue: cookieUser.EmpFLName,
                            rules: required,
                          })(
                               <Select
                              dropdownMatchSelectWidth={false}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table1.map((item) => (
                                  <Option key={item.EmpCode}>
                                    {item.EmpCode} - {item.EmpName}
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
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item
                          label="Баталгааны дугаар"
                          {...formItemLayout}
                        >
                             <Row gutter={8}>
            <Col span={12}>
             {getFieldDecorator("SheetNo", {
                            rules: required,
                          })(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
            </Col>
            <Col span={12}>
                {getFieldDecorator("ContractAmt", {
                            rules: required,
                          })(
                            <InputNumber
                              style={{ width: "100%"}}
                              onChange={this.onChangeControls}
                              min={0}
                              precision={2}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              disabled={disabledEdit}
                            />
                          )}
            </Col>
          </Row>
                         
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item label="Гэрээний дугаар" {...formItemLayout}>
                          {getFieldDecorator("ContractNo", {
                            rules: required,
                          })(
                               <Select
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                               onChange={this.onChange1}
                          >
                              {baseData &&
                                baseData.Table3.map((item) => (
                                  <Option key={item.ContractNo}>
                                    {item.ContractNo} - {item.CustID} - {item.AgentID} - {item.ProductID} - {item.SheetNo} - {item.PaidAmt} - {item.ProductID}
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
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item label="Нэмэлт баталгаа" {...formItemLayout}>
                          {getFieldDecorator("CaseChanelType", {
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
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Даатгуулагч"
                          style={{ marginBottom: "1px" }}
                        >
                          {getFieldDecorator("CustID", {
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
                        lg={24}
                        xl={18}
                        xxl={12}
                        style={{ textAlign: "right" }}
                      >
                        <Form.Item
                          label="Төлөөлөгч"
                          style={{ marginBottom: "1px" }}
                        >
                          {getFieldDecorator("AgentID", {
                            rules: required,
                          })(
                               <Select
                              dropdownMatchSelectWidth={false}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table2.map((item) => (
                                  <Option key={item.AgentID}>
                                    {item.AgentID} - {item.AgentFName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="НТ Төлөв"
                          style={{ marginBottom: "3px" }}
                        >
                          {getFieldDecorator("Status", {
                            initialValue: baseData && baseData.Table[5].ValueStr1,
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
                                  <Option key={item.ConstKey}>
                                    {item.ConstKey}-{item.ValueStr1}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="Эрсдэлийн код"
                          style={{ marginBottom: "4px" }}
                        >
                          {getFieldDecorator("RiskID", {
                            rules: required,
                          })(
                               <Select
                              onSelect={this.handleSelectChange}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {baseData &&
                                baseData.Table6.map((item) => (
                                  <Option key={item.RiskID}>
                                    {item.RiskID}-{item.RiskName}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item
                          label="НТ Төлөвийн нэмэлт"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("DescrStatus")(
                            <TextArea
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={12}>
                        <Form.Item label="Эрсдэлийн нэр" {...formItemLayout}>
                          {getFieldDecorator("RiskNote")(
                            <TextArea
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Row gutter={(16, 16)} span={18}>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2 align="center" className="hei">
                          Даатгуулагч
                        </h2>
                        <Row gutter={(16, 16)}>
                          <Form.Item
                            style={{ marginBottom: "0px", marginLeft: "7px" }}
                          >
                            {getFieldDecorator("radio-group")(
                              <Radio.Group>
                                <Radio value="a">Хувь хүн</Radio>
                                <Radio value="b">Байгууллага</Radio>
                                <Radio value="c">Гадаадын иргэн</Radio>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Row>
                        <Form.Item
                          label="Овог"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemLastName")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Нэр"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemFirstName")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Регистерийн дугаар"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemRegNo")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Хаяг"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemAddress")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Утас"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("IndemPhone")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Буруутай этгээд
                        </h2>
                        <Row gutter={(16, 16)}>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={14}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsCaseEmp", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Буруутай этгээд байгаа эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={10}>
                            <Form.Item {...formItemLayout}>
                              {getFieldDecorator("IsRequired", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Нэхэтжлэх эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={(16, 16)}>
                          <Form.Item
                            style={{ marginBottom: "0px", marginLeft: "7px" }}
                          >
                            {getFieldDecorator("radio-group")(
                              <Radio.Group>
                                <Radio value="d">Хувь хүн</Radio>
                                <Radio value="e">Байгууллага</Radio>
                                <Radio value="f">Гадаадын иргэн</Radio>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Row>
                        <Form.Item
                          label="Овог"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseLastName")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Нэр"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseFirstName")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Регистерийн дугаар"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseRegNo")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Хаяг"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseAddress")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Утас"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CasePhone")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                  <Row span={18}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Материал бүрдүүлэлт
                        </h2>
                        <Row gutter={(16, 16)}>
                          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("IsCollectMaterial", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Материал бүрдсэн эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("IsNavigated", {
                                valuePropName: "checked",
                              })(
                                <Checkbox disabled={disabledEdit}>
                                  Хэлцэл хийсэн эсэх ?
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={(16, 16)}>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("CollectMaterialDate")(
                                <DatePicker format={dateFormat} />
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("CaseDate")(
                                <DatePicker format={dateFormat} />
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                textAlign: "center",
                                marginBottom: "0px",
                              }}
                            >
                              {getFieldDecorator("InvesDate")(
                                <DatePicker format={dateFormat} />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={(16, 16)} span={18}>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Шийдвэрлэлт
                        </h2>
                        <Form.Item
                          label="Нэхэмжилсэн дүн"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("RequiredAmt")(
                            <InputNumber
                              style={{width: "100%"}}
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                              min={0}
                              precision={2}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Нөхөх санал"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CalculateAmt")(
                            <InputNumber
                              style={{width: "100%"}}
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                               min={0}
                              precision={2}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          
                          label="Олгох дүн"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                                      <Row gutter={8}>
            <Col span={12}>
             {getFieldDecorator("SolvedAmt")(
                            <InputNumber
                              style={{width: "100%"}}
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                              min={0}
                              precision={2}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                          )}
            </Col>
            <Col span={12}>
                {getFieldDecorator("SolvedDate", {
                            rules: required,
                          })(
                            <DatePicker format={dateFormat} />
                          )}
            </Col>
          </Row>
                        </Form.Item>
                        <Form.Item
                          label="Тушаалын дугаар"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                                         <Row gutter={8}>
            <Col span={12}>
             {getFieldDecorator("OrderNo")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
            </Col>
            <Col span={12}>
                {getFieldDecorator("OrderDate")(
                            <DatePicker format={dateFormat} />
                          )}
            </Col>
          </Row>
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={9}>
                      <Card style={{ marginTop: "20px", padding: "0px" }}>
                        <h2
                          align="center"
                          style={{
                            marginBottom: "10px",
                            marginTop: "-10px",
                            fontSize: "12pt",
                          }}
                        >
                          Татгалзсан
                        </h2>
                        <Form.Item
                          label="Татгалзсан огноо"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseStateNumber")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Шалтгаан"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseStateNumber")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Мэдэгдсэн хэлбэр"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("CaseStateNumber")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Тайлбар"
                          style={{ marginBottom: "0px" }}
                          {...formLayount}
                        >
                          {getFieldDecorator("VoidDescr")(
                            <Input
                              onChange={this.onChangeControls}
                              disabled={disabledEdit}
                            />
                          )}
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Түүх" key="2">
                  <BHistory propData={bufferData} testData={testData} testData1={testData1} pData={baseData && baseData.Table3} />
                </TabPane>
                <TabPane tab="Хохирол" key="3">
                  <BDamage propData1={bufferData} />
                </TabPane>
                <TabPane tab="Тооцоолол" key="4">
                  <Comput propData2={bufferData && bufferData.Table1}
                    propData3={bufferData && bufferData.Table }/>
                </TabPane>
                <TabPane tab="НТ зураг" key="5">
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
                <TabPane tab="Хяналт" key="6">
                  <Control />
                </TabPane>
              </Tabs>
              <Footer
                style={{ textAlign: "center", background: "white" }}
              >
                {this.state.current === this.state.tab - 1 && (
                  <Button
                    htmlType="submit"
                    onClick={this.onClick}
                    type="primary"
                     style={{ margin: "20px" }}
                  >
                    Болих
                  </Button>)}
                {this.state.tab > 1 && (
                  <Button
                    onClick={this.prev}
                    type="primary"
                    style={{ margin: "20px" }}
                  >
                    Өмнөх
                  </Button>)}
                {this.state.tab >= 1 && (
                  <Button
                    htmlType="submit"
                    onClick={this.next}
                    type="primary"
                  >
                    Дараах
                  </Button>)}
              </Footer>
            </Card>
          </Spin>
        </Layout>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(Insurance);

export default class BQuits extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <WrappedContractForm />
      </div>
    );
  }
}
