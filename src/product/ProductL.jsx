import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Select,
  Form,
  notification,
  Spin,
  Row,
  Col,
  Typography,
  Input,
  Icon,
} from "antd";
import "./ProductL.css";
import "../route/mainRoute.css";
import cookie from "react-cookies";
import moment, { isMoment } from "moment";
import request from "../insurance/PostRequest";
import GridViewS from "../base/GridViewS";

const { Option } = Select;
const dateFormat = "YYYY.MM.DD";
const { Text } = Typography;

class FilterForm extends Component {
  render() {
    const { form, onSubmitForm, loading, cookieUser, baseData } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      style: { marginBottom: "0px" },
    };
    return (
      <div className="hh">
        <Form
          className="qq"
          style={{ display: "contents" }}
          onSubmit={onSubmitForm}
        >
          <Button
            className="button1"
            htmlType="submit"
            disabled={loading}
            icon="search"
            style={{
              fontWeight: "bold",
              borderWidth: "0px",
              height: "71px",
              marginRight: "16px",
              width: "35px",
              marginTop: "4px",
            }}
            block
          />
        </Form>
        <Form style={{ display: "block" }} autoComplete="off">
          <Row type="flex">
            <Col span={24}>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("BarCode")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Бар код"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table.map((item) => (
                            <Option key={item.BarCode}>{item.BarCode}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("Descr")(
                      <Input
                        disabled={loading}
                        type="flex"
                        placeholder="Барааны нэр"
                        allowClear={true}
                      ></Input>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("VendID")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Нийлүүлэгч"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table3.map((item) => (
                            <Option key={item.VendID}>
                              {item.VendID}-{item.VendName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={(16, 16)}>
                <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("InvtID")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Барааны код"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table.map((item) => (
                            <Option key={item.InvtID}>{item.InvtID}</Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("Materialtype")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Барааны категори"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table1.map((item) => (
                            <Option key={item.Materialtype}>
                              {item.Materialtype}-{item.Descr}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator("ClassID")(
                      <Select
                        disabled={loading}
                        type="flex"
                        placeholder="Барааны ангилал"
                        allowClear={true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {baseData &&
                          baseData.Table2.map((item) => (
                            <Option key={item.ClassID}>
                              {item.ClassID}-{item.Descr}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={0}>
              <Form.Item {...formItemLayout}>
                <div className="select-input-hei">
                  {getFieldDecorator("PrimarySiteID", {
                    initialValue: cookieUser && cookieUser.SiteID,
                  })(
                    <Input
                      disabled={loading}
                      style={{ height: "52px" }}
                      placeholder="Барааны үндсэн байршил"
                      type="hidden"
                    />
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const WrappedFilterForm = Form.create({ name: "filter_form" })(FilterForm);

export default class Product extends Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      filterResult: undefined,
      baseData: undefined,
      loading: true,
      LoggedSysuser,
      cookieUser,
      queryID: "IN_445",
    };
  }

  componentDidMount() {
    var BusinessObject = [
      { FieldName: "PrimarySiteID", Value: this.state.cookieUser.SiteID },
    ];
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ QueryID: "IN_446", BusinessObject }),
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
        this.onSubmitForm();
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  filter = (values) => {
    var BusinessObject = [];
    Object.entries(values).forEach(([key, value]) => {
      if (key.includes("Date")) value = value.format(dateFormat);
      BusinessObject.push({ FieldName: key, Value: value });
    });
    const replacer = (key, value) =>
      typeof value === "undefined" ? null : value;
    this.setState({ loading: true });
    request
      .post("Execute_Query", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify(
          {
            QueryID: this.state.queryID,
            BusinessObject,
          },
          replacer
        ),
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

        this.setState({
          filterResult: data.retData.Table,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  };

  onSubmitForm = (e) => {
    e && e.preventDefault();
    const { form } = this.formRef.props;
    form.validateFields({ first: true }, (err, values) => {
      if (!err) this.filter(values);
    });
  };

  filterFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div style={{ margin: "40px", marginTop: "15px" }}>
        <h3 style={{ marginBottom: "30px" }}>
          Бараа / Бүртгэл / <Text color="#6b747b">Бараа лавлагаа</Text>
        </h3>

        <Spin spinning={this.state.loading}>
          <WrappedFilterForm
            wrappedComponentRef={this.filterFormRef}
            loading={this.state.loading}
            onSubmitForm={this.onSubmitForm}
            cookieUser={this.state.cookieUser}
            baseData={this.state.baseData}
          />
          <GridViewS
            QueryID={this.state.queryID}
            rowKey="BarCode"
            dataSource={this.state.filterResult}
          />
        </Spin>
      </div>
    );
  }
}
