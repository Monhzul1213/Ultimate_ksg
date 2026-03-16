import React from 'react';
import 'antd/dist/antd.css';
import { Table,Col, Input, Form ,DatePicker,Icon, Button, Row, InputNumber} from 'antd';
import { Link} from 'react-router-dom';
import Search from 'antd/lib/input/Search';
import Highlighter from 'react-highlight-words';
import './InventoryDetail.css'
import { endianness } from 'os';
import axios from 'axios';
import {ExportExcelCSV} from './ExportExcel'

const { RangePicker } = DatePicker;
function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

const topRespnsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6
 }

function onOk(value) {
  console.log('onOk: ', value);
}

  const data = [

    {
      key: 2,
      Код: '10000',
      Бар: '97260910028',
      Нэр: 'Памперс',
      Категори: 'Хүүхдийн бараа',
      Нэгж:'Шир',
      Тоо:<td className="Bat">2</td>,
      Орлого:<td className="Bat">2,000</td>,
      Төлбөр:<td className="Bat">60,000</td>,
       details:<Link to="/InventoryDetails">Дэлгэрэнгүй</Link>
    },
    {
      key: 3,
      Код: '10001',
      Бар: '9822711727',
      Нэр: 'Pepsi',
      Категори: 'Хүнсний бараа',
      Нэгж:'Шир',
      Тоо:<td className="Bat">6</td>,
      Орлого:<td className="Bat">3,600</td>,
      Төлбөр:<td className="Bat">67,000</td>,
      details:<Link to="/InventoryDetails">Дэлгэрэнгүй</Link>
    },
    {
      key:  4,
      Код: '10001',
      Бар: '98227117271',
      Нэр: 'Pepsi',
      Категори: 'Хүнсний бараа',
      Нэгж:'Шир',
      Тоо:<td className="Bat">3</td>,
      Орлого:<td className="Bat">4,700</td>,
      Төлбөр:<td className="Bat">67,000</td>,
      details:<Link to="/InventoryDetails">Дэлгэрэнгүй</Link>
    },
    {
      key: 5,
      Тоо:<td className="Bat">11</td>,
      Код: '',
      Орлого:<td className="Bat">10,300</td>,
      Төлбөр:<td className="Bat">194,000</td>,
      
    },
  ];

class InventoryDetail extends React.Component{
   
         getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
           >
              Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
          </Button>
          </div>
        ),
          filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
          onFilter: (value, record) =>
          record[dataIndex]
           .toString()
           .toLowerCase()
           .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
          },
          render: text => (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text.toString()}
           />
         ),
      });

           handleSearch = (selectedKeys, confirm) => {
           confirm();
           this.setState({ searchText: selectedKeys[0] });
         };
           handleReset = clearFilters => {
           clearFilters();
           this.setState({ searchText: '' });
         };
           state = {
           collapsed: false,
          };
           toggle = () => {
           this.setState({
           collapsed: !this.state.collapsed,
         });
         };

           componentDidMount(){
           this.funcs.init();
         }
           state={loading:true}
           funcs = {
             init:()=>{
             axios.get("http://192.168.1.37:3030/get_inPICount.asmx/getInvtBalance?pName=Admin&pVendID=50001&pBDate=2019.01.01&pEDate=2019.10.01")
            .then(this.funcs.initSucc).catch(this.funcs.initErr)
          },
             initSucc:(dt)=>{
             this.tabledata= dt.data.table1;
             this.setState({
             loading:false
         })
         },
             initErr:(dt)=>{
          }
        } 

          col={columns:[ 
          {
              key: 'InvtID',
              title: 'Барааны код',
              dataIndex: 'InvtID',
              ...this.getColumnSearchProps('InvtID'),
          },
          {
              key: 'Descr',
              title: 'Барааны нэр',
              dataIndex: 'Descr',
             ...this.getColumnSearchProps('Descr'),
          },
          {
              key: 'MaterialTypeName',
              title: 'Категори',
              dataIndex: 'MaterialTypeName',
             ...this.getColumnSearchProps('MaterialTypeName'),
              render: (text) => (
                <span>
                  {text.substring(0, 39)}
                </span>
              )
          },
          {
              key: 'BaseUnitID',
              title: 'Хэмжих нэгж',
              dataIndex: 'BaseUnitID',
              ...this.getColumnSearchProps('BaseUnitID'),
          }, 
          {
              key: 'Qty',
              title: 'Тоо',
              dataIndex: 'Qty',
              ...this.getColumnSearchProps('Qty'),
              render: (text) => (
                text ? <span>{text.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>: null
            )
          },
          {
            key: 'Cost',
            title: 'Өртөг',
            dataIndex: 'Cost',
            ...this.getColumnSearchProps('Cost'),
            render: (text) => (
              text ? <span>{text.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>: null
          )
          },
          {
            key: 'TotalCost',
            title: 'Нийт дүн',
            dataIndex: 'TotalCost',
            ...this.getColumnSearchProps('TotalCost'),
            render: (text) => (
                text ? <span>{text.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>: null
            )
          },
         {
            key: 'InvtID1',
            title: '',
            dataIndex: 'InvtID',
            render: (text) => (
              <span>
                <Link to={"/InventoryDetails/" + text}>Дэлгэрэнгүй</Link>
              </span>
           ) 
         },
       ]}
     
     tabledata=[];
     
        render(){
        return(
            <div>
              <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",padding:"12px"}}>
                <div style={{backgroundColor:'white', width:'100%', }}>
                     <Row style={{marginTop:24,}}gutter={topRespnsiveProps}>
                     <Col {...topRespnsiveProps}>
                     <label style={{color:'black', marginLeft:24}}>
                     Харилцагчийн код :
                 <Input
                     defaultValue={5423222} 
                     disabled 
                     style={{color:'black', width:'2.5cm', marginLeft:5, backgroundColor:'white'}} />
                 </label>
                 </Col>
                 <Col  {...topRespnsiveProps}>
                     <label style={{ color:'black', marginLeft:-50}}>
                     Харилцагчийн нэр :
                 <Input
                     defaultValue="Анунгоо ХХК" 
                     disabled  
                     style={{color:'black', width:'6cm', marginLeft:5, backgroundColor:'white'}} />
                     </label>
                 </Col>
                 <Col {...topRespnsiveProps}>
                 <RangePicker 
                     format="YYYY-MM-DD"
                     placeholder={['2019-06-01', '2019-06-30']}
                     onChange={onChange}
                     onOk={onOk}
                     selected={this.state.startDate}
                     selectsStart
                     startDate={this.state.startDate}
                       endDate={this.state.endDate}
                  />
                  </Col>
                  </Row>
                  <Row style={{marginTop:16, marginBottom:23 }} gutter={topRespnsiveProps}>
                  <Col {...topRespnsiveProps}>
                      <label style={{color:'black' ,paddingTop:2.5, marginLeft:24}}>
                          Нийт тоо :</label>
                      <Input 
                          disabled 
                          style={{ marginLeft:67, width:'2.5cm', color:'black', backgroundColor:'white'}} 
                          value={this.tabledata.reduce((total, { Qty }) => total += Qty,0).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/> 
                      </Col>
                      <Col {...topRespnsiveProps}>
                      <label style={{color:'black', paddingTop:2.5,padding:5, marginLeft:-55}}>
                          Нийт дүн :</label>
                      <Input  
                          disabled 
                          style={{ marginLeft:60, width:'3.5cm', color:'black', backgroundColor:'white'}} 
                          value={this.tabledata.reduce((total, { TotalCost }) => total += TotalCost,0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                      </Col>
                      </Row>
                      </div>
                     </div>
                    <div style={{backgroundColor:'white', margin:"12px", padding:"24px"}}>
                      <ExportExcelCSV 
                          csvData={this.tabledata} 
                          fileName={this.state.fileName}
                          />
                      <Table 
                          columns={this.col.columns} 
                          dataSource={this.tabledata} 
                          loading={this.state.loading} 
                          scroll={{ x: '10%'}}
                          size="small" 
                          bordered 
                          pagination={{pageSize:100}}
                          id="table-to-xls"
                       />
                    
                    </div>
                  </div>
    );
  }
}
export default InventoryDetail;