import React from "react";
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  Divider,
  DatePicker,
  Select,
  InputNumber,
  notification,
} from "antd";
import cookie from "react-cookies";
import request from "./PostRequest";

const { Option } = Select;
export default class Step3 extends React.Component {
  index = 0;

  cacheOriginData = {};
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    this.state = {
      data: [],
      loading: false,
      LoggedSysuser,
      itemValid: false,
      value: [],
      columns: [
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
                  <a onClick={(e) => this.saveRow(e, record.key)}>ыы</a>
                  <Divider type="vertical" />
                  <a onClick={(e) => this.cancel(e, record.key)}>ыы</a>
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
                  title="Өгөгдлийг устгахуу？"
                  onConfirm={() => this.remove(record.key)}
                >
                  <a>Устгах</a>
                </Popconfirm>
              </span>
            );
          },
        },
        {
          title: "Баталгааны дугаар",
          dataIndex: "batalgaano",
          key: "batalgaano",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "batalgaano", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Баталгааны огноо",
          dataIndex: "batalgaaogno",
          key: "batalgaaogno",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "batalgaaogno", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Да.эхлэх огноо",
          dataIndex: "DAStartdate",
          key: "DAStartdate",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "DAStartdate", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Да.дуусах огноо",
          dataIndex: "DAEnddate",
          key: "DAEnddate",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "DAEnddate", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Үндсэн үнэлгээ",
          dataIndex: "undsenunel",
          key: "undsenunel",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "undsenunel", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Үндсэн хураамжийн %",
          dataIndex: "undsenhuvi",
          key: "undsenhuvi",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "undsenhuvi", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Үндсэн хураамжийн дүн",
          dataIndex: "undsenhuraamjdun",
          key: "undsenhuraamjdun",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "undsenhuraamjdun", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Нэмэлт үнэлгээ",
          dataIndex: "nemeltunelgee",
          key: "nemeltunelgee",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "nemeltunelgee", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Нэмэлт хураамжийн %",
          dataIndex: "nemelthuraamj",
          key: "nemelthuraamj",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "nemelthuraamj", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Нэмэлт хураамжийн дүн",
          dataIndex: "nemelthuraamjdun",
          key: "nemelthuraamjdun",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  autoFocus
                  onChange={(e) =>
                    this.handleFieldChange(e, "nemelthuraamjdun", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Хөнгөлөлтийн хувь",
          dataIndex: "hongololtiinhuvi",
          key: "hongololtiinhuvi",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  onChange={(e) =>
                    this.handleFieldChange(e, "hongololtiinhuvi", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Нийт хураамж",
          dataIndex: "niithuraamj",
          key: "niithuraamj",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  onChange={(e) =>
                    this.handleFieldChange(e, "niithuraamj", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Орлого авсан",
          dataIndex: "orlogoavsan",
          key: "orlogoavsan",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  onChange={(e) =>
                    this.handleFieldChange(e, "orlogoavsan", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Нийт үнэлгээ",
          dataIndex: "niitunelgee",
          key: "niitunelgee",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  onChange={(e) =>
                    this.handleFieldChange(e, "niitunelgee", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
        {
          title: "Тайлбар",
          dataIndex: "tailbar",
          key: "tailbar",
          render: (text, record) => {
            if (record.editable) {
              return (
                <Input
                  value={text}
                  onChange={(e) =>
                    this.handleFieldChange(e, "tailbar", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
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
              return (
                <Input
                  value={text}
                  onChange={(e) =>
                    this.handleFieldChange(e, "percent", record.key)
                  }
                  onKeyPress={(e) => this.handleKeyPress(e, record.key)}
                />
              );
            }
            return text;
          },
        },
      ],
    };
  }

  getProduct = (productID) => {
    var prod;
    if (this.state.baseData) {
      const { Product } = this.state.baseData;
      prod =
        Product &&
        Product.find((product) => {
          return product.ProductID === productID;
        });
    }
    return prod;
  };

  componentDidMount() {
    const { testData } = this.props;
    request
      .post("Contract_GetProductProperty", {
        token: this.state.LoggedSysuser.token,
        ProductID: testData.product,
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

        const { ProductProperty } = data.retData;
        const prod = this.getProduct(testData.product);

        let i = ProductProperty.findIndex(
          (property) => property.isRequired === "Y"
        );

        this.setState((prevState) => ({
          loading: false,
          showItem: true,
          itemValid: testData.itemValid || i < 0,
          bufferData: {
            ...prevState.bufferData,
            productProperty: {
              name: prod && prod.ProductName,
              properties: ProductProperty,
            },
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });
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

  newMember = () => {
    const { data } = this.state;
    const newData = data.map((item) => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: "",
      name: "",
      department: "",
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter((item) => item.key !== key);
    this.setState({ data: newData });
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
      target[fieldName] = e.target.value;
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
      if (
        !target.batalgaano ||
        !target.batalgaaogno ||
        !target.DAStartdate ||
        !target.DAEnddate ||
        !target.undsenunel ||
        !target.undsenhuvi ||
        !target.undsenhuraamjdun ||
        !target.nemeltunelgee ||
        !target.nemelthuraamj ||
        !target.nemelthuraamjdun ||
        !target.hongololtiinhuvi ||
        !target.niithuraamj ||
        !target.orlogoavsan ||
        !target.niitunelgee ||
        !target.tailbar ||
        !target.percent
      ) {
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

  prev = () => {
    const { prev } = this.props;
    prev();
  };

  save = (event) => {
    event.preventDefault();
    const { testData } = this.props;
    request
      .post("Contract_ModifyContract", {
        token: this.state.LoggedSysuser.token,
        json: JSON.stringify({ isContract: [testData] }),
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
          message: "",
          description: "Амжилттай хадгаллаа.",
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  };

  render() {
    const { loading, data, columns } = this.state;

    return (
      <>
        <Table
          bordered
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: true }}
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
          <Button type="primary" style={{ marginLeft: 18 }} onClick={this.save}>
            Хадгалах
          </Button>
        </div>
      </>
    );
  }
}
