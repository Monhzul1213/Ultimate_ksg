import React from "react";
import { Row, Col, Card, Icon, Tooltip } from "antd";
import { withRouter } from "react-router-dom";

import "./HrContent1.css";
import { ArrowRightOutlined } from "@ant-design/icons";

class HrContent1 extends React.Component {
  handleResize = () => {
    this.tableHeight = window.innerHeight - 380;
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  onClickNewEmp = () => {
    localStorage.setItem("passedDataType", "new");
    localStorage.setItem("passedData", JSON.stringify(this.props.data1 || []));
    this.props.history.push("/EmployeeInquiry");
  };

  onClickSackEmp = () => {
    localStorage.setItem("passedDataType", "sack");
    localStorage.setItem("passedData", JSON.stringify(this.props.data2 || []));
    this.props.history.push("/EmployeeInquiry");
  };

  handleCloseModal = () => {
    this.setState({ showReport: false, showReport1: false });
  };

  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return <div></div>;
    }

    const {
      TotalEmp = 0,
      NewEmp = 0,
      SackEmp = 0,
      NewEmpAgo = 0,
      SackEmpAgo = 0,
      TotalEmpAll = 0,
    } = data[0] || {};

    const detailData = [
      {
        label: "Нийт ажилтны тоо",
        value: TotalEmp,
        subText: `Нийт бүртгэлтэй: ${TotalEmpAll}`,
        clickable: false,
        tooltip: "Гэрээний бүртгэл  хийгдсэн, одоо идэвхтэй төлөвтэй ажилтны тоог энд харуулах тул ажилтны мэдээлэл дээрх тооноос зөрж болно. Хэрэв зөрүүтэй байвал гэрээний бүртгэлийг бүрэн хийх ёстойг санаарай! Харин \"Нийт бүртгэлтэй\" тоо нь урьд өмнө бүхий л  хугацаанд гэрээний бүртгэл үүсэж орсон/гарсан бүх ажилтны тоо болно.",
      },
      {
        label: "Шинэ ажилтны тоо",
        value: NewEmp,
        subText: `Өмнөх сард: ${NewEmpAgo}`,
        onClick: this.onClickNewEmp,
        clickable: true,
        tooltip: "Энэ сард шинээр нэмэгдсэн ажилтны тоо бөгөөд гэрээний бүртгэл дээрх эхлэх огноогоор энэ сард эсвэл өмнөх сард нэмэгдсэн эсэхийг шалгана. ",
      },
      {
        label: "Гарсан ажилтны тоо",
        value: SackEmp,
        subText: `Өмнөх сард: ${SackEmpAgo}`,
        onClick: this.onClickSackEmp,
        clickable: true,
        tooltip: "Энэ сард ажлаас гарсан ажилтны тоо бөгөөд халагдах (хөдөлмөрийн гэрээ дуусгавар болгох) тушаалын бүртгэл дээрх огноогоор энэ сард эсвэл өмнөх сард гарсан эсэхийг шалгана. ",
      },
    ];

    return (
      <div className="card-header hr-overview-wrapper">
        <Row gutter={[20, 20]} justify="center">
          {detailData.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
              <Card className={`hr-overview-card ${item.clickable && item.value > 0 ? "is-clickable" : ""}`} onClick={item.clickable && item.value > 0 ? item.onClick : null}>
                <div className="hr-overview-title">
                  {item.label}
                  {item.tooltip && (
                    <Tooltip title={item.tooltip} placement="right" overlayClassName="hr-tooltip">
                      <Icon
                        type="info-circle-o"
                        className="info-icon"
                        style={{ marginLeft: 6, cursor: "pointer", color: "#8c96a5" }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Tooltip>
                  )}
                </div>
                <div className="hr-overview-value">{item.value}</div>

                <div className="hr-overview-subtext">{item.subText}</div>

                {/* {item.clickable && item.value > 0 ? (
                  <div className="hr-overview-action" >
                    <ArrowRightOutlined />
                  </div>
                ) : null} */}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default withRouter(HrContent1);