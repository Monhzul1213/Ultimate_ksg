import React from "react";
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  Divider,
  Select,
  InputNumber,
  notification,
} from "antd";
import cookie from "react-cookies";
import request from "./PostRequest";

const { Option } = Select;

export default class Step2 extends React.Component {
  cacheOriginData = {};

  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const cookieUser = cookie.load("LoggedSysuser");
    this.state = {
      data: [],
      LoggedSysuser,
      cookieUser,
      baseData: undefined,
      bufferData: undefined,
      loading: false,
      value: [],
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter((item) => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map((item) => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = (newRow) => {
    const { data } = this.state;
    const newData = data.map((item) => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${data.length}`,
      empCode: "",
      empName: "",
      percent: "",
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const newData = data.filter((item) => item.key !== key);
    this.setState({ data: newData });
  }

  getInfo() {
    request
      .post("Contract_Initialize", { token: this.state.LoggedSysuser.token })
      .then((res) => {
        if (res.data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: res.data.retDesc,
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
  componentDidMount() {
    const { testData } = this.props;
    const { data } = this.state;
    const defaultData = data.map((item) => ({ ...item }));
    defaultData.push({
      empCode: testData.Employee,
      empName: testData.Employee,
      percent: "100%",
    });
    this.getInfo();
    this.setState({
      data: defaultData,
    });
  }

  handleKeyPress(e, key) {
    if (e.key === "Enter") {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map((item) => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error("Утга оруулна уу!");
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;

      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map((item) => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  saveFormData = () => {
    const { setTestData, testData } = this.props;
    const { data } = this.state;
    setTestData({
      data: data,
      ...testData,
    });
  };

  next = () => {
    const { next } = this.props;
    this.saveFormData();
    next();
  };

  prev = () => {
    const { prev } = this.props;
    this.saveFormData();
    prev();
  };

  render() {
    const columns = [
      {
        title: "Мэргэжилтний код",
        dataIndex: "empCode",
        key: "empCode",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={(e) =>
                  this.handleFieldChange(e, "empName", record.key)
                }
                onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                placeholder="Мэргэжилтний код"
                onPressEnter={this.onPressEnterContractNo}
              />
            );
          }
          return text;
        },
      },
      {
        title: "Мэргэжилтний нэр",
        dataIndex: "empName",
        key: "empName",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select style={{ width: "100%" }} placeholder="Мэргэжилтний нэр">
                {this.state.baseData &&
                  this.state.baseData.Emp &&
                  this.state.baseData.Emp.map((emp) => (
                    <Option key={emp.EmpCode}>{emp.EmpName}</Option>
                  ))}
              </Select>
            );
          }
          return text;
        },
      },
      {
        title: "Хувь",
        dataIndex: "percent",
        key: "percent",
        render: (text, record) => {
          if (record.editable) {
            return <InputNumber />;
          }
          return text;
        },
      },
      {
        title: "Засварлах",
        key: "action",
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={(e) => this.saveRow(e, record.key)}>Хадгалах</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="Өгөгдлийг устгах уу？"
                    onConfirm={() => this.remove(record.key)}
                  >
                    <a>Устгах</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={(e) => this.saveRow(e, record.key)}>Хадгалах</a>
                <Divider type="vertical" />
                <a onClick={(e) => this.cancel(e, record.key)}>Болих</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={(e) => this.toggleEditable(e, record.key)}>
                Засварлах
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="Өгөгдлийг устгах уу？"
                onConfirm={() => this.remove(record.key)}
              >
                <a>Устгах</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <div>
        <Table
          rowKey={(record) => record.uid}
          bordered
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          style={{ padding: "0px 60px 0px 60px" }}
        />
        <Button
          style={{ width: "90.5%", marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          Нэмэх
        </Button>
        <div className="steps-action">
          <Button type="primary" onClick={this.prev}>
            Өмнөх
          </Button>
          <Button type="primary" onClick={this.next} style={{ marginLeft: 18 }}>
            Дараах
          </Button>
        </div>
      </div>
    );
  }
}
