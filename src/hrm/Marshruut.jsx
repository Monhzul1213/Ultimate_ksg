import React, { Component } from "react";
import {
  Card,
  List,
  notification,
  Row,
  Col,
  Button,
  Timeline,
} from "antd";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import "./Footnote.css";
import GereesAjilModal from "./GereesAjilEditModal";
import AjilaasGerModal from "./AjilaasGerEditModal";

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
            "GereesAjilEditModal;AjilaasGerEditModal",
        }
      )
      .then((res) => {
        const data = res.data;
        console.log(data);
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
    render() {
      var EmpDtl,
      GereesAjilEditModal,
      AjilaasGerEditModal,
        AjilG,
        GerA;
    if (this.state.result) {
      EmpDtl =
        this.state.result.EmpDtl.length > 0
          ? this.state.result.EmpDtl[0]
          : undefined;
      AjilG = this.state.result.EmpDtl;
      GerA = this.state.result.EmpDtl;
      GereesAjilEditModal = this.state.result.GereesAjilEditModal;
      AjilaasGerEditModal = this.state.result.AjilaasGerEditModal;
    }
    console.log(this.state.result)

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
      <div className="cardFontSize">
            <Row {...rowProps}>
              <Col {...colProps}>
                <Card
                  title="ГЭРЭЭС - АЖИЛ"
                  {...cardProps}
                  extra={
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editIllness: true });
                        }}
                      />
                  }
                >
                  <Timeline size="small" className="profile-timeline">
                    {AjilG &&
                    AjilG.map((item) => (
                        <Timeline.Item color="green" key={item.EmpCode}>
                          <p className="timeline-value1">{item.GereesAjil}</p>
                          <p className="timeline-value3">
                            {item.GereesAjil_time+
                              " - " + "минут"}
                          </p>
                        </Timeline.Item>
                      ))}
                  </Timeline>
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="АЖИЛААС - ГЭР"
                  {...cardProps}
                  extra={
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editPhysical: true });
                        }}
                      />
                  }
                >
                  <Timeline size="small" className="profile-timeline">
                    {GerA &&
                     GerA.map((item) => (
                        <Timeline.Item color="green" key={item.EmpCode}>
                          <p className="timeline-value1">
                            {item.AjilaasGer}
                          </p>
                         <p className="timeline-value3">
                            {item.AjilaasGer_time +
                              " - " + "минут"}
                          </p>
                        </Timeline.Item>
                      ))}
                  </Timeline>
                </Card>
              </Col>
            </Row>

              {this.state.editIllness && (
          <GereesAjilModal
            visible={this.state.editIllness}
            data={{
              EmpCode: this.state.EmpCode,
              EmpDtl: this.state.result.EmpDtl
            }}
            onSuccess={this.onSuccess}
          />
        )}
            {this.state.editPhysical && (
          <AjilaasGerModal
            visible={this.state.editPhysical}
            data={{
              EmpCode: this.state.EmpCode,
              EmpDtl: this.state.result.EmpDtl
            }}
            onSuccess={this.onSuccess}
          />
        )}
      </div>
    );
  }
}
