import React from 'react';
import NumberFormat from 'react-number-format';
import { Layout, Table, Input, Button, notification, Icon, Tag, Modal, PageHeader, Typography, Row, Statistic, Col, Card, Avatar } from 'antd';
import Highlighter from 'react-highlight-words';
import cookie from 'react-cookies'
import './InvtBalance.css';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
	G2,
	Chart,
	Geom,
	Axis,
	Tooltip,
	Coord,
	Label,
	Legend,
	View,
	Guide,
	Shape,
	Facet,
	Util
} from "bizcharts";
import DataSet from "@antv/data-set";


const { Meta } = Card;
const { Paragraph } = Typography;
const { DataView } = DataSet;
const { Html } = Guide;
const dv = new DataView();
const dv1 = new DataView();
const cols = {
	percent: {
		formatter: val => {
			val = val * 100 + "%";
			return val;
		}
	}
};

class compon extends React.Component {
	componentDidMount() {
		this.state.cookiedata = { 'username': cookie.load('username') }
		this.funcs.init();
	}

	state = {
		loading: false,
		iconLoading: false,
		filteredInfo: null,
		sortedInfo: null,
		activeRow: 0,
		cookiedata: "",
		visible: false,
		invtdescr: "",
		currInvtDescr: [],
		status: 'loading',
		totalsavedamt: 0,
		maxsavedday: 0,
		avgsavedday: 0,
		minsavedday: 0,
		totalsavedday: 0,
		totalcount: 0,
		totalqty: 0,
		totaltarif: 0,
		chartdata: [],
		chartdata1: []
	}

	enterLoading = () => {
		this.setState({ loading: true });
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div>
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

	funcs = {
		init: () => {
			this.setState({
				loading: true
			});
			axios.get("http://192.168.1.30:3030/get_inPICount.asmx/getInvtBalance?pName=" + this.state.cookiedata.username + "&pVendID=5748011&pBDate=2019.07.01&pEDate=2019.10.01").then(this.funcs.initSucc).catch(this.funcs.initErr)
		},
		initSucc: (data) => {

			this.tableData.data = data.data.table1;
			this.tableData.data.map((a, i) => {
				a.key = i;
				this.state.totalsavedamt += a.SavedAmt;
				this.state.totalsavedday += a.SavedDays;
				this.state.totalqty += a.Qty;
				if (i == 0 || a.SavedDays < this.state.minsavedday)
					this.state.minsavedday = a.SavedDays;
				if (a.SavedDays > this.state.maxsavedday)
					this.state.maxsavedday = a.SavedDays;
				return a;
			});
			this.state.avgsavedday = this.state.totalsavedday / data.data.table1.length;
			this.state.totalcount = data.data.table1.length;
			this.tableData.data1 = data.data.table2;
			this.tableData.data1.map((a, i) => {
				a.key = i;
				return a;
			});
			this.tableData.data2 = data.data.table3;
			this.tableData.data3 = data.data.table4;
			this.tableData.data3.map((a, i) => {
				a.key = i;
				this.state.chartdata.push({ MaterialTypeName: a.MaterialTypeName, qty: a.qty });
				return a;
			});

			this.tableData.data2.map((a, i) => {
				a.key = i;
				this.state.chartdata1.push({ CategoryClassName: a.CategoryClassName, qty: a.qty });
				return a;
			});

			this.tableData.data4 = data.data.table5;
			if (this.tableData.data4.length > 0) {
				this.setState({ totaltarif: this.tableData.data4[0].PaidFinalAmt });
			}

			this.setState({
				loading: false,
				status: 'complete',
				iconLoading: true,
			});
		},
		initErr: (data) => {
			notification["error"]({
				message: "Алдаа",
				description: "Алдаа гарлаа"
			});
			this.setState({
				loading: false
			});
		},
		handleOk: () => {
			this.setState({
				visible: false
			})
		},
		handeCancel: () => {
			this.setState({
				visible: false
			})
		}
	}

	table = {
		columns: [
			// {
			// 	key:"SiteID",
			// 	dataIndex:"SiteID",
			// 	title:"Салбар",
			// 	align:"center",
			// },{
			// 	key:"BinCode",
			// 	dataIndex:"BinCode",
			// 	title:"Байршлын код",
			// 	align:"center",
			// },{
			// 	key:"MaterialType",
			// 	dataIndex:"MaterialType",
			// 	title:"Категорийн код",
			// 	align:"center",
			// },
			{
				key: "MaterialTypeName",
				dataIndex: "MaterialTypeName",
				title: "Категорийн нэр",
				align: "center",
				ellipsis: true,
				render: (a, i) => {
					return <p className="tableColumn">{i.MaterialTypeName}</p>
				}
			}, {
				key: "InvtID",
				dataIndex: "InvtID",
				title: "Код",
				align: "center",
				ellipsis: true,
				...this.getColumnSearchProps('InvtID'),
				render: (a, i) => {
					return <p className="tableColumn">{i.InvtID}</p>
				}
			}, {
				key: "Descr",
				dataIndex: "Descr",
				title: "Нэр",
				align: "center",
				ellipsis: true,
				...this.getColumnSearchProps('Descr'),
				render: (a, i) => {
					return <p className="tableColumn">{i.Descr}</p>
				}
			}, {
				key: "BaseUnitID",
				dataIndex: "BaseUnitID",
				title: "Нэгж",
				align: "center",
			}, {
				key: "Qty",
				dataIndex: "Qty",
				title: "Тоо",
				align: "center",
				sorter: (a, i) => a.Qty - i.Qty,
				sortDirections: ['descend', 'ascend'],
				//defaultSortOrder: 'descend',
				render: (a, i) => {
					return <p className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></p>
				}
			}, {
				key: "SavedDays",
				dataIndex: "SavedDays",
				title: "Хоног",
				align: "center",
				//defaultSortOrder: 'descend',
				sorter: (a, i) => a.SavedDays - i.SavedDays,
				sortDirections: ['descend', 'ascend'],
				render: (a, i) => {
					return <p className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></p>
				}
			}, {
				key: "SavedAmt",
				dataIndex: "SavedAmt",
				title: "Төлбөр",
				align: "center",
				//defaultSortOrder: 'descend',
				sorter: (a, i) => a.SavedAmt - i.SavedAmt,
				sortDirections: ['descend', 'ascend'],
				render: (a, i) => {
					return <p className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></p>
				}
			}],
		columns1: [{
			key: "CategoryClassName",
			dataIndex: "CategoryClassName",
			title: "Ангилал",
			align: "center",
		}, {
			key: "Qty",
			dataIndex: "Qty",
			title: "Тоо",
			align: "center",
		}],
		columns2: [{
			key: "MaterialTypeName",
			dataIndex: "MaterialTypeName",
			title: "Категори",
			align: "center",
		}, {
			key: "Qty",
			dataIndex: "Qty",
			title: "Тоо",
			align: "center",
		}]
	}

	table1 = {
		columns: [
			// {
			// 	key:"InvtID",
			// 	dataIndex:"InvtID",
			// 	title:"Барааны код",
			// 	align:"center",
			// },
			{
				key: "SiteID",
				dataIndex: "SiteID",
				title: "Салбар",
				align: "center",
			}, {
				key: "BinCode",
				dataIndex: "BinCode",
				title: "Байршил",
				align: "center",
			}, {
				key: "FromDate",
				dataIndex: "FromDate",
				title: "Эхлэх",
				align: "center",
			}, {
				key: "ToDate",
				dataIndex: "ToDate",
				title: "Дуусах",
				align: "center",
			}, {
				key: "Qty",
				dataIndex: "Qty",
				title: "Тоо",
				align: "center",
				render: (a, i) => {
					return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
				}
			}, {
				key: "Price",
				dataIndex: "Price",
				title: "Үндсэн тариф",
				align: "center",
				render: (a, i) => {
					return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
				}
			}, {
				key: "KeepDays",
				dataIndex: "KeepDays",
				title: "Хоног",
				align: "center",
				render: (a, i) => {
					return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
				}
			}, {
				key: "EndPrice",
				dataIndex: "EndPrice",
				title: "Тооцсон дүн",
				align: "center",
				render: (a, i) => {
					return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
				}
			}, {
				key: "Dispercent",
				dataIndex: "Dispercent",
				title: "Хөнгөлөлт",
				align: "center",
				render: (a, i) => {
					return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
				}
			}, {
				key: "TotalPrice",
				dataIndex: "TotalPrice",
				title: "Эцсийн дүн",
				align: "center",
				render: (a, i) => {
					return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
				}
			}
		]
	}

	tableData = { data: [], data1: [], data2: [], data3: [], data4: [] }

	render() {
		let { sortedInfo, filteredInfo } = this.state;
		sortedInfo = sortedInfo || {};
		filteredInfo = filteredInfo || {};

		dv.source(this.state.chartdata).transform({
			type: "percent",
			field: "qty",
			dimension: "MaterialTypeName",
			as: "percent"
		});

		dv1.source(this.state.chartdata1).transform({
			type: "percent",
			field: "qty",
			dimension: "CategoryClassName",
			as: "percent"
		});

		const expandedRowRender = (InvtID) => {
			const data = [];
			for (let i1 = 0; i1 < this.tableData.data1.length; i1++) {
				if (this.tableData.data1[i1].InvtID === InvtID) {
					data.push(this.tableData.data1[i1]);
				}
			}
			return <Table bordered={false} size="small" columns={this.table1.columns} style={{ margin: 0, background: '#EDF1FF'}} dataSource={data} pagination={false} />;
		};
		return (
			<div>
				<div className="containerHeader">
					<div className="row">
						<div className="column">
							<Card>
								<div>
									<p className="CardheaderTitle">Үлдэгдэл</p>
								</div>
								<div className="Cardheader">
									<Avatar className="CardheaderIcon1" size={40} icon="fund" />
								</div>
								<div className="cardContainer">
									<p className="CardheaderValue">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.totalqty + '.00'} style={{ borderWidth: 0 }} />}</p>
									<div className="dayValue1"><p className="CardheaderValue1">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.totalcount + '.00'} style={{ borderWidth: 0 }} />}</p><p className="CardheaderValue2">нэр төрөл</p></div>
								</div>
							</Card>
						</div>
						<div className="column">
							<Card>
								<div>
									<p className="CardheaderTitle">Хоног</p>
								</div>
								<div className="Cardheader">
									<Avatar className="CardheaderIcon2" size={40} icon="container" />
								</div>
								<div className="cardContainer">
									<div className="dayValue"><p className="dayValue">max :</p> <p className="CardheaderDayValue">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.maxsavedday + '.00'} style={{ borderWidth: 0 }} />}</p></div>
									<div className="dayValue"><p className="dayValue">avg :</p> <p className="CardheaderDayValue">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.avgsavedday + '.00'} style={{ borderWidth: 0 }} />}</p></div>
									<div className="dayValue"><p className="dayValue">min :</p> <p className="CardheaderDayValue">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.minsavedday + '.00'} style={{ borderWidth: 0 }} />}</p></div>
								</div>
							</Card>
						</div>
						<div className="column">
							<Card>
								<div>
									<p className="CardheaderTitle">Төлбөр</p>
								</div>
								<div className="Cardheader">
									<Avatar className="CardheaderIcon3" size={40}><Icon type="bank" /></Avatar>
								</div>
								<div className="cardContainer">
									<p className="CardheaderValue">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.totalsavedamt + '.00'} style={{ borderWidth: 0 }} />}</p>
									<p className="CardheaderValue1"></p>
								</div>
							</Card>
						</div>
						<div className="column">
							<Card>
								<div>
									<p className="CardheaderTitle">Тариф</p>
								</div>
								<div className="Cardheader">
									<Avatar className="CardheaderIcon" size={40} icon="fund" />
								</div>
								<div className="cardContainer">
									<p className="CardheaderValue">{<NumberFormat decimalSeparator={'.'} decimalScale={2} displayType={'text'} readOnly={true} thousandSeparator={true} value={this.state.totaltarif + '.00'} style={{ borderWidth: 0 }} />}</p>
									<p className="CardheaderValue1">9 нэр төрөл</p>
								</div>
							</Card>
						</div>
					</div>
				</div>
				<div className="ChartContainer">
					<div className="Chart1">
						<div>
							<Chart
								height={300}
								data={dv}
								visible={true}
								scale={cols}
								padding={[24, 24, 24, 24]}
								forceFit
							>
								<Coord type={"theta"} radius={0.85} innerRadius={0.5} />
								<Axis name="percent" />
								<Legend
									position="right"
									offsetY={-350 / 2 + 60}
									offsetX={-180}
								/>
								<Tooltip
									showTitle={false}
									itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
								/>
								<Guide>
									<Html
										position={["50%", "50%"]}
										html={"<div style=&quot;color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;&quot;>Нийт<br><span style=&quot;color:#262626;font-size:2.5em&quot;>" + this.state.totalqty + "</span></div>"}
										alignX="middle"
										alignY="middle"
									/>
								</Guide>
								<Geom
									type="intervalStack"
									position="percent"
									color="MaterialTypeName"
									tooltip={[
										"MaterialTypeName*percent*qty",
										(MaterialTypeName, percent, qty) => {
											percent = qty;
											return {
												name: MaterialTypeName,
												value: percent
											};
										}
									]}
									style={{
										lineWidth: 1,
										stroke: "#fff"
									}}
								>
									<Label
										content="qty"
										formatter={(val, MaterialTypeName) => {
											return MaterialTypeName.point.MaterialTypeName + ": " + val;
										}}
									/>
								</Geom>
							</Chart>
						</div>
					</div>
					<div className="Chart2">
						<div>
							<Chart
								height={300}
								data={dv1}
								visible={true}
								scale={cols}
								padding={[24, 24, 24, 24]}
								forceFit
							>
								<Coord type={"theta"} radius={0.85} />
								<Axis name="percent" />
								<Legend
									position="right"
									offsetY={-350 / 2 + 60}
									offsetX={-180}
								/>
								<Tooltip
									showTitle={false}
									itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
								/>

								<Geom
									type="intervalStack"
									position="percent"
									color="CategoryClassName"
									tooltip={[
										"CategoryClassName*percent*qty",
										(CategoryClassName, percent, qty) => {
											percent = qty;
											return {
												name: CategoryClassName,
												value: percent
											};
										}
									]}
									style={{
										lineWidth: 1,
										stroke: "#fff"
									}}
								>
									<Label
										content="qty"
										formatter={(val, CategoryClassName) => {
											return CategoryClassName.point.CategoryClassName + ": " + val;
										}}
									/>
								</Geom>
							</Chart>
						</div>
					</div>
				</div>
				<div className="tableDetail">
					<Table title={() => <p className="tableTitle">Дэлгэрэнгүй жагсаалт</p>} columns={this.table.columns} expandedRowRender={record => <div style={{ margin: 0 }}>{expandedRowRender(record.InvtID)}</div>} dataSource={this.tableData.data} onChange={this.onChange} bordered={false} loading={this.state.loading} size="small" style={{ background: '#fff' }} scroll={{ x: 100 }} pagination={{ position: 'bottom', pageSize: 20 }} />
				</div>
			</div>
		);
	}
}
export default compon;