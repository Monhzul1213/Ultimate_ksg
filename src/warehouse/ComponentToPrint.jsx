import React from "react";
import './PrintTarifPayment.css';
import logo from '@/image/AmgalanLogo.png'; 
import { Table } from 'antd';
import NumberFormat from 'react-number-format';

class ComponentToPrint extends React.Component {

  table2 ={
    columns:[{
      key:"key",
      dataIndex:"key",
      title:"№",
      align:"center",
      width:10,
      render:(a,i)=>{
        return <div className="tableColumn">1</div>
      }
    },{
      key:"InvtID",
      dataIndex:"InvtID",
      title:"Код",
      align:"center",
      width:150,
    },{
      key:"Descr",
      dataIndex:"Descr",
      title:"Нэр",
      align:"center",
      ellipsis:true,
      width:200,
      color:'#000',
      render:(a,i)=>{
        return <div className="tableColumn">{i.Descr}</div>
      }
    },{
      key:"UnitID",
      dataIndex:"UnitID",
      title:"Нэгж",
      align:"center",
    },{
      key:"UnitQty",
      dataIndex:"UnitQty",
      title:"Тоо",
      align:"center",
      render:(a,i)=>{
        return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{borderWidth:0}} /></div>
      }
    },{
      key:"TarifDayCount",
      dataIndex:"TarifDayCount",
      title:"Хоног",
      align:"center",
      render:(a,i)=>{
        return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{borderWidth:0}} /></div>
      }
    },{
      key:"TarifAmount",
      dataIndex:"TarifAmount",
      title:"Төлбөр",
      align:"center",
      render:(a,i)=>{
        return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{borderWidth:0}} /></div>
      }
    }]
  }
  
  render() {

    const data = [];
    for (let i1=0; i1 < this.props.data.data.length; i1++) {
      if (this.props.data.data[i1].PReturnNo === this.props.currnum) {
        data.push(this.props.data.data[i1]);
      }
    }

    const data1 = [];
    for (let i1=0; i1 < this.props.data.data1.length; i1++) {
      if (this.props.data.data1[i1].PReturnNo === this.props.currnum) {
        data1.push(this.props.data.data1[i1]);
      }
    }

    var QRCode = require('qrcode.react');
    return (
      <div className="PrintTarifPayment">
            <div className="PrintPage">
              <div className="PrintTitle">
                <div className="PrintTitleLeft">
                  <div >ТӨЛБӨРИЙН НЭХЭМЖЛЭХ</div>
                </div> 
                <div className="PrintTitleRight">
                  <div><img src={logo} alt="Logo" style={{width: 250, height: 65}}/></div>
                </div>              
              </div>              
              <div className="PrintContent">
                <div>УБ, БЗД, 10-р хороо, Амгалан өртөө, Билэг ХХК байр</div>
                <div>Web: www.amgalan.mn</div>
                <div>Mail: info@amgalan.mn</div>
                <div>Утас: 7510-0005   факс: 7510-0005</div>
              </div>
              <div className="PrintContentCon">
                <div className="PrintContent1">
                  <div><QRCode size={105, 105} value={data[0].PReturnNo+','+data[0].ARDocNo+','+data[0].TxnDate+','+data[0].VendName} /></div>
                </div>  
                <div className="PrintContent2">
                  <div>Дугаар </div>
                  <div>Нэхэмжилсэн</div>
                  <div>Төлөх</div>
                  <div>Төлөгч </div>
                  <div>Гүйлгээ хийсэн</div>
                </div>
                <div className="PrintContent3">
                  <div>{data[0].ARDocNo}</div>
                  <div>{data[0].TxnDate}</div>
                  <div>{data[0].PayDate}</div>
                  <div>{data[0].VendName}</div>
                  <div>{data[0].ARUser}</div>
                </div>
              </div>
              <div className="PrintContentCon">
                <div className="PrintContent4">
                  <div>Олголтын дугаар:</div>
                  <div>Мэдүүлгийн дугаар:</div>
                </div>
                <div className="PrintContent5">
                  <div>{data[0].PReturnNo}</div>
                  <div>{data[0].DeclareNo}</div>
                </div>
              </div>  
              <div className="PrintContent6">
                <Table size={'small'} columns={this.table2.columns} dataSource={data1} bordered={false} style={{background:'#fff', color:'#000'}} pagination={{position:'none'}} />
              </div>
              <div className="PrintLine">
              </div>
              <div className="PrintContentCon1">
                <div className="PrintContent7">
                  <div>Мөнгөн дүн(үсгээр):</div>
                </div>
                <div className="PrintContent8">
                  <div>Гурван зуун мянган төгрөг</div>
                </div>
                <div className="PrintContentCon2">
                <div className="PrintContent10">
                    <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={(data[0].PaidCash + data[0].PaidNonCash + data[0].PaidAR)-(data[0].PaidCash + data[0].PaidNonCash + data[0].PaidAR)/11} style={{borderWidth:0}} decimalScale={2} /></div>
                    <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={(data[0].PaidCash + data[0].PaidNonCash + data[0].PaidAR)/11} style={{borderWidth:0}} decimalScale={2} /></div>
                    <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={data[0].PaidCash + data[0].PaidNonCash + data[0].PaidAR} style={{borderWidth:0}} decimalScale={2} /></div>
                    <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={data[0].PaidCash + data[0].PaidNonCash} style={{borderWidth:0}} decimalScale={2} /></div>
                    <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={data[0].PaidAR} style={{borderWidth:0}} decimalScale={2} /></div>                    
                  </div>
                  <div className="PrintContent9">
                    <div>Нийт дүн (НӨАТ-гүй):</div>
                    <div>НӨАТ (10%):</div>
                    <div>Нийт дүн:</div>
                    <div>Төлсөн:</div>
                    <div>Төлбөрийн үлдэгдэл:</div>
                  </div>
                </div>
              </div>
              <div className="PrintContentCon1">
                <div className="PrintContent11">
                  <div>Нягтлан бодогч: </div>
                </div>
                <div className="PrintContent12">
                  <div>................................</div>
                </div>
                <div className="PrintContent13">
                  <div>{this.props.data.data3[0].Accountant}</div>
                </div>
              </div>
              <div className="PrintContent14">
                <div className="PrintFooterLeft">{this.props.data.data3[0].Acct1}</div>
                <div className="PrintFooterRight">{this.props.data.data3[0].Acct2}</div>
              </div>
            </div>
      </div>
    );
  }
}
export default ComponentToPrint;
