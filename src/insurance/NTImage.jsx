import React, { Component } from "react";
import {
  Upload,
  Icon,
  Modal,
  Form,
  Button,
  Table,
  Input,
  DatePicker,
  Popconfirm,
  Divider,
  message,
} from "antd";
import "./InImageU.css";
import moment, { isMoment } from "moment";
const dateFormat = "YYYY.MM.DD";

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

class FormImage extends React.Component {
  state = {
    previewImage: "",
    visible: false,
    profile_image: undefined,
    data: [],
  };

  handleCancel = () => this.setState({ visible: false });

  handleChange = (info) => {
    getBase64(info.file.originFileObj, (imageUrl) =>
      this.setState({
        profile_image: imageUrl,
      })
    );
    info.file.status = "done";
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  render() {
    const { data } = this.state;
    const columns = [
      {
        title: "Зургийг нэмсэн огноо",
        dataIndex: "Date",
        key: "Date",
        render: () => {
          const { getFieldDecorator } = this.props.form;
          return (
            <Form>
              {getFieldDecorator("CaseAddress", {
                initialValue: moment(this.state.today, dateFormat),
              })(<DatePicker format={dateFormat} />)}
            </Form>
          );
        },
      },
      {
        title: "Зургийн нэр",
        dataIndex: "iName",
        key: "iName",
        render: () => {
          const { getFieldDecorator } = this.props.form;
          return <Form>{getFieldDecorator("CaseA")(<Input />)}</Form>;
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
                  <Divider type="vertical" />
                  <Popconfirm
                    title="Өгөгдлийг устгах уу？"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => this.remove(record.key)}
                  >
                    <a>Устгах</a>
                  </Popconfirm>
                </span>
              );
            }
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

    return (
      <div>
        <div className="an-btn">
          <Table
            bordered
            columns={columns}
            dataSource={data}
            pagination={false}
          />
          <Button
            className="buton7"
            onClick={this.showModal}
            style={{ marginTop: "20px" }}
          >
            Зураг нэмэх
          </Button>
        </div>
        <div>
          <Modal
            okText="Хадгалах"
            cancelText="Болих"
            onCancel={this.handleCancel}
            visible={this.state.visible}
            className="modal-p"
          >
            <Upload
              name="file"
              multiple={true}
              onChange={this.handleChange}
              beforeUpload={beforeUpload}
            >
              <Button
                className="anb-bt"
                type="link"
                style={{ fontSize: "13pt" }}
              >
                <Icon type="plus-circle" /> Нэмэх
              </Button>
            </Upload>
          </Modal>
        </div>
      </div>
    );
  }
}

const WrappedContractForm = Form.create({ name: "contract_form" })(FormImage);
export default class NTImage extends Component {
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
