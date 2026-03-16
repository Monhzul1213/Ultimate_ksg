import React from "react";
import {
  Table,
  Form,
  Modal,
  Row,
  Col,
  Select,
  Input,
  InputNumber,
  Button,
  Popover,
  Icon,
  Popconfirm,
  notification,
} from "antd";
import "./InsuranceRP.css";
import request from "../insurance/PostRequest";
import cookie from "react-cookies";

const { Option } = Select;

class BTable4 extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    this.state = {
      updateData: undefined,
      visible: false,
      baseData: undefined,
      LoggedSysuser,
    };
    this.columns = [
      {
        title: "Овог",
        dataIndex: "dmgLName",
      },
      {
        title: "Нэр",
        dataIndex: "dmgFName",
      },
      {
        title: "Регисрийн дугаар",
        dataIndex: "dmgRegNo",
      },
      {
        title: "Иргэний харъяалал",
        dataIndex: "dmgCitizenShip",
      },
      {
        title: "Зип код",
        dataIndex: "dmgZipCode",
      },
      {
        title: "Хаяг",
        dataIndex: "dmgAddress",
      },
      {
        title: "Утасны дугаар",
        dataIndex: "dmgPhoneFax",
      },
      {
        title: "Гэмтлийн зэрэг",
        dataIndex: "dmgDegree",
      },
      {
        title: "Онош/Монгол/",
        dataIndex: "dmgDiagnose",
      },
      {
        title: "Оношийн шифр",
        dataIndex: "dmgDiagnoseCipher",
      },
      {
        title: "Эмчилгээний төрөл",
        dataIndex: "dmgType",
      },
      {
        title: "Эмнэлэг",
        dataIndex: "dmgHospital",
      },
      {
        title: "Эмчлэгч",
        dataIndex: "dmgDoctor",
      },
      {
        title: "Хохирол үнэлэгч",
        dataIndex: "IndEvaluteID",
      },
      {
        title: "Хохирлын дүн",
        dataIndex: "IndEvaluteAmt",
      },
      {
        title: "Үйлдэл",
        dataIndex: "operation",
        fixed: "right",
        render: (text, record) => {
          return (
            <span>
              <a
                onClick={() => this.showModal(record)}
                style={{ marginRight: 8 }}
              >
                <Popover content="Засварлах" title={null} trigger="hover">
                  <Icon
                    type="edit"
                    style={{
                      fontSize: "16px",
                      textAlign: "center",
                      color: "#004ecc",
                    }}
                  />
                </Popover>
              </a>
              <Popconfirm
                title="Устгах үйлдэл хийхдээ итгэлтэй байна уу?"
                okText="Тийм"
                cancelText="Үгүй"
                onConfirm={() => this.handleDelete(record.RowID)}
              >
                <a>
                  <Popover content="Устгах" title={null} trigger="hover">
                    <Icon
                      type="delete"
                      style={{ fontSize: "16px", color: "#004ecc" }}
                    />
                  </Popover>
                </a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
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
  save(RowID) {
    const { tableData, setTableData, form } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...tableData];
      const index = newData.findIndex((item) => RowID === item.RowID);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTableData("Table5", newData);
      } else {
        newData.push(row);
        setTableData("Table5", newData);
      }
      this.setState({ visible: false, updateData: undefined });
    });
  }
  handleDelete(RowID) {
    const { tableData, setTableData } = this.props;
    const newData = tableData.filter((item) => item.RowID !== RowID);
    setTableData("Table5", newData);
  }
  showModal = (data) => {
    const { form, tableData, setTableData } = this.props;
    form.resetFields();
    if (data) {
      form.setFieldsValue({
        CaseNo: data.CaseNo,
        dmgLName: data.dmgLName,
        dmgFName: data.dmgFName,
        dmgRegNo: data.dmgRegNo,
        dmgCitizenShip: data.dmgCitizenShip,
        dmgZipCode: data.dmgZipCode,
        dmgAddress: data.dmgAddress,
        dmgType: data.dmgType,
        dmgPhoneFax: data.dmgPhoneFax,
        dmgDegree: data.dmgDegree,
        dmgDiagnose: data.dmgDiagnose,
        dmgDiagnoseCipher: data.dmgDiagnoseCipher,
        dmgHospital: data.dmgHospital,
        dmgDoctor: data.dmgDoctor,
        IndEvaluteID: data.IndEvaluteID,
        IndEvaluteAmt: data.IndEvaluteAmt,
        RowID: data.RowID,
      });
      this.setState({
        visible: true,
        updateData: data,
      });
    } else {
      const newData = {
        RowID: `NEW_${this.props.tableData.length}`,
      };
      this.setState({ visible: true, updateData: newData });
    }
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleSelectChange = (value, option) => {
    this.props.form.setFieldsValue({
      dmgAddress: `${
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
    this.props.form.setFieldsValue({
      dmgCitizenShip: "Монгол",
    });
  };
  render() {
    const { tableData, tD } = this.props;
    const { baseData, updateData } = this.state;
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
    const columns = this.columns.map((col) => {
      return {
        ...col,
      };
    });
    return (
      <div className={tD ? "dis" : "backr"}>
        <Table
          className={
            "table-head-withborder" + this.props.className
              ? " " + this.props.className
              : ""
          }
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-even" : "table-row-odd"
          }
          pagination={false}
          size={this.props.size ? this.props.size : "default"}
          scroll={{ x: "max-content" }}
          rowKey="RowID"
          columns={columns}
          dataSource={tableData}
        />
        <Button
          style={{
            width: "100%",
            marginTop: 16,
            marginBottom: 8,
            textAlign: "center",
          }}
          icon="plus"
          onClick={() => {
            this.showModal();
          }}
          type="primary"
          disabled={tD}
        >
          Мөр нэмэх
        </Button>
        <Modal
          okText="Хадгалах"
          cancelText="Болих"
          title={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={() => this.save(updateData.RowID)}
          className="table_backr"
        >
          <Form form={this.props.form} {...formLayount}>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Овог
                  </p>
                  {getFieldDecorator("dmgLName")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
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
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Нэр
                  </p>
                  {getFieldDecorator("dmgFName")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Регисрийн дугаар
                  </p>
                  {getFieldDecorator("dmgRegNo", {
                    rules: [
                      {
                        pattern: /^[А-ЯҮӨ]{2}\d{8}$/g,
                        message: "Регисрийн дугаараа оруулана уу.",
                      },
                    ],
                  })(
                    <Input
                      placeholder="РД12345678"
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
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
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Иргэний харъяалал
                  </p>
                  {getFieldDecorator(
                    "dmgCitizenShip",
                    {}
                  )(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Зип код
                  </p>
                  {getFieldDecorator("dmgZipCode")(
                    <Select
                      dropdownMatchSelectWidth={false}
                      allowClear={true}
                      showSearch
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      onSelect={this.handleSelectChange}
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
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
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Хаяг
                  </p>
                  {getFieldDecorator("dmgAddress")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Утасны дугаар
                  </p>
                  {getFieldDecorator("dmgPhoneFax", {
                    pattern: /^\d{8}$/g,
                    rules: greaterThan,
                  })(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
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
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Гэмтлийн зэрэг
                  </p>
                  {getFieldDecorator("dmgDegree")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Онош/Монгол/
                  </p>
                  {getFieldDecorator("dmgDiagnose")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
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
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Оношийн шифр
                  </p>
                  {getFieldDecorator("dmgDiagnoseCipher")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Эмчилгээний төрөл
                  </p>
                  {getFieldDecorator("dmgType")(
                    <Select
                      allowClear={true}
                      showSearch
                      optionFilterProp="children"
                      dropdownMatchSelectWidth={false}
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    >
                      <Option value="Эмийн">Эмийн</Option>
                      <Option value="Эмчилгээний">Эмчилгээний</Option>
                      <Option value="Оношилгоо">Оношилгоо</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Эмнэлэг
                  </p>
                  {getFieldDecorator("dmgHospital")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Эмчлэгч
                  </p>
                  {getFieldDecorator("dmgDoctor")(
                    <Input
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
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
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Хохирол үнэлэгч
                  </p>
                  {getFieldDecorator("IndEvaluteID")(
                    <Select
                      dropdownMatchSelectWidth={false}
                      allowClear={true}
                      showSearch
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} type="flex">
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  <p
                    style={{
                      marginBottom: "0px",
                      color: "black",
                      fontSize: "12px",
                      fontFamily: "Arial",
                    }}
                  >
                    Хохирлын дүн
                  </p>
                  {getFieldDecorator("IndEvaluteAmt", { rules: greaterThan })(
                    <InputNumber
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                        width: "100%",
                      }}
                      min={0}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder="0.0"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...columnConfig}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator("RowID", {
                    initialValue: `New_${
                      this.props.tableData && this.props.tableData.length
                    }`,
                  })(
                    <Input
                      type="hidden"
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
const EditableFormTable = Form.create()(BTable4);
export default EditableFormTable;
