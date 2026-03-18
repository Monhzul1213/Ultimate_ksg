import React, { useRef } from 'react';
import NumberFormat from 'react-number-format';
import { Layout, Table, Input, Button, notification, Icon, Tag, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import cookie from 'react-cookies'
import 'antd/dist/antd.css';
import './TerminalPayment.css';
import axios from 'axios';
import { Resizable } from 'react-resizable';
import PrintComponent from './PrintTarifPayment.jsx';



const ResizeableTitle = props => {
	const { onResize, width, ...restProps } = props;

	if (!width) {
		return <th {...restProps} />;
	}

	return (
		<Resizable
			width={width}
			height={0}
			onResize={onResize}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<th {...restProps} />
		</Resizable>
	);
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
		tarifvisible: false,
		nehemjlehvisible: false,
		invtdescr: "",
		tarifdescr: "",
		PReturnNo: "",
		currInvtDescr: [],
		currInvtTarif: [],
		columns: [{
			key: "TxnDate",
			dataIndex: "TxnDate",
			title: "Огноо",
			align: "center",
			width: 100,
		}, {
			key: "PReturnNo",
			dataIndex: "PReturnNo",
			title: "Дугаар",
			align: "center",
			width: 120,
			ellipsis: true,
			render: (a, i) => {
				return <div className="tableColumn">{i.PReturnNo}</div>
			}
			//...this.getColumnSearchProps('DeclareNo'),
		}, {
			key: "DeclareNo",
			dataIndex: "DeclareNo",
			title: "Мэдүүлэг",
			align: "center",
			width: 200,
			ellipsis: true,
			render: (a, i) => {
				return <div className="tableColumn">{i.DeclareNo}</div>
			}
		}, {
			key: "TotalUnitQty",
			dataIndex: "TotalUnitQty",
			title: "Нийт тоо",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "SavedTotalAmt",
			dataIndex: "SavedTotalAmt",
			title: "Төлбөр",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "PaidDiscAmt",
			dataIndex: "PaidDiscAmt",
			title: "Хөнгөлөлт",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "PaidFinalAmt",
			dataIndex: "PaidFinalAmt",
			title: "Төлөх дүн",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "PaidAR",
			dataIndex: "PaidAR",
			title: "Авлагаар",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "PaidCash",
			dataIndex: "PaidCash",
			title: "Бэлнээр",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "PaidNonCash",
			dataIndex: "PaidNonCash",
			title: "Бэлэн бус",
			//width:120,
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "PaidType",
			dataIndex: "PaidType",
			title: "eBarimt",
			ellipsis: true,
			render: (a, i) => {
				return <div className="tableColumn">{i.PaidType}</div>
			}
		}, {
			key: "PaidCompanyReg",
			dataIndex: "PaidCompanyReg",
			title: "Регистер",
			align: "center",
		}, {
			key: "ARDocNo",
			dataIndex: "ARDocNo",
			title: "Нэхэмжлэх",
			align: "center",
			render: (a, i) => {
				if (a !== "") {
					return <div className="tableColumn"><a onClick={() => {
						this.setState({
							nehemjlehvisible: true,
							PReturnNo: i.PReturnNo,
						});
					}}>Хэвлэх</a></div>
				} else {
					return <div className="tableColumn"></div>
				}
			}
		},

		],
	}

	components = {
		header: {
			cell: ResizeableTitle,
		},
	};

	enterLoading = () => {
		this.setState({ loading: true });
	};

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

	handleResize = index => (e, { size }) => {
		this.setState(({ columns }) => {
			const nextColumns = [...columns];
			nextColumns[index] = {
				...nextColumns[index],
				width: size.width,
			};
			return { columns: nextColumns };
		});
	};

	funcs = {
		init: () => {
			this.setState({
				loading: true
			});
			axios.get("http://192.168.1.30:3030/get_inPICount.asmx/getTarifPayment?pName=" + this.state.cookiedata.username + "&pVendID=5748011&pBDate=2019.07.01&pEDate=2019.10.29").then(this.funcs.initSucc).catch(this.funcs.initErr)
		},
		initSucc: (data) => {
			this.tableData.data = data.data.table1;
			this.tableData.data.map((a, i) => {
				a.key = i;
				return a;
			});
			this.tableData.data1 = data.data.table2;
			this.tableData.data1.map((a, i) => {
				a.key = i;
				return a;
			});
			this.tableData.data3 = data.data.table4;
			this.tableData.data2 = data.data.table3;
			this.tableData.data2.map((a, i) => {
				a.key = i;
				return a;
			});
			this.setState({
				loading: false
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
		},
		tarifhandleOk: () => {
			this.setState({
				tarifvisible: false,
				nehemjlehvisible: false
			})
		},
		tarifhandeCancel: () => {
			this.setState({
				tarifvisible: false,
				nehemjlehvisible: false
			})
		}
	}

	table1 = {
		columns: [{
			key: "MaterialTypeName",
			dataIndex: "MaterialTypeName",
			title: "Категори",
			align: "center",
			with: 150,
			ellipsis: true,
			render: (a, i) => {
				return <div className="tableColumn">{i.MaterialTypeName}</div>
			}
		}, {
			key: "InvtID",
			dataIndex: "InvtID",
			title: "Барааны код",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumn"><a onClick={() => {
					const data = [];

					for (let i1 = 0; i1 < this.tableData.data2.length; i1++) {
						if (this.tableData.data2[i1].InvtID === i.InvtID) {
							data.push(this.tableData.data2[i1]);
						}
					}

					this.setState({
						visible: false,
						tarifvisible: true,
						tarifdescr: i.Descr + ' (' + i.InvtID + ')',
						currInvtTarif: data
					});
				}}>{i.InvtID}</a></div>
			}
		}, {
			key: "Descr",
			dataIndex: "Descr",
			title: "Барааны нэр",
			align: "center",
			with: 200,
			ellipsis: true,
			render: (a, i) => {
				return <div className="tableColumn">{i.Descr}</div>
			}
		}, {
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
			key: "UnitQty",
			dataIndex: "UnitQty",
			title: "Тоо",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "TarifPrice",
			dataIndex: "TarifPrice",
			title: "Тариф үнэ",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "TarifDayCount",
			dataIndex: "TarifDayCount",
			title: "Хоног",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "TarifAmount",
			dataIndex: "TarifAmount",
			title: "Тариф төлбөр",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "UnitID",
			dataIndex: "UnitID",
			title: "Нэгж",
			align: "center",
		},
		]
	}

	table2 = {
		columns: [{
			key: "InvtID",
			dataIndex: "InvtID",
			title: "Код",
			align: "center",
			width: 150,
		}, {
			key: "Descr",
			dataIndex: "Descr",
			title: "Нэр",
			align: "center",
			ellipsis: true,
			width: 200,
			render: (a, i) => {
				return <div className="tableColumn">{i.Descr}</div>
			}
		}, {
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
			key: "TxnDate",
			dataIndex: "TxnDate",
			title: "Эхлэх",
			align: "center",
		}, {
			key: "KeepDays",
			dataIndex: "KeepDays",
			title: "Хоног",
			align: "center",
		}, {
			key: "UnitQty",
			dataIndex: "UnitQty",
			title: "Тоо",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "OrigPrice",
			dataIndex: "OrigPrice",
			title: "Тариф",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}, {
			key: "DiscountPercent",
			dataIndex: "DiscountPercent",
			title: "Хөнгөлөлт",
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
			key: "TotalPrice",
			dataIndex: "TotalPrice",
			title: "Эцсийн дүн",
			align: "center",
			render: (a, i) => {
				return <div className="tableColumnNumber"><NumberFormat className="tableColumnNumber" displayType={'text'} readOnly={true} thousandSeparator={true} value={a} style={{ borderWidth: 0 }} /></div>
			}
		}]
	}

	tableData = { data: [], data1: [], data2: [], data3: [] }

	render() {

		let { sortedInfo, filteredInfo } = this.state;
		sortedInfo = sortedInfo || {};
		filteredInfo = filteredInfo || {};
		const columns = this.state.columns.map((col, index) => ({
			...col,
			onHeaderCell: column => ({
				width: column.width,
				onResize: this.handleResize(index),
			}),
		}));
		const expandedRowRender = (PReturnNo) => {
			const data = [];
			for (let i1 = 0; i1 < this.tableData.data1.length; i1++) {
				if (this.tableData.data1[i1].PReturnNo === PReturnNo) {
					data.push(this.tableData.data1[i1]);
				}
			}
			return <Table bordered={false} size="small" columns={this.table1.columns} style={{ margin: 0, background: '#EDF1FF' }} dataSource={data} pagination={false} />;
		};
		return (
			<div className="container">
				<Table title={() => <div className="tableTitle">Дэлгэрэнгүй жагсаалт</div>} size={'small'} bordered components={this.components} columns={columns} dataSource={this.tableData.data} expandedRowRender={record => <div style={{ margin: 0 }}>{expandedRowRender(record.PReturnNo)}</div>} onChange={this.onChange} loading={this.state.loading} style={{ background: '#fff' }} scroll={{ x: 100 }} pagination={{ position: 'bottom', pageSize: 20 }} />
				<Modal centered width={1000} footer={false} title={this.state.tarifdescr} visible={this.state.nehemjlehvisible} onOk={this.funcs.tarifhandleOk} onCancel={this.funcs.tarifhandeCancel} destroyOnClose={true} >
					<div>
						<PrintComponent currdata={this.tableData} currnum={this.state.PReturnNo} ></PrintComponent>
					</div>
				</Modal>
				<Modal centered width={1400} footer={false} title={this.state.tarifdescr} visible={this.state.tarifvisible} onOk={this.funcs.tarifhandleOk} onCancel={this.funcs.tarifhandeCancel} destroyOnClose={true} >
					<Table columns={this.table2.columns} dataSource={this.state.currInvtTarif} onChange={this.onChange} bordered={true} style={{ background: '#fff' }} scroll={{ x: 100 }} pagination={{ position: 'bottom', pageSize: 10 }} />
				</Modal>
			</div>
		);
	}
}
export default compon;