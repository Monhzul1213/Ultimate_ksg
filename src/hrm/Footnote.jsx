import React, { Component } from "react";
import {
  Card,
  List,
  notification,
  Row,
  Col,
  Button,
  Timeline,
  Modal,
  Spin,
  Form,
  Icon,
  Input,
} from "antd";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import "./Footnote.css";
import IllnessModal from "./IllnessEditModal";
import PhysicalModal from "./PhysicalEditModal";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    const cookieUser = cookie.load("LoggedSysuser");
    const LoggedSysuser = cookie.load("LoggedSysuser");
    var { EmpCode } = LoggedSysuser;
    this.state = {
      LoggedSysuser,
      cookieUser,
      EmpCode,
      FingerModal: false,
      FingerVisible: false,
      MachinCode: "",
      hrEMpDtl: "",
    };
  }
  componentDidMount() {
    if (this.state.EmpCode) {
      this.getProfile(this.state.EmpCode);
    }
  }

  getProfile(EmpCode) {
    this.setState({ loading: true });
    request
      .post(
        "Profile_Get",
        {
          token: this.state.LoggedSysuser.token,
          EmpCode,
        },
        {
          screen:
            "AccountEditModal;EducationEditModal;EmergencyEditModal;ExperienceEditModal;FamilyEditModal;LanguageEditModal;PersonalEditModal;ProfileFullEditModal;TalentsEditModal",
        }
      )
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
        this.setState({ result: data.retData, loading: false, EmpCode });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }
  onSuccess = (data) => {
    let config = {
      editIllness: false,
      editPhysical: false,
    };
    if (data) {
      let { result } = { ...this.state };
      Object.keys(data).forEach((key) => {
        result[key] = data[key];
      });
      config = { ...config, result };
    }
    this.setState(config);
  };

  onChangeControls = (e) => {
    this.setState({ MachinCode: e.target.value });
  };

  fingerUpdate = () => {
    if (this.state.EmpCode) {
      request
        .post("Execute_Query", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            QueryID: "EmpMachineCodeCheck",
            BusinessObject: [{ MachineCode: this.state.MachinCode }],
          }),
        })
        .then((res) => {
          const data = res.data;
          if (data.retType !== 0) {
            notification["error"]({
              message: "Анхаар",
              description: data.retDesc,
            });
            return;
          }
          this.setState({ FingerVisible: false });
          this.getProfile(this.state.EmpCode);
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.error(err);
        });
    }
  };

  render() {
    var EmpDtl, IllnessEditModal, PhysicalEditModal, Illness, Physical;
    if (this.state.result) {
      EmpDtl =
        this.state.result.EmpDtl.length > 0
          ? this.state.result.EmpDtl[0]
          : undefined;
      Illness = this.state.result.Illness;
      Physical = this.state.result.Physical;
      IllnessEditModal = this.state.result.IllnessEditModal;
      PhysicalEditModal = this.state.result.PhysicalEditModal;
    }

    const rowProps = {
      type: "flex",
      gutter: [30, 30],
      style: { marginTop: 0 },
    };

    const colProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
    };

    const listItems = (fields, labelSpan, data) => {
      return (
        <List bordered={false} size="small">
          {fields.map((field) => (
            <List.Item
              key={field.name}
              style={{ borderBottomWidth: "0px", padding: "0px" }}
            >
              <Row gutter={16} style={{ width: "100%" }}>
                <Col span={labelSpan}>
                  <p className="list-label">{field.label + ":"}</p>
                </Col>
                <Col span={24 - labelSpan}>
                  <p className="list-value">{data && data[field.name]}</p>
                </Col>
              </Row>
            </List.Item>
          ))}
        </List>
      );
    };

    const FingerModal = () => {
      this.setState({ FingerVisible: true });
    };

    const handleOk = () => {
      this.setState({ FingerVisible: true });
    };

    const handleCancel = () => {
      this.setState({ FingerVisible: false });
    };

    const cardProps = {
      size: "small",
      headStyle: {
        borderBottomWidth: "0px",
        fontSize: "20px",
        padding: "5px 20px",
      },
      bodyStyle: { padding: "20px" },
      style: { height: "100%", borderRadius: "4px" },
      loading: this.state.loading,
    };

    return (
      <div>
        <Spin spinning={this.state.loading} style={{ height: "100%" }}>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Card
                title="Өвчний мэдээлэл"
                {...cardProps}
                extra={
                  IllnessEditModal &&
                  IllnessEditModal[0] &&
                  IllnessEditModal[0].ModifyPermission && (
                    <Button
                      shape="circle"
                      type="link"
                      size="small"
                      icon="edit"
                      onClick={() => {
                        this.setState({ editIllness: true });
                      }}
                    />
                  )
                }
              >
                <Timeline size="small" className="profile-timeline">
                  {Illness &&
                    Illness.map((item) => (
                      <Timeline.Item color="gray" key={item.RowRecID}>
                        <p className="timeline-value1">
                          {item.hrIllnessTypeDescr}
                        </p>
                        <p className="timeline-value3">
                          {item.IllnessValue + ", " + item.Note}
                        </p>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </Card>
            </Col>
            <Col {...colProps}>
              <Card
                title="Физик үзүүлэлт"
                {...cardProps}
                extra={
                  PhysicalEditModal &&
                  PhysicalEditModal[0] &&
                  PhysicalEditModal[0].ModifyPermission && (
                    <Button
                      shape="circle"
                      type="link"
                      size="small"
                      icon="edit"
                      onClick={() => {
                        this.setState({ editPhysical: true });
                      }}
                    />
                  )
                }
              >
                <Timeline size="small" className="profile-timeline">
                  {Physical &&
                    Physical.map((item) => (
                      <Timeline.Item color="gray" key={item.RowRecID}>
                        <p className="timeline-value1">
                          {item.PhysicsPropertyDescr}
                        </p>
                        <p className="timeline-value3">
                          {item.PhysicalValue + ", " + item.Note}
                        </p>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </Card>
            </Col>

            <Col {...colProps}>
              <Card
                title="Цаг бүртгэлийн мэдээлэл"
                {...cardProps}
                extra={
                  <Button
                    shape="circle"
                    type="link"
                    size="small"
                    icon="edit"
                    onClick={FingerModal}
                  />
                }
              >
                {listItems(
                  [{ name: "MachineCode", label: "Машины код" }],
                  12,
                  EmpDtl
                )}
              </Card>
            </Col>
          </Row>

          {this.state.editIllness && (
            <IllnessModal
              visible={this.state.editIllness}
              data={{
                EmpCode: this.state.EmpCode,
                Illness: this.state.result.Illness,
                IllnessType: this.state.result.IllnessType,
              }}
              onSuccess={this.onSuccess}
            />
          )}
          {this.state.editPhysical && (
            <PhysicalModal
              visible={this.state.editPhysical}
              data={{
                EmpCode: this.state.EmpCode,
                Physical: this.state.result.Physical,
                PhysicsProperty: this.state.result.PhysicsProperty,
              }}
              onSuccess={this.onSuccess}
            />
          )}
        </Spin>
        {this.state.FingerVisible && (
          <Modal
            visible={this.state.FingerVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width="800px"
            bodyStyle={{ padding: "30px" }}
          >
            <Spin spinning={this.state.loading} style={{ height: "100%" }}>
              <h3
                align="center"
                style={{
                  marginBottom: "10px",
                  fontSize: "16pt",
                  marginBottom: "20px",
                }}
              >
                <b>Хурууны мэдээлэл</b>
              </h3>
              <Form>
                <Form.Item style={{ marginBottom: "0px" }}>
                  <Input
                    style={{ marginBottom: "40px" }}
                    placeholder="Цагийн машины код"
                    onChange={this.onChangeControls}
                  />
                  <Form.Item
                    wrapperCol={{
                      xs: {
                        span: 24,
                        offset: 7,
                      },
                      sm: { span: 17, offset: 8 },
                    }}
                    style={{ marginBottom: "0px" }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      size="large"
                      onClick={handleOk}
                      style={{
                        width: "250px",
                        height: "50px",
                        marginBottom: "0px",
                        background: "#0A5287",
                        border: "none",
                      }}
                    >
                      <p
                        style={{ marginBottom: "2px", fontSize: "14pt" }}
                        onClick={this.fingerUpdate}
                      >
                        <b>Хадгалах</b>
                      </p>
                    </Button>
                  </Form.Item>
                </Form.Item>
              </Form>
            </Spin>
          </Modal>
        )}
      </div>
    );
  }
}
