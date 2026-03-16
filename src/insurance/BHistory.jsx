import React, { Component } from "react";
import { Input, Form, Row, Col, Card, DatePicker, Select, notification } from "antd";
import "./Quits.css";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";
import N0101 from "./0101"; import N0102 from "./0102"; import N0103 from "./0103"; import N0104 from "./0104"; import N0105 from "./0105";
import N0106 from "./0106"; import N0107 from "./0107"; import N0108 from "./0108"; import N0109 from "./0109"; import N0110 from "./0110";
import N0111 from "./0111"; import N0112 from "./0112"; import N0113 from "./0113"; import N0116 from "./0116"; import N0117 from "./0117";
import N0118 from "./0118"; import N0201 from "./0201"; import N0202 from "./0202"; import N0203 from "./0203"; import N0204 from "./0204";
import N0205 from "./0205"; import N0206 from "./0206"; import N0207 from "./0207"; import N0208 from "./0208"; import N0306 from "./0306";
import N0209 from "./0209"; import N0210 from "./0210"; import N0211 from "./0211"; import N0301 from "./0301"; import N0302 from "./0302";
import N0307 from "./0307"; import N0308 from "./0308"; import N0309 from "./0309"; import N0310 from "./0310"; import N0312 from "./0312";
import N0401 from "./0401"; import N0402 from "./0402"; import N0403 from "./0403"; import N0501 from "./0501"; import N0601 from "./0601";
import N0602 from "./0602"; import N0701 from "./0701"; import N0702 from "./0702"; import N0801 from "./0801"; import N0901 from "./0901";
import N1001 from "./1001"; import N1002 from "./1002"; import N1003 from "./1003"; import N1004 from "./1004"; import N1005 from "./1005";
import N1006 from "./1006"; import N1007 from "./1007"; import N1008 from "./1008"; import N1009 from "./1009"; import N1010 from "./1010";
import N1011 from "./1011"; import N1012 from "./1012"; import N1013 from "./1013"; import N1014 from "./1014"; import N1015 from "./1015";
import N1016 from "./1016"; import N1017 from "./1017"; import N1018 from "./1018"; import N1019 from "./1019"; import N10304 from "./10304";
import N1101 from "./1101"; import N1102 from "./1102"; import N1103 from "./1103"; import N1201 from "./1201"; import N1301 from "./1301";
import N1302 from "./1302"; import N1601 from "./1601"; import N2001 from "./2001"; import N2002 from "./2002"; import N3001 from "./3001";
import N5001 from "./5001"; import N5002 from "./5002"; import N5004 from "./5004"; import N10101 from "./10101"; import N10303 from "./10303";
import N10402 from "./10402";

const dateFormat = "YYYY.MM.DD";
const { Option } = Select;
const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};

class History extends React.Component {
  constructor(props) {
    super(props);
    var date = new Date(),
      today =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      loading: true,
      itemValid: false,
      editable: false,
      LoggedSysuser,
      cookieUser,
      today,
      fetching: false,
      errorMessage: null,
      bufferData: []
    };
  }
 
  componentDidMount() {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    this.setState({ loading: true });
    var BusinessObject = [
      { FieldName: "SheetNo", Value: this.props.testData1  }
    ];

    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          { QueryID: "IS_185", BusinessObject },
          replacer
        ),
      })
      .then((res) => {
        if (res.data.retType !== 0) {
          resetFields();
          this.setInvoiceModeNormal();
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
          });
          return;
        }
        const { Table } = res.data.retData;
        let values = {};

        Object.keys(getFieldsValue()).forEach((key) => {
          switch (key) {
            case "AgentID":
            case "IndemnityType":
            case "ContractDate":
            case "BeginDate":
            case "EndDate":
            case "CaseStateNumber":
              values[key] = Table[0][key];
              break;
          }
        });
          setFieldsValue(values);
        this.setState({
          bufferData: res.data.retData,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        notification["error"]({
          message: "",
          description: "",
        });
      });
  };

  setInvoiceModeNormal() {
    this.setState({
      loading: false,
      invoiceMode: BaseInvoiceMode.Normal,
    });
  }

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { propData, testData, pData,testData1 } = this.props;
    const disabledEdit =
      this.state.loading ||
      BaseInvoiceMode.Normal === this.state.invoiceMode ||
      !this.state.editable;
    const formLayount = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
      labelAlign: "left",
    };
    const required = [
      { required: true, message: "Мэдээлэл оруулах шаардлагатай." },
    ];
    return (
      <div style={{ margin: "15px" }}>
        <Row gutter={(16, 16)} span={18}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Баталгааны мэдээлэл
              </h2>
              <Form.Item
                label="Мэргэжилтэн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("AgentID")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Төлөв"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("Status1")(
                    <Select
                              dropdownMatchSelectWidth={false}
                              disabled={disabledEdit}
                              allowClear={true}
                              showSearch
                              optionFilterProp="children"
                              style={{ width: "100%" }}
                            >
                              {propData &&
                                propData.Table16.map((item) => (
                                  <Option key={item.ConstKey}>
                                    {item.ConstKey} - {item.ValueStr1}
                                  </Option>
                                ))}
                            </Select>
                )}
              </Form.Item>
              <Form.Item
                label="Баталгааны огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("ContractDate")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Үргэжлэх огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}>
                         <Row gutter={8}>
            <Col span={12}>
                 {getFieldDecorator("BeginDate")(
                    <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                    )}
            </Col>
            <Col span={12}>
                 {getFieldDecorator("EndDate")(
                    <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                    )}
            </Col>
                </Row>
                </Form.Item>
              {this.props.testData == "0101" ? <N0101 /> : this.props.testData == "0102" ? <N0102 /> : this.props.testData == "0103" ? <N0103 /> :
              this.props.testData == "0104" ? <N0104 /> : this.props.testData == "0105" ? <N0105 /> : this.props.testData == "0106" ? <N0106 /> :  
              this.props.testData == "0107" ? <N0107 />  : this.props.testData == "0108" ? <N0108 /> : this.props.testData == "0109" ? <N0109 /> : 
              this.props.testData == "0110" ? <N0110 /> : this.props.testData == "0111" ? <N0111 /> : this.props.testData == "0112" ? <N0112 /> :
              this.props.testData == "0113" ? <N0113 /> : this.props.testData == "0116" ? <N0116 /> : this.props.testData == "0117" ? <N0117 /> :
              this.props.testData == "0118" ? <N0118 /> : this.props.testData == "0201" ? <N0201 /> : this.props.testData == "0202" ? <N0202 /> :
              this.props.testData == "0203" ? <N0203 /> : this.props.testData == "0204" ? <N0204 /> : this.props.testData == "0205" ? <N0205 /> :
              this.props.testData == "0206" ? <N0206 /> : this.props.testData == "0207" ? <N0207 /> : this.props.testData == "0208" ? <N0208 /> :
              this.props.testData == "0306" ? <N0306 /> : this.props.testData == "0209" ? <N0209 /> : this.props.testData == "0210" ? <N0210 /> :
              this.props.testData == "0211" ? <N0211 /> : this.props.testData == "0301" ? <N0301 /> : this.props.testData == "0302" ? <N0302 /> :
              this.props.testData == "0307" ? <N0307 /> : this.props.testData == "0308" ? <N0308 /> : this.props.testData == "0309" ? <N0309 /> :
              this.props.testData == "0310" ? <N0310 /> : this.props.testData == "0312" ? <N0312 /> : this.props.testData == "0401" ? <N0401 /> :
              this.props.testData == "0402" ? <N0402 /> : this.props.testData == "0403" ? <N0403 /> : this.props.testData == "0501" ? <N0501 /> :
             this.props.testData == "0601" ? <N0601 /> : this.props.testData == "0602" ? <N0602 /> : this.props.testData == "0701" ? <N0701 /> :
              this.props.testData == "0702" ? <N0702 /> : this.props.testData == "0801" ? <N0801 /> : this.props.testData == "0901" ? <N0901 /> :
             this.props.testData == "1001" ? <N1001 /> : this.props.testData == "1002" ? <N1002 /> : this.props.testData == "1003" ? <N1003 /> :
             this.props.testData == "1004" ? <N1004 /> : this.props.testData == "1005" ? <N1005 /> : this.props.testData == "1006" ? <N1006 /> :
              this.props.testData == "1007" ? <N1007 /> : this.props.testData == "1008" ? <N1008 /> : this.props.testData == "1009" ? <N1009 /> :
              this.props.testData == "1010" ? <N1010 /> : this.props.testData == "1011" ? <N1011 /> : this.props.testData == "1012" ? <N1012 /> :
              this.props.testData == "1013" ? <N1013 /> : this.props.testData == "1014" ? <N1014 /> : this.props.testData == "1015" ? <N1015 /> :
              this.props.testData == "1016" ? <N1016 /> : this.props.testData == "1017" ? <N1017 /> : this.props.testData == "1018" ? <N1018 /> :
              this.props.testData == "1019" ? <N1019 /> : this.props.testData == "10304" ? <N10304 /> : this.props.testData == "1101" ? <N1101 /> :
              this.props.testData == "1102" ? <N1102 /> : this.props.testData == "0103" ? <N1103 /> : this.props.testData == "1201" ? <N1201 /> :
              this.props.testData == "1301" ? <N1301 /> : this.props.testData == "1302" ? <N1302 /> : this.props.testData == "1601" ? <N1601 /> :
              this.props.testData == "2001" ? <N2001 /> : this.props.testData == "2002" ? <N2002 /> : this.props.testData == "3001" ? <N3001 /> :
              this.props.testData == "5001" ? <N5001 /> : this.props.testData == "5002" ? <N5002 /> : this.props.testData == "5004" ? <N5004 /> :
             this.props.testData == "10101" ? <N10101 /> : this.props.testData == "10303" ? <N10303 /> : this.props.testData == "10402" ? <N10402 />
              : <N2001 />}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Өмнөх нөхөн төлбөрийн мэдээлэл
              </h2>
              <Form.Item
                label="Төлөгдсөн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PaidAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Буцаасан хураамж"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("ReturnAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Гэрээний НТ дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("ContractAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Гэрээний НТ тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalIndemnityCount")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Зүйлийн НТ дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalIndemnityAmount")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Зүйлийн НТ тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalIndemnityCount")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
           <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Нөхөн төлбөр, цуцлалтын дэлгэрэнгүй
              </h2>
              <Form.Item
                label="Нийт нөхөн төлбөрийн тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalIndemnityCount")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Нийт нөхөн төлбөрийн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalIndemnityAmount")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Буцаалтын тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalReturnCount")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Буцаалтын дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("TotalReturnAmt")(
                  <Input
                    onChange={this.onChangeControls}
                    disabled={disabledEdit}
                  />
                )}
              </Form.Item>
            </Card>
          </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Осолын газрын мэдээлэл
              </h2>
              <Form.Item
                label="Дуудлагын үзүүлэлт"
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
            </Card>
          </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={9}>
            <Card style={{ marginTop: "20px", padding: "0px" }}>
              <h2
                align="center"
                style={{
                  marginBottom: "10px",
                  marginTop: "-10px",
                  fontSize: "12pt",
                }}
              >
                Гэрээний хууль, заалт
              </h2>
              <Form.Item
                label="Гэрээний НТ олгох заалт"
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
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const EditableFormTable = Form.create()(History);
export default EditableFormTable;
