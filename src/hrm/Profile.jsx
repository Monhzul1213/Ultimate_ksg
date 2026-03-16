import React, { Component } from "react";
import {
  Tabs,
  Card,
  List,
  Table,
  notification,
  Row,
  Col,
  Button,
  Avatar,
  Timeline,
  Typography,
  Icon,
  Modal,
} from "antd";
import cookie from "react-cookies";
import request from "../insurance/PostRequest";
import "./Profile.css";
import ProfileModal from "./ProfileFullEditModal";
import RegistryModal from "./PersonalEditModal";
import EmergencyModal from "./EmergencyEditModal";
import AccountModal from "./AccountEditModal";
import FamilyModal from "./FamilyEditModal";
import EducationModal from "./EducationEditModal";
import ExperienceModal from "./ExperienceEditModal";
import LanguageModal from "./LanguageEditModal";
import SkillModal from "./TalentsEditModal";
import EmployeeDoc from "./EmployeeDoc";
import Footnote from "./Footnote";
import Marshruut from "./Marshruut";
import male from "@/image/male.png";
import female from "@/image/female.png";

import Confetti from "react-confetti";
import logo from "@/image/cake.jpg";

const { TabPane } = Tabs;
const { Text } = Typography;
export default class Profile extends Component {
  constructor(props) {
    super(props);
    const cookieUser = cookie.load("LoggedSysuser");
    const LoggedSysuser = cookie.load("LoggedSysuser");
    const { EmpCode } = props.match.params;

    this.state = {
      LoggedSysuser,
      cookieUser,
      EmpCode,
      isModelOpen: false,
      userName: "",
    };
  }

  componentDidMount() {
    if (this.state.EmpCode) {
      request
        .post("Execute_Query", {
          token: this.state.LoggedSysuser.token,
          json: JSON.stringify({
            QueryID: "EmpBirthDayCheck",
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
          data != null &&
            data.retData.Table.map((el) => {
              if (el.IsBirthDate === 1) {
                this.setState({
                  isModelOpen: true,
                  userName: el.UserName,
                });
              }
            });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.error(err);
        });

      this.getProfile(this.state.EmpCode);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { EmpCode } = nextProps.match.params;
    if (EmpCode != this.state.EmpCode) {
      this.getProfile(EmpCode);
    }
  }

  getProfile(EmpCode) {
    // this.setState({ loading: true });
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
        console.log("response-------", res);
        if (data.retType !== 0) {
          this.setState({ loading: false });
          notification["error"]({
            message: "Анхаар",
            description: data.retDesc,
          });
          return;
        }
        this.setState({ result: data.retData, loading: false, EmpCode });
        if (
          this.state.result.EmpDtl[0] != null &&
          this.state.result.EmpDtl[0].IsBirthDate === 1
        ) {
          // this.setState({ isModelOpen: true });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }
  onSuccess = (data) => {
    let config = {
      editProfile: false,
      editRegistry: false,
      editAccount: false,
      editEmergency: false,
      editFamily: false,
      editEducation: false,
      editExperience: false,
      editLanguage: false,
      editSkill: false,
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

  onCancelReport = () => {
    this.setState({ isModelOpen: false });
  };

  render() {
    console.log(this.state);
    console.log("cookie", this.state.cookieUser);
    console.log("cookie", this.state.LoggedSysuser);
    var EmpDtl,
      FamilyMember,
      Education,
      ExperienceHistory,
      LanguageSkill,
      ProfileFullEditModal,
      EducationEditModal,
      AccountEditModal,
      EmergencyEditModal,
      ExperienceEditModal,
      FamilyEditModal,
      LanguageEditModal,
      PersonalEditModal,
      TalentsEditModal,
      Skill;
    if (this.state.result) {
      EmpDtl =
        this.state.result.EmpDtl.length > 0
          ? this.state.result.EmpDtl[0]
          : undefined;
      FamilyMember = this.state.result.FamilyMember;
      Education = this.state.result.Education;
      ExperienceHistory = this.state.result.ExperienceHistory;
      LanguageSkill = this.state.result.LanguageSkill;
      ProfileFullEditModal = this.state.result.ProfileFullEditModal;
      AccountEditModal = this.state.result.AccountEditModal;
      EducationEditModal = this.state.result.EducationEditModal;
      EmergencyEditModal = this.state.result.EmergencyEditModal;
      ExperienceEditModal = this.state.result.ExperienceEditModal;
      FamilyEditModal = this.state.result.FamilyEditModal;
      LanguageEditModal = this.state.result.LanguageEditModal;
      PersonalEditModal = this.state.result.PersonalEditModal;
      TalentsEditModal = this.state.result.TalentsEditModal;
      Skill = this.state.result.Skill;
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

    const tableProps = {
      size: "small",
      pagination: false,
      rowKey: "RowRecID",
      className: "profile-table",
      scroll: { x: "max-content" },
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
      <div style={{ margin: "27px" }}>
        <h3>Ажилтны хувийн хэрэг</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Хүний нөөц / Бүртгэл /{" "}
          <Text color="#6b747b">
            {/* {`${this.state.cookieUser.EmpFLName.slice(0, -1)}`} */}
            {EmpDtl && EmpDtl.EmpFName + "." + EmpDtl.EmpLName.slice(0, 1)}
          </Text>
          <Modal
            visible={this.state.isModelOpen}
            footer={null}
            width={600}
            bodyStyle={{ height: "50vh" }}
            onCancel={this.onCancelReport}
          >
            <div style={{ textAlign: "center" }}>
              <Avatar
                shape="circle"
                className="AvatarImg"
                icon={
                  <img
                    src={
                      EmpDtl && EmpDtl.Gender && EmpDtl.Gender === "M"
                        ? male
                        : female
                    }
                  />
                }
                src={
                  EmpDtl
                    ? request.host +
                      "avatars/" +
                      EmpDtl.EmpCode +
                      ".jpg?" +
                      Date.now()
                    : ""
                }
              />
            </div>

            <div style={{ textAlign: "center", marginTop: "8%" }}>
              {/* <h3 style={{ marginBottom: "6%" }}>HAPPY BIRTHDAY</h3> */}
              <p style={{ fontSize: 18, fontFamily: "Lobster, cursive" }}>
                Хамгийн аз жаргалтай өдөр нь тохиож <br /> буй
                <bold
                  style={{
                    fontSize: "x-large",
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  {this.state.userName}
                </bold>{" "}
                танд <br />
                төрсөн өдрийн мэнд хүргэе
              </p>
            </div>

            {/* <Row gutter={16} type="flex"> */}
            {/* <Col
                xs={24}
                sm={24}
                md={24}
                lg={6}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "white",
                  }}
                />{" "}
              </Col> */}
            {/* <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                style={{
                  textAlign: "center",
                }}
              >
                <h3>Төрсөн өдрийн мэнд хүргэе</h3>
              </Col> */}
            {/* <Col xs={24} sm={24} md={24} lg={6}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "white",
                  }}
                />{" "}
              </Col> */}
            {/* </Row> */}
            <Confetti
              numberOfPieces={80}
              width={600}
              height={450}
              style={{ textAlign: "center" }}
            />
          </Modal>
        </h4>

        <Card {...cardProps}>
          <Row type="flex">
            <Col span={24}>
              <div className="profile-view">
                <div
                  className="profile-img-wrap"
                  style={{ height: "160px", width: "120px" }}
                >
                  <div>
                    <Avatar
                      shape="square"
                      style={{ borderRadius: "0px" }}
                      className="profile-img"
                      icon={
                        <img
                          src={
                            EmpDtl && EmpDtl.Gender && EmpDtl.Gender === "M"
                              ? male
                              : female
                          }
                        />
                      }
                      src={
                        EmpDtl
                          ? request.host +
                            "avatars/" +
                            EmpDtl.EmpCode +
                            ".jpg?" +
                            Date.now()
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="profile-basic">
                  <Row type="flex" gutter={[20, 0]}>
                    <Col xs={24} sm={24} md={24} lg={11}>
                      <div className="profile-info-left">
                        <h3>
                          {EmpDtl && EmpDtl.EmpLName + " " + EmpDtl.EmpFName}
                        </h3>
                        <p className="profile-value">
                          {EmpDtl && EmpDtl.DepartmentDescr}
                        </p>
                        <p
                          style={{ marginBottom: "20px" }}
                          className="profile-value"
                        >
                          {EmpDtl && EmpDtl.PosDescr}
                        </p>
                        <p className="profile-value" style={{ color: "black" }}>
                          Ажилтны код: {EmpDtl && EmpDtl.EmpCode}
                        </p>
                        <p className="profile-value">
                          Ажилд орсон огноо: {EmpDtl && EmpDtl.HireDate}
                        </p>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={13}>
                      {listItems(
                        [
                          { name: "Phone", label: "Утасны дугаар" },
                          { name: "WorkMail", label: "Ажлын имэйл хаяг" },
                          { name: "BirthDate", label: "Төрсөн огноо" },
                          { name: "GenderDescr", label: "Хүйс" },
                          { name: "Addr1", label: "Хаяг" },
                          { name: "LeaderEmpName", label: "Шууд удирдлага" },
                        ],
                        8,
                        EmpDtl
                      )}
                    </Col>
                  </Row>
                </div>
                {ProfileFullEditModal &&
                  ProfileFullEditModal[0] &&
                  ProfileFullEditModal[0].ModifyPermission && (
                    <div className="pro-edit">
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editProfile: true });
                        }}
                      />
                    </div>
                  )}
              </div>
            </Col>
          </Row>
        </Card>
        <Tabs
          defaultActiveKey="1"
          size="large"
          tabBarGutter={0}
          className="profile-tab"
          tabBarStyle={{
            background: "white",
            borderLeftColor: "#e8e8e8",
            borderLeftWidth: "1px",
            borderLeftStyle: "solid",
            borderRightColor: "#e8e8e8",
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            marginBottom: "20px",
          }}
        >
          <TabPane tab="Хувийн мэдээлэл" key="1">
            <Row {...rowProps}>
              <Col {...colProps}>
                <Card
                  title="Иргэний бүртгэл"
                  {...cardProps}
                  extra={
                    PersonalEditModal &&
                    PersonalEditModal[0] &&
                    PersonalEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editRegistry: true });
                        }}
                      />
                    )
                  }
                >
                  {listItems(
                    [
                      { name: "RegistryNumber", label: "Регистрийн дугаар" },
                      { name: "CountryName", label: "Иргэний харъяалал" },
                      { name: "CityName", label: "Төрсөн аймаг" },
                      { name: "SoumDescr", label: "Төрсөн сум" },
                      { name: "BirthPlace", label: "Төрсөн газар" },
                      { name: "NationalityDescr", label: "Яс үндэс" },
                      { name: "IsMarriedDescr", label: "Гэрлэлтийн байдал" },
                    ],
                    12,
                    EmpDtl
                  )}
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Яаралтай үед холбогдох"
                  {...cardProps}
                  extra={
                    EmergencyEditModal &&
                    EmergencyEditModal[0] &&
                    EmergencyEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editEmergency: true });
                        }}
                      />
                    )
                  }
                >
                  <p className="list-value">
                    {EmpDtl && EmpDtl.EmergencyContact}
                  </p>
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Цалингийн данс, даатгал"
                  {...cardProps}
                  extra={
                    AccountEditModal &&
                    AccountEditModal[0] &&
                    AccountEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editAccount: true });
                        }}
                      />
                    )
                  }
                >
                  {listItems(
                    [
                      { name: "BankName", label: "Банкны нэр" },
                      { name: "CardNumber", label: "Дансны дугаар" },
                      { name: "NDSHTypeDescr", label: "Даатгуулагчийн төрөл" },
                      { name: "NDDNumber", label: "НД дэвтрийн дугаар" },
                      { name: "EMDNumber", label: "ЭМД дэвтрийн дугаар" },
                      { name: "Email", label: "Хувийн имэйл хаяг" },
                    ],
                    12,
                    EmpDtl
                  )}
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Гэр бүлийн мэдээлэл"
                  {...cardProps}
                  extra={
                    FamilyEditModal &&
                    FamilyEditModal[0] &&
                    FamilyEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editFamily: true });
                        }}
                      />
                    )
                  }
                >
                  <Table
                    {...tableProps}
                    columns={[
                      { title: "Нэр", dataIndex: "FirstName" },
                      { title: "Хэн болох", dataIndex: "RelationDescr" },
                      { title: "Төрсөн он", dataIndex: "BirthDate" },
                      { title: "Ажил эрхлэлт", dataIndex: "CurrentJob" },
                      { title: "Утасны дугаар", dataIndex: "PhoneNumber" },
                    ]}
                    dataSource={FamilyMember}
                  />
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Боловсролын мэдээлэл"
                  {...cardProps}
                  extra={
                    EducationEditModal &&
                    EducationEditModal[0] &&
                    EducationEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editEducation: true });
                        }}
                      />
                    )
                  }
                >
                  <Timeline size="small" className="profile-timeline">
                    {Education &&
                      Education.map((item) => (
                        <Timeline.Item color="gray" key={item.RowRecID}>
                          <p className="timeline-value1">{item.SchoolName}</p>
                          <p className="timeline-value2">
                            {item.ProfessionDescr + ", " + item.DegreeDescr}
                          </p>
                          <p className="timeline-value3">
                            {item.CertificateNo +
                              ", " +
                              item.FromYear +
                              " - " +
                              item.ToYear}
                          </p>
                        </Timeline.Item>
                      ))}
                  </Timeline>
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Ажилласан туршлага"
                  {...cardProps}
                  extra={
                    ExperienceEditModal &&
                    ExperienceEditModal[0] &&
                    ExperienceEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editExperience: true });
                        }}
                      />
                    )
                  }
                >
                  <Timeline size="small" className="profile-timeline">
                    {ExperienceHistory &&
                      ExperienceHistory.map((item) => (
                        <Timeline.Item color="gray" key={item.RowRecID}>
                          <p className="timeline-value1">
                            {item.PositionDesc + ", " + item.OrgName}
                          </p>
                          <p className="timeline-value3">
                            {item.DateFrom +
                              " - " +
                              item.DateTo +
                              " (" +
                              item.PeriodDescr +
                              ")"}
                          </p>
                        </Timeline.Item>
                      ))}
                  </Timeline>
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Хэлний мэдлэг"
                  {...cardProps}
                  extra={
                    LanguageEditModal &&
                    LanguageEditModal[0] &&
                    LanguageEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editLanguage: true });
                        }}
                      />
                    )
                  }
                >
                  <Table
                    {...tableProps}
                    columns={[
                      { title: "Эзэмшсэн хэл", dataIndex: "LanguageDescr" },
                      { title: "Сонсох", dataIndex: "ListeningDescr" },
                      { title: "Ярих", dataIndex: "SpeakingDescr" },
                      { title: "Унших", dataIndex: "ReadingDescr" },
                      { title: "Бичих", dataIndex: "WritingDescr" },
                    ]}
                    dataSource={LanguageSkill}
                  />
                </Card>
              </Col>
              <Col {...colProps}>
                <Card
                  title="Бусад ур чадварууд"
                  {...cardProps}
                  extra={
                    TalentsEditModal &&
                    TalentsEditModal[0] &&
                    TalentsEditModal[0].ModifyPermission && (
                      <Button
                        shape="circle"
                        type="link"
                        size="small"
                        icon="edit"
                        onClick={() => {
                          this.setState({ editSkill: true });
                        }}
                      />
                    )
                  }
                >
                  <Table
                    {...tableProps}
                    columns={[
                      { title: "Ур чадвар", dataIndex: "SkillTypeDescr" },
                      { title: "Түвшин", dataIndex: "LevelValue" },
                      { title: "Чадварын тухай мэдээлэл", dataIndex: "Note" },
                    ]}
                    dataSource={Skill}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Холбоотой файлууд" key="2">
            <EmployeeDoc />
          </TabPane>
          <TabPane tab="Нэмэлт мэдээлэл" key="3">
            <Footnote />
          </TabPane>
          <TabPane tab="Маршрут" key="4">
            <Marshruut />
          </TabPane>
        </Tabs>
        {this.state.editProfile && (
          <ProfileModal
            visible={this.state.editProfile}
            data={{
              EmpDtl: this.state.result.EmpDtl,
              Gender: this.state.result.hrEmp_Gender,
              Company: this.state.result.Company,
              Department: this.state.result.Department,
              PosType: this.state.result.PosType,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editRegistry && (
          <RegistryModal
            visible={this.state.editRegistry}
            data={{
              EmpDtl: this.state.result.EmpDtl,
              Country: this.state.result.Country,
              City: this.state.result.City,
              Soum: this.state.result.Soum,
              Nationality: this.state.result.Nationality,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editAccount && (
          <AccountModal
            visible={this.state.editAccount}
            data={{
              EmpDtl: this.state.result.EmpDtl,
              NDSHType: this.state.result.NDSHType,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editEmergency && (
          <EmergencyModal
            visible={this.state.editEmergency}
            data={{
              EmpDtl: this.state.result.EmpDtl,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editFamily && (
          <FamilyModal
            visible={this.state.editFamily}
            data={{
              EmpCode: this.state.EmpCode,
              FamilyMember: this.state.result.FamilyMember,
              Relation: this.state.result.Relation,
              Gender: this.state.result.hrEmp_Gender,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editEducation && (
          <EducationModal
            visible={this.state.editEducation}
            data={{
              EmpCode: this.state.EmpCode,
              Education: this.state.result.Education,
              Profession: this.state.result.Profession,
              Degree: this.state.result.Degree,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editExperience && (
          <ExperienceModal
            visible={this.state.editExperience}
            data={{
              EmpCode: this.state.EmpCode,
              ExperienceHistory: this.state.result.ExperienceHistory,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editLanguage && (
          <LanguageModal
            visible={this.state.editLanguage}
            data={{
              EmpCode: this.state.EmpCode,
              LanguageSkill: this.state.result.LanguageSkill,
              Language: this.state.result.Language,
              hrLanguage_Skill: this.state.result.hrLanguage_Skill,
            }}
            onSuccess={this.onSuccess}
          />
        )}
        {this.state.editSkill && (
          <SkillModal
            visible={this.state.editSkill}
            data={{
              EmpCode: this.state.EmpCode,
              Skill: this.state.result.Skill,
              SkillType: this.state.result.SkillType,
            }}
            onSuccess={this.onSuccess}
          />
        )}
      </div>
    );
  }
}
