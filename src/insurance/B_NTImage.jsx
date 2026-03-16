import React, { Component } from "react";
import { Upload, Icon, Modal, Form, Button, message } from "antd";
import "./InImageU.css";
import moment, { isMoment } from "moment";
const dateFormat = "YYYY.MM.DD";
const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
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
    previewVisible: false,
    fileList: [
      {
        name: "image.png",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      },
    ],
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
  handleModalCancel = () => this.setState({ previewVisible: false });

  handleModalPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleModalChange = ({ fileList }) => this.setState({ fileList });
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    return (
      <div>
        <div className="an-btn">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handleModalPreview}
            onChange={this.handleModalChange}
          ></Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
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
export default class InImageU extends Component {
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
