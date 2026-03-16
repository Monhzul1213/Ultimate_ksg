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

class BTable1 extends React.Component {
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
        title: "Хөрөнгө өмчлөгч",
        dataIndex: "dmgType",
      },
      {
        title: "Үйлдвэр",
        dataIndex: "dmgFactory",
      },
      {
        title: "Марк, Загвар",
        dataIndex: "dmgMark",
      },

      {
        title: "Улсын дугаар",
        dataIndex: "dmgStateNumber",
      },
      {
        title: "Арал, Сехиал дугаар",
        dataIndex: "dmgIslandNumber",
      },
      {
        title: "Эвдрэл гэмтэл",
        dataIndex: "dmgBroken",
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
    const { updateData } = this.state;
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
        setTableData("Table2", newData);
      } else {
        newData.push(row);
        setTableData("Table2", newData);
      }
      this.setState({ visible: false, updateData: undefined });
    });
  }
  handleDelete(RowID) {
    const { tableData, setTableData } = this.props;
    const newData = tableData.filter((item) => item.RowID !== RowID);
    setTableData("Table2", newData);
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
        dmgPhoneFax: data.dmgPhoneFax,
        dmgType: data.dmgType,
        dmgFactory: data.dmgFactory,
        dmgMark: data.dmgMark,
        dmgStateNumber: data.dmgStateNumber,
        dmgIslandNumber: data.dmgIslandNumber,
        dmgBroken: data.dmgBroken,
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

  handleCancel = (RowID) => {
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
      <div>
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
                    Хөрөнгө өмчлөгч
                  </p>
                  {getFieldDecorator("dmgType")(
                    <Select
                      allowClear={true}
                      style={{
                        marginBottom: "8px",
                        fontSize: "10pt",
                        fontFamily: "Arial",
                      }}
                    >
                      <Option value="Хувь хүн">Хувь хүн</Option>
                      <Option value="Хуулийн этгээд">Хуулийн этгээд</Option>
                    </Select>
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
                    Үйлдвэр
                  </p>
                  {getFieldDecorator("dmgFactory")(
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
                      <Option value="Acura">Acura</Option>
                      <Option value="Audi">Audi</Option>
                      <Option value="Bentley">Bentley</Option>
                      <Option value="BMW">BMW</Option>
                      <Option value="Block">Block</Option>
                      <Option value="Chrysler">Chrysler</Option>
                      <Option value="Dodge">Dodge</Option>
                      <Option value="Flat">Flat</Option>
                      <Option value="Ford">Ford</Option>
                      <Option value="Geely">Geely</Option>
                      <Option value="General Motors">General Motors</Option>
                      <Option value="GMC">GMC</Option>
                      <Option value="Honda">Honda</Option>
                      <Option value="Hyundai">Hyundai</Option>
                      <Option value="Infiniti">Infiniti</Option>
                      <Option value="Jaguar">Jaguar</Option>
                      <Option value="Jeep">Jeep</Option>
                      <Option value="Kio">Kio</Option>
                      <Option value="Land Rover">Land Rover</Option>
                      <Option value="Lexus">Lexus</Option>
                      <Option value="Mazda">Mazda</Option>
                      <Option value="Mercedes-Benz">Mercedes-Benz</Option>
                      <Option value="Mitsubishi">Mitsubishi</Option>
                      <Option value="Nissan">Nissan</Option>
                      <Option value="Pagani">Pagani</Option>
                      <Option value="Peugeot">Peugeot</Option>
                      <Option value="Ram">Ram</Option>
                      <Option value="Rolls Royce">Rolls Royce</Option>
                      <Option value="Saab">Saab</Option>
                      <Option value="Subaru">Subaru</Option>
                      <Option value="Suzuki">Suzuki</Option>
                      <Option value="Tata Motors">Tata Motors</Option>
                      <Option value="Tesla">Tesla</Option>
                      <Option value="Toyota">Toyota</Option>
                      <Option value="Volkswagen">Volkswagen</Option>
                      <Option value="Volvo">Volvo</Option>
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
                    Марк, Загвар
                  </p>
                  {getFieldDecorator("dmgMark")(
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
                      <Option value="Elentra">Elentra</Option>
                      <Option value="Sonata-5">Sonata-5</Option>
                      <Option value="Sonata-6">Sonata-6</Option>
                      <Option value="Sonata-7">Sonata-7</Option>
                      <Option value="Accent">Accent</Option>
                      <Option value="Porter">Porter</Option>
                      <Option value="Starex">Starex</Option>
                      <Option value="Land Cruiser">Land Cruiser</Option>
                      <Option value="Land Cruiser Prado">
                        Land Cruiser Prado
                      </Option>
                      <Option value="Land Cruiser-450">Land Cruiser-450</Option>
                      <Option value="Land Cruiser-470">Land Cruiser-470</Option>
                      <Option value="Land Cruiser-200">Land Cruiser-200</Option>
                      <Option value="Range Rover">Range Rover</Option>
                      <Option value="RX">RX</Option>
                      <Option value="Prius">Prius</Option>
                      <Option value="Prius-10">Prius-10</Option>
                      <Option value="Prius-11">Prius-11</Option>
                      <Option value="Prius-20">Prius-20</Option>
                      <Option value="Land Rover">Land Rover</Option>
                      <Option value="HighLander">HighLander</Option>
                      <Option value="Mazda">Mazda</Option>
                      <Option value="Mercedes-Benz">Mercedes-Benz</Option>
                      <Option value="Lexus">Lexus</Option>
                      <Option value="Crown">Crown</Option>
                      <Option value="Mark-2">Mark-2</Option>
                    </Select>
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
                    Улсын дугаар
                  </p>
                  {getFieldDecorator("dmgStateNumber", {
                    rules: [
                      {
                        pattern: /^\d{4}[А-ЯҮӨ]{3}$/g,
                        message: "Машины дугаараа оруулана уу.",
                      },
                    ],
                  })(
                    <Input
                      placeholder="1234УБВ"
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
                    Арал, Сехиал дугаар
                  </p>
                  {getFieldDecorator("dmgIslandNumber")(
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
                    Эвдрэл гэмтэл
                  </p>
                  {getFieldDecorator("dmgBroken")(
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
                      <Option value="Капод">Капод</Option>
                      <Option value="Гупер">Гупер</Option>
                      <Option value="Толь">Толь</Option>
                      <Option value="Хөдөлгүүр">Хөдөлгүүр</Option>
                      <Option value="Их гэрэл">Их гэрэл</Option>
                      <Option value="Дохионы гэрэл">Дохионы гэрэл</Option>
                      <Option value="Салхины шил">Салхины шил</Option>
                      <Option value="Хойд цонх">Хойд цонх</Option>
                      <Option value="Багааж">Багааж</Option>
                      <Option value="Яндан">Яндан</Option>
                      <Option value="Шатахуны сав">Шатахуны сав</Option>
                      <Option value="Шил арчигч">Шил арчигч</Option>
                      <Option value="Дугуй">Дугуй</Option>
                      <Option value="Обуд">Обуд</Option>
                      <Option value="Үзүүрийн шарнер">Үзүүрийн шарнер</Option>
                      <Option value="Өндгөн тулгуур">Өндгөн тулгуур</Option>
                      <Option value="Амортизатор">Амортизатор</Option>
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
const EditableFormTable = Form.create()(BTable1);
export default EditableFormTable;
