import React from "react";
import ReactToPrint from "react-to-print";
import ComponentToPrint from './ComponentToPrint.jsx';
import './PrintTarifPayment.css';

class Example extends React.Component {
  render() {
    var currdata = this.props.currdata;
    var currnum = this.props.currnum;
    return (
      <div>
        <ReactToPrint
          trigger={() => <button className="print-button"><span className="print-icon"></span></button>}
          content={() => this.componentRef}
        />
        <div className = "PrintDiv">
          <ComponentToPrint data={currdata} currnum={currnum} ref={el => (this.componentRef = el)} />
        </div>
      </div>
    );
  }
}

export default Example;