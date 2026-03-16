import React from "react";

import Login from "@/main/Login.jsx";
import "./mainRoute.css";
import LeftMenu from "@/main/LeftMenu.jsx";

import { Layout, notification, Spin, Row, Col, Carousel } from "antd";
import logo from "@/image/login_logo.png";
import cookie from "react-cookies";
import request from "@/insurance/PostRequest.js";
import $ from "jquery";
import configUrl from "@/image/config.txt";
import bgSingle from "@/image/login_bg.png";
import slider1 from "@/image/slider/slider1.png";
import slider2 from "@/image/slider/slider2.png";
import slider3 from "@/image/slider/slider3.png";
import slider4 from "@/image/slider/slider4.png";

const LoggedSysuser = cookie.load("LoggedSysuser");

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  resize(canvas) {
    if (!canvas) return;
    canvas.clientWidth = $("canvas").parent().width();
    canvas.clientHeight = $("canvas").parent().height();
    console.log($("canvas").parent().height());
  }

  componentDidUpdate() {
    const { angle } = this.props;
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    this.resize(canvas);

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = "#4397AC";
    ctx.fillRect(25, 25, 50, 50);
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

class compon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      a: 1,
      user: "",
      pass: "",
      cookieUser: "",
      cookiePass: "",
      device: "",
      moduls: [],
      isOtpModalVisible: false,

      // 🔹 Зүүн талын тохиргоо (config.txt-оос уншина)
      sliderMode: "single", // "single" эсвэл "slider"
      sliderCount: 1, // slider үед хэдэн зураг (1–4)
      sliderSpeed: 3000, // ms – default 3 секунд
    };
  }

  componentDidMount() {
    this.setState({
      isOtpModalVisible: false,
      device: navigator.userAgent.replace(/;/g, ""),
    });

    console.log("LoggedSysuser", LoggedSysuser);

    if (LoggedSysuser) {
      this.funcs.init(
        LoggedSysuser.token,
        LoggedSysuser.UserID,
        LoggedSysuser.Password,
        navigator.userAgent.replace(/;/g, ""),
        LoggedSysuser.CompanyID,
        LoggedSysuser.RemotePort,
        LoggedSysuser.RemoteIP
      );
    }

    // ⬇ config.txt уншина
    this.loadSliderConfig();
  }

  // ⬇ Бүх боломжит slider зургууд (src дотор import-лосон)
  allSliderImages = [slider1, slider2, slider3, slider4];

  // ⬇ image/config.txt–ээс type, count, speed унших
  loadSliderConfig = async () => {
    try {
      const res = await fetch(`${configUrl}?_=${Date.now()}`, {
        cache: "no-store",
      });

      console.log("config status:", res.status, res.ok);

      if (!res.ok) {
        console.warn("config.txt not found, using defaults");
        return;
      }

      const text = await res.text();
      console.log("config text:", text);

      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      let mode = this.state.sliderMode;
      let count = this.state.sliderCount;
      let speed = this.state.sliderSpeed;

      lines.forEach((line) => {
        const [rawKey, rawVal] = line.split("=");
        if (!rawKey || !rawVal) return;

        const key = rawKey.trim().toLowerCase();
        const valRaw = rawVal.trim();
        const val = valRaw.toLowerCase();

        if (key === "type") {
          if (val === "single" || val === "slider") {
            mode = val;
          }
        } else if (key === "count") {
          const n = parseInt(val, 10);
          if (!isNaN(n) && n > 0) {
            count = Math.min(n, this.allSliderImages.length); // max 4
          }
        } else if (key === "speed") {
          // ms-ээр (жишээ: 5000)
          const s = parseInt(val, 10);
          if (!isNaN(s) && s > 0) {
            speed = Math.max(1000, s); // 1 секундээс доош байлгахгүй
          }
        }
      });

      this.setState(
        {
          sliderMode: mode,
          sliderCount: count,
          sliderSpeed: speed,
        },
        () => {
          console.log(
            "UPDATED CONFIG ->",
            this.state.sliderMode,
            this.state.sliderCount,
            this.state.sliderSpeed
          );
        }
      );
    } catch (err) {
      console.error("config.txt уншихад алдаа гарлаа:", err);
      // алдаа гарвал default-наасаа өөрчлөхгүй
    }
  };

  funcs = {
    init: (token1, user, pass, device, cpnyid, remoteport, remoteip) => {
      if ((user === "" || pass === "") && token1 === "") return false;
      this.setState({
        loading: true,
      });
      request
        .post("RemoteLogin", {
          token: token1,
          Name: user,
          Password: pass,
          device: device,
          cpnyid: cpnyid,
          remoteip: remoteip,
          remoteport: remoteport,
          version: "3.3.0.2",
        })
        .then(this.funcs.initSucc)
        .catch(this.funcs.initErr);
    },
    initSucc: (data) => {
      console.log(data);
      if (data.data.retType === 0) {
        if (LoggedSysuser) {
          cookie.remove("LoggedSysuser");
        }

        cookie.save("LoggedSysuser", data.data.retData.LoggedSysuser);
        cookie.setRawCookie("EmpCode", null);
        cookie.setRawCookie("UserID", null);
        this.setState({
          a: 0,
          loading: false,
          moduls: data.data.retData.moduls,
        });
      } else {
        console.log(data);
        cookie.remove("LoggedSysuser");
        notification["error"]({
          message: "Алдаа гарлаа",
          description: data.data.retDesc,
        });
        this.setState({
          a: 1,
          loading: false,
        });
      }
    },
    initErr: (data) => {
      notification["error"]({
        message: "Aldaa garlaa",
        description: "Холболт тасарлаа",
      });
      this.setState({ loading: false });
    },
  };

  onSuccess = (e, username, password, companyId, companydata) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const list = Array.isArray(companydata) ? companydata : [];

    const selectedCompany = list.find(
      (c) => String(c.CpnyID) === String(companyId)
    );

    const remoteport =
      selectedCompany && selectedCompany.Port ? selectedCompany.Port : "";
    const remoteip =
      selectedCompany && selectedCompany.Server ? selectedCompany.Server : "";

    if (this.funcs && typeof this.funcs.init === "function") {
      this.funcs.init(
        "",
        username,
        password,
        this.state.device,
        companyId,
        remoteport,
        remoteip
      );
    }

    this.setState({ user: username, otpCode: "" });
  };

  // ⬇ Зүүн талын хэсгийг (single эсвэл slider) render хийнэ
  renderLeftSide = () => {
    const { sliderMode, sliderCount, sliderSpeed } = this.state;

    // SINGLE горим → зөвхөн login_bg.png
    if (sliderMode === "single") {
      return (
        <div
          className="login-slide"
          style={{
            backgroundImage: `url(${bgSingle})`,
          }}
        />
      );
    }

    // SLIDER горим → slider1..N.png
    const imagesToShow = this.allSliderImages.slice(
      0,
      Math.max(1, sliderCount)
    );

    return (
      <Carousel
        autoplay
        autoplaySpeed={sliderSpeed}
        effect="scrollx"
        dots={true}
        className="login-carousel"
      >
        {imagesToShow.map((src, index) => (
          <div key={index}>
            <div
              className="login-slide"
              style={{
                backgroundImage: `url(${src})`,
              }}
            />
          </div>
        ))}
      </Carousel>
    );
  };

  render() {
    // a === 1 үед Login, a === 0 үед Main layout
    if (1 === this.state.a) {
      return (
        <Row type="flex" className="login-container">
          <Col
            className="login-left"
            xs={0}
            sm={0}
            md={0}
            lg={12}
            xl={15}
            xxl={17}
          >
            {this.renderLeftSide()}
          </Col>

          <Col
            className="login-right"
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={9}
            xxl={7}
          >
            <div className="login-logo">
              <img width={260} src={logo} alt="Logo" />
            </div>
            <Spin
              spinning={this.state.loading}
              wrapperClassName="wrapperClassName"
            >
              <Login onSuccess={this.onSuccess} />
            </Spin>
            <div className="login-cpny">
              &copy;2025{" "}
              <a
                className="web-site"
                target="_blank"
                rel="noreferrer"
                href="https://ultimate.mn/"
              >
                www.ultimate.mn
              </a>
            </div>
          </Col>
        </Row>
      );
    }

    // logged in state
    return (
      <Layout className="MainContent">
        <LeftMenu moduls={this.state.moduls} />
      </Layout>
    );
  }
}

export default compon;
