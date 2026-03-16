import React from 'react';
import 'antd/dist/antd.css'; 
import { Table,Menu, Input,Layout,Icon, Row, Col} from 'antd';
import './InventoryDetails.css';
import { Link} from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const { Header, Sider, Content } = Layout;
const topRespnsiveProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 48,
}

//axios.defaults.timeout = 60000;

class InventoryDetails extends React.Component {

 componentDidMount(){
           this.funcs.init();
         }
           state={
             loading:true,
             curInvtID:"",
             Descr:"",
             MatTyName:"",
             BaseUnitID:"",
             Qty:"",
             TotalCost:"",
             SavedDays:"",
             SavedAmt:""
            }

            
           funcs = {
             init:()=>{
               
             let id = this.props.match.params.id
             axios.get("http://192.168.1.37:3030/get_inPICount.asmx/getInvtBalanceByInvt?pName=Admin&pInvtID="+id+"&pVendID=500001&pBDate=2019.01.01&pEDate=2019.10.01")
            .then(this.funcs.initSucc).catch(this.funcs.initErr)
         },
             initSucc:(dt)=>{
             this.tabledata= dt.data.table1;
             this.tabledata1= dt.data.table2
             this.setState({
             loading:false,
             curInvtID:this.tabledata[0].InvtID,
             Descr:this.tabledata[0].Descr,
             MatTyName:this.tabledata[0].MaterialTypeName,
             BaseUnitID:this.tabledata[0].BaseUnitID,
             Qty:this.tabledata[0].Qty.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
             TotalCost:this.tabledata[0].TotalCost,
             SavedDays:this.tabledata1[0].SavedDays,
             SavedAmt:this.tabledata1[0].SavedAmt,
         })
         },
             initErr:(dt)=>{
         }
         }   
           col={columns:[ 
            {
              key:"1",
              title: 'Орлого',
              dataIndex: 'ReceiptNo'
            },
            {
              key:"2",
              title: 'Агуулах',
              dataIndex: 'SiteID'
            },
            {
              key:"3",
              title: 'Байршил',
              dataIndex: 'BinCode'
            },
            {
              key:"4",
              title: 'Тээврийн төрөл',
              dataIndex: 'TravelType',
              width:"10%"
            },
            {
              key:"5",
              title: 'Тээврийн дугаар',
              dataIndex: 'WagonNo'
            },
            {
              key:"6",
              title: 'Чингэлэг дугаар',
              dataIndex: 'ContainerNo'
              
            },
            {
              key:"7",
              title: 'Манифест дугаар',
              dataIndex: 'ManifestNo'
            },
            {
              key:"8",
              title: 'Нийт тоо',
              dataIndex: 'Qty'
            },
            {
              key:"9",
              title: 'Нийт өртөг',
              dataIndex: 'TotalCost',
              render: (text) => (
                text ? <span>{text.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>: null
            )
            },
            {
              key:"10",
              title: 'Хадгалсан хоногийн нийлбэр',
              dataIndex: 'SavedDays'
            },
            {
              key:"11",
              title: 'Хоногийн Тариф',
              dataIndex: 'DayTariff'
            },
            {
              key:"12",
              dataIndex: 'SavedAmt',
              title: 'Хадгалсан хоногийн төлбөр'
            },
          ]}
      row={rows:[]}
      tabledata=[];
      tabledata1=[];
     render(){
     return(
       
               <Content
                  style={{
                  margin: '12px',
                  minHeight: 280,
                 }}
               >
                 <div>
                   <Link  to="/Product" style={{display:'flex', justifyContent:'flex-start', marginBottom:18, marginTop:-8}}><Icon type="left" style={{marginTop:4}}/>Буцах</Link> 
                 </div>
                 <div >
                   <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                   <div style={{backgroundColor:'white', paddingTop:25, width:'100%'}}>
                      
                      <Col {...topRespnsiveProps}>
                        <Row style={{marginLeft:24}}{...topRespnsiveProps}>
                            <label style={{color:'black', }}>
                               Барааны код : 
                            <Input
                             value={this.state.curInvtID}
                             disabled 
                             style={{ marginLeft:10,  paddingLeft:10, width:150, color:'black',backgroundColor:'white'}}
                             />
                            </label>
                            </Row>
                            <Row style={{marginTop:16, marginLeft:24}}{...topRespnsiveProps}>
                            <label style={{color:'black'}}>
                               Барааны нэр :
                            <Input 
                             value={this.state.Descr} 
                             defaultValue="" disabled
                             style={{ marginLeft:10 , paddingLeft:10, width:350, color:'black',backgroundColor:'white'}}/>
                            </label>
                            </Row>
                            <Row style={{marginTop:16, marginLeft:24}} {...topRespnsiveProps}>
                            <label style={{color:'black'}}>
                               Хэмжих нэгж :
                            <Input 
                             value={this.state.BaseUnitID}
                             defaultValue="" 
                             disabled 
                             style={{ marginLeft:10, color:'black', width:150,backgroundColor:'white'}}/>
                            </label>
                            </Row>
                            <Row style={{marginTop:16, marginBottom:24, marginLeft:24}}{...topRespnsiveProps}>
                            <label style={{color:'black'}}>
                               Категори :
                            <Input 
                             value={this.state.MatTyName}
                             defaultValue="" 
                             disabled 
                             style={{ marginLeft:35,  paddingLeft:10, width:350, color:'black',backgroundColor:'white'}}/>
                            </label>
                            </Row>
                    
                      </Col>
                      <Col {...topRespnsiveProps}>
                        <Row  {...topRespnsiveProps}>
                            <label style={{ color:'black'}}>
                               Нийт тоо :
                            <Input 
                             value={this.tabledata.reduce((total, { Qty }) => total += Qty,0)}
                             defaultValue="" 
                             disabled 
                             style={{marginLeft:75 , paddingLeft:10,  width:200, color:'black',backgroundColor:'white'}}/>
                          </label>
                          </Row>
                          <Row style={{marginTop:16}}{...topRespnsiveProps}>
                          <label style={{ color:'black'}}>
                               Нийт өртөг :
                            <Input 
                             value={this.tabledata.reduce((total, { TotalCost }) => total += TotalCost,0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                             defaultValue="" 
                             disabled 
                             style={{ marginLeft:62 , paddingLeft:10,  width:200, color:'black',backgroundColor:'white'}}/>
                          </label>
                          </Row>
                          <Row style={{marginTop:16}}{...topRespnsiveProps}>
                            <label style={{ color:'black'}}>
                               Хадгалсан хоног :
                            <Input 
                             value={this.state.SavedDays}
                             defaultValue="" 
                             disabled 
                             style={{marginLeft:30 , paddingLeft:10, width:200, color:'black',backgroundColor:'white'}}/>
                          </label>
                          </Row>
                          <Row style={{marginTop:16, }}{...topRespnsiveProps} >
                          <label style={{ color:'black'}}>
                               Хадгалсан төлбөр :
                            <Input 
                             value={this.state.SavedAmt}
                             defaultValue="" 
                             disabled 
                             style={{marginLeft:21 , paddingLeft:10,  width:200, color:'black',backgroundColor:'white'}}/>
                          </label>
                          </Row>
                      </Col>
                     
                          </div>
                       </div>
             <div style={{backgroundColor:'white', marginTop:24}}>
               <Table 
                columns={this.col.columns}  
                dataSource={this.tabledata1}
                loading={this.state.loading} 
                scroll={{ x: '10%'}}  
                size="small" 
                pagination={{pageSize:10}} />
             </div>
             </div>
             </Content>
    );
  }
}
export default InventoryDetails;