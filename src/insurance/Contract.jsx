import React from "react";
import dashboard_img from "@/image/dashboard_img.jpeg";
import { Steps, Typography, Layout, notification, Icon, Spin } from "antd";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import "./Contract.css";
import cookie from "react-cookies";
import request from "./PostRequest";
import loadingImg from "@/image/loading.gif";

const { Text } = Typography;
const { Step } = Steps;
const { Content, Footer } = Layout;

const BaseInvoiceMode = {
  Action: "action",
  Add: "add",
  Edit: "edit",
  Normal: "normal",
  View: "view",
};

const loadingIcon = (
  <Icon component={() => <img src={loadingImg} alt="loading" />} />
);

const steps = [
  {
    title: "Үндсэн",
    content: (testData, setTestData, next, prev, baseD) => {
      return (
        <Step1
          testData={testData}
          setTestData={setTestData}
          next={next}
          prev={prev}
          baseD={baseD}
        />
      );
    },
  },
  {
    title: "Хамтран даатгагч",
    content: (testData, setTestData, next, prev, baseD) => {
      return (
        <Step2
          testData={testData}
          setTestData={setTestData}
          next={next}
          prev={prev}
          baseD={baseD}
        />
      );
    },
  },
  {
    title: "Дэлгэрэнгүй",
    content: (testData, setTestData, next, prev, baseD) => {
      return (
        <Step3
          testData={testData}
          setTestData={setTestData}
          next={next}
          prev={prev}
          baseData={baseD}
        />
      );
    },
  },
];
class Contract extends React.Component {
  constructor(props) {
    super(props);
    const LoggedSysuser = cookie.load("LoggedSysuser");
    this.state = {
      current: 0,
      LoggedSysuser,
      testData: {},
      loading: true,
      baseD: undefined,
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      bufferData: undefined,
      itemValid: false,
      editable: false,
      loading: false,
    };
  }
  componentDidMount() {
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
        this.setState({
          baseD: res.data.retData,
          loading: false,
        });
        const { ContractNo } = this.props;
        if (ContractNo) this.getData(ContractNo);
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  onChange = (current) => {
    this.setState({ current });
  };

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  setTestData = (data, token) => {
    this.setState({ testData: data, token });
  };

  render() {
    const { current, testData, baseD } = this.state
    return (
      <div style={{ margin: "27px" }}>
        <h3>Гэрээ бүртгэх</h3>
        <h4 style={{ marginBottom: "30px" }}>
          Даатгал / Бүртгэл / <Text color="#6b747b">Гэрээ бүртгэх</Text>
        </h4>
        <div>
          <Layout>
            <Spin indicator={loadingIcon} spinning={this.state.loading}>
              <Content>
                <Layout
                  style={{
                    padding: "24px",
                    background: "#fff",
                  }}
                >
                  <Steps
                    style={{
                      padding: "0px 50px",
                    }}
                    current={current}
                  >
                    {steps.map((item) => (
                      <Step key={item.title} title={item.title} />
                    ))}
                  </Steps>
                  <div className="steps-content">
                    {steps[current].content(
                      testData,
                      baseD,
                      this.setTestData,
                      this.next,
                      this.prev
                    )}
                  </div>
                </Layout>
              </Content>
            </Spin>
          </Layout>
        </div>
      </div>
    );
  }
}

export default Contract;
