import React, { Component } from 'react'
import { Input, Button, Select, DatePicker, InputNumber, Checkbox, Form, Modal, Radio, notification, Spin, Icon, Row, Col, Table } from 'antd';
import './ContractSheet.css';
import '../route/mainRoute.css';
import loadingImg from '@/image/loading.gif';
import moment, { isMoment } from 'moment';
import cookie from 'react-cookies';
import request from './PostRequest';
import PDFJs from './PDFJs';
import PDFViewer from './PDFViewer';

const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY.MM.DD';
const BaseInvoiceMode = {
  Action: 'action',
  Add: 'add',
  Edit: 'edit',
  Normal: 'normal',
  View: 'view',
}

const loadingIcon = <Icon component={() => (
  <img src={loadingImg} alt='loading' />
)} />;

function setValue(form, key, value, type = '') {
  if (type === 'CHECK')
    form.setFieldsValue({ [key]: value === 'Y' });
  else if (type === 'DATE' || key.includes('Date')) {
    if (value)
      form.setFieldsValue({ [key]: moment(value, dateFormat) });
    else
      form.setFieldsValue({ [key]: null });
  }
  else
    form.setFieldsValue({ [key]: value });
}

function getValue(obj, key, value) {
  if (typeof value === 'boolean')
    obj[key] = value ? 'Y' : 'N';
  else if (isMoment(value))
    obj[key] = moment(value).format(dateFormat);
  else if (typeof value !== 'undefined')
    obj[key] = value;
}

class LicenceInput extends React.Component {
  onChange = e => {
    const { editmask } = this.props;
    const { value } = e.target;
    const val = value && value.toUpperCase();
    if (editmask.test(val) || val === '') {
      this.props.onChange(val);
    }
  }

  onBlur = () => {
    const { value, onBlur, onChange, mask } = this.props;
    if (!mask.test(value && value.toUpperCase()))
      onChange('');
    if (onBlur) {
      onBlur();
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
}

class ModalContractItemForm extends React.Component {
  constructor(props) {
    super(props);

    const LoggedSysuser = cookie.load('LoggedSysuser');

    this.state = {
      changed: false,
      loading: false,
      LoggedSysuser
    }
  }

  relatedProperties = [];
  fieldRegNo = undefined;
  fieldLicPlateNo = undefined;

  onChangeRegNo = e => {
    const { value } = e.target;
    if (this.fieldRegNo && value) {
      //Регистрийн дугаараас төрсөн огноо, хүйс олох
      const reg = /^[А-Я|Ө|Ү]{2}[0-9]{8}$/;
      if (reg.test(value)) {
        const year = parseInt(value.substring(2, 4));
        const month = parseInt(value.substring(4, 6));
        const day = parseInt(value.substring(6, 8));
        const i = parseInt(value.substring(8, 9));

        const date = new Date(month > 20 ? year + 2000 : year + 1900, month > 20 ? month - 20 : month - 1, day);

        const pBDate = this.relatedProperties.find(property => property.RelatedObject === 'isCustomer.BDate');
        const pAge = this.relatedProperties.find(property => property.RelatedObject === 'isCustomer.Age');
        const pGender = this.relatedProperties.find(property => property.RelatedObject === 'isCustomer.Gender');

        if (pBDate)
          setValue(this.props.form, 'n' + pBDate.PropertyID, moment(date).format(dateFormat), pBDate.DataType);

        if (pAge)
          setValue(this.props.form, 'n' + pAge.PropertyID, new Date().getFullYear() - date.getFullYear(), pAge.DataType);

        if (pGender)
          setValue(this.props.form, 'n' + pGender.PropertyID, i % 2 == 0 ? 'F' : 'M', pAge.DataType);
      }
    }
    this.onChangeControls();
  }

  onChangeControls = () => {
    this.setState({ changed: true });
  }

  onPressEnterRelatedProperty = (e) => {
    e.preventDefault();
    if (e.target.value) {
      var service = '', param = undefined;
      switch (e.target.id) {
        case this.fieldRegNo:
          service = 'ContractSheet_GetRelatedCustomer';
          param = { CustID: e.target.value };
          break;
        case this.fieldLicPlateNo:
          service = 'ContractSheet_GetRelatedVehicle';
          param = { VehicleID: e.target.value };
          break;
        default:
      }
      if (param) {
        this.setState({ loading: true });
        request
          .post(service, { token: this.state.LoggedSysuser.token, ...param })
          .then(res => {
            if (res.data.retType !== 0) {
              this.setState({ loading: false });
              notification['error']({
                message: 'Анхаар',
                description: res.data.retDesc
              });
              return;
            }
            const relatedObject = Object.entries(res.data.retData);
            if (relatedObject && relatedObject.length > 0) {
              const alias = relatedObject[0][0] + '.';
              this.relatedProperties.filter(property => {
                return property.RelatedObject.startsWith(alias);
              })
              this.relatedProperties
                .filter(property => {
                  return property.RelatedObject.startsWith(alias);
                })
                .forEach(property => {
                  setValue(this.props.form, 'n' + property.PropertyID, relatedObject[0][1][0][property.RelatedObject.replace(relatedObject[0][0] + '.', '')], property.DataType);
                });
              this.setState({ loading: false });
            }
            else
              this.setState({ loading: false });
          })
          .catch(err => {
            this.setState({ loading: false });
            console.error(err);
          });
      }
    }
  }

  render() {
    const { visible, onCancel, onOk, form, productProperty, bufferData, baseData } = this.props;
    this.relatedProperties = [];
    const inputFields = (property) => {
      if (property.RelatedObject) {
        switch (property.RelatedObject) {
          case 'isCustomer.RegNo':
            this.fieldRegNo = 'contractitem_form_n' + property.PropertyID;
            return <Input
              disabled={this.state.loading}
              onPressEnter={this.onPressEnterRelatedProperty}
              onChange={this.onChangeRegNo} />;
          case 'isCustomer.AgentType':
            return (<Select
              disabled={this.state.loading}
              onChange={this.onChangeControls}>
              {baseData && baseData.agentType && baseData.agentType.map(item => (
                <Option key={item.ConstKey}>{item.ValueStr1}</Option>
              ))}
            </Select>);
          case 'isCustomer.CountryType':
            return (<Select
              disabled={this.state.loading}
              onChange={this.onChangeControls}>
              {baseData && baseData.countryType && baseData.countryType.map(item => (
                <Option key={item.ConstKey}>{item.ValueStr1}</Option>
              ))}
            </Select>);
          case 'isCustomer.Gender':
            return (<Select
              disabled={this.state.loading}
              onChange={this.onChangeControls}>
              {baseData && baseData.gender && baseData.gender.map(item => (
                <Option key={item.ConstKey}>{item.ValueStr1}</Option>
              ))}
            </Select>);
          case 'isVehicle.LicPlateNo':
            this.fieldLicPlateNo = 'contractitem_form_n' + property.PropertyID;
            return <LicenceInput
              editmask={/^[0-9]{1,4}[А-Я|Ө|Ү]{0,3}$/}
              mask={/^[0-9]{4}[А-Я|Ө|Ү]{3}$/}
              maxLength={7}
              disabled={this.state.loading}
              onPressEnter={this.onPressEnterRelatedProperty}
              onChange={this.onChangeControls} />;
          default:
        }
        this.relatedProperties.push(property);
      }

      switch (property.DataType) {
        case 'DATE':
          return <DatePicker
            disabled={this.state.loading}
            style={{ width: '100%' }}
            onChange={this.onChangeControls}
            allowClear={false}
            format={dateFormat}
            placeholder='' />;
        case 'CHECK':
          return <Checkbox
            disabled={this.state.loading}
            onChange={this.onChangeControls}>{property.ColumnHeader}
          </Checkbox>;
        case 'INT':
          return <InputNumber
            disabled={this.state.loading}
            style={{ width: '100%' }}
            onChange={this.onChangeControls} />;
        case 'COMBO':
          return (<Select
            disabled={this.state.loading}
            onChange={this.onChangeControls}>
            {property.ComboValue.split(';').map((value, index) => (
              <Option key={index} value={value}>{value}</Option>
            ))}
          </Select>);
        default:
          return <Input
            disabled={this.state.loading}
            onChange={this.onChangeControls} />;
      }
    }

    return (
      <Modal
        visible={visible}
        bodyStyle={{ padding: 24, height: 720, overflowY: 'scroll' }}
        title={productProperty && productProperty.name}
        okText='Хадгалах'
        cancelText='Болих'
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{ disabled: !this.state.changed || this.state.loading }}
        cancelButtonProps={{ disabled: !this.state.changed || this.state.loading }}
        closable={!this.state.loading}>
        <Spin indicator={loadingIcon} spinning={this.state.loading}>
          <Form autoComplete='off' labelAlign='left'>
            {productProperty && productProperty.properties && productProperty.properties.map((property) => {
              const { getFieldDecorator } = form;
              const value = bufferData && bufferData.length > 0 && bufferData[0]['n' + property.PropertyID];
              return (
                <Form.Item key={property.PropertyID} style={{ marginBottom: '0px' }} label={property.DataType === 'CHECK' ? '' : property.ColumnHeader}>
                  {getFieldDecorator('n' + property.PropertyID, {
                    rules: [{ required: property.isRequired === 'Y', message: 'Мэдээлэл оруулах шаардлагатай.' }],
                    valuePropName: property.DataType === 'CHECK' ? 'checked' : 'value',
                    initialValue:
                      property.DataType === 'CHECK' ?
                        value === 'Y' :
                        property.DataType === 'DATE' ?
                          value ?
                            moment(value, dateFormat) :
                            null :
                          value
                  })(inputFields(property))}
                </Form.Item>
              );
            })}
          </Form>
        </Spin>
      </Modal >
    );
  }
}

class ModalCustomerForm extends React.Component {
  render() {
    const { visible, Customer, onCancel, onOk, form, loading } = this.props;
    const formItemLayout = {
      style: { marginBottom: '0px' }
    }
    const { getFieldDecorator } = form;
    const required = [{ required: true, message: 'Мэдээлэл оруулах шаардлагатай.' }]
    return (
      <Modal
        visible={visible}
        title='Даатгуулагч'
        okText='Хадгалах'
        cancelText='Болих'
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{ disabled: loading }}
        cancelButtonProps={{ disabled: loading }}
        closable={!loading}>
        <Spin indicator={loadingIcon} spinning={loading}>
          <Form autoComplete='off' labelAlign='left'>
            <Form.Item label='Төрөл' {...formItemLayout}>
              {getFieldDecorator('AgentType', { initialValue: 'P', rules: required })(
                <Radio.Group>
                  <Radio.Button value='P'>Хувь хүн</Radio.Button>
                  <Radio.Button value='O'>Байгууллага</Radio.Button>
                </Radio.Group>)}
            </Form.Item>
            <Form.Item label='Харьяалал' {...formItemLayout}>
              {getFieldDecorator('CountryType', { initialValue: 'MGL', rules: required })(
                <Radio.Group>
                  <Radio.Button value='MGL'>Монгол</Radio.Button>
                  <Radio.Button value='OTR'>Гадаад</Radio.Button>
                </Radio.Group>)}
            </Form.Item>
            <Form.Item label='Регистрийн дугаар' {...formItemLayout}>
              {getFieldDecorator('CustID', { initialValue: Customer && Customer[0].CustID, rules: required })(
                <Input />)}
            </Form.Item>
            <Form.Item label='Овог' {...formItemLayout}>
              {getFieldDecorator('LName', { rules: required })(
                <Input />)}
            </Form.Item>
            <Form.Item label='Нэр' {...formItemLayout}>
              {getFieldDecorator('Name', { initialValue: Customer && Customer[0].Name, rules: required })(
                <Input />)}
            </Form.Item>
            <Form.Item label='Утас' {...formItemLayout}>
              {getFieldDecorator('Phone', { rules: required })(
                <InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

const CustomerForm = Form.create({ name: 'customer_form' })(ModalCustomerForm);
const ContractItemForm = Form.create({ name: 'contractitem_form' })(ModalContractItemForm);

class ContractForm extends React.Component {

  constructor(props) {
    super(props);

    var date = new Date(),
      today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const LoggedSysuser = cookie.load('LoggedSysuser');

    this.state = {
      showItem: false,
      showCustomer: false,
      invoiceMode: BaseInvoiceMode.Normal,
      baseData: undefined,
      bufferData: undefined,
      loading: true,
      LoggedSysuser,
      today,
      itemValid: false,
      editable: false
    };
  }

  setInvoiceModeNormal() {
    this.setState({ loading: false, invoiceMode: BaseInvoiceMode.Normal, bufferData: undefined });
  }

  componentDidMount() {
    request
      .post('Sheet_Initialize', { token: this.state.LoggedSysuser.token })
      .then(res => {
        if (res.data.retType !== 0) {
          this.setState({ loading: false });
          notification['error']({
            message: 'Анхаар',
            description: res.data.retDesc
          });
          return;
        }

        this.setState({ baseData: res.data.retData, loading: false });

        const { ContractNo } = this.props;
        if (ContractNo)
          this.getData(ContractNo);
      })
      .catch(err => {
        this.setState({ loading: false });
        console.error(err);
      })
  }

  onPressEnterContractNo = (e) => {
    e && e.preventDefault();
    const ContractNo = this.props.form.getFieldValue('ContractNo');
    if (ContractNo)
      this.getData(ContractNo);
    else
      this.setInvoiceModeNormal();
  }

  getData = (ContractNo) => {
    const { getFieldsValue, setFieldsValue, resetFields } = this.props.form;
    this.setState({ loading: true });
    request
      .post('Sheet_GetContract', { token: this.state.LoggedSysuser.token, ContractNo })
      .then(res => {
        if (res.data.retType !== 0) {
          resetFields();
          setFieldsValue({ ContractNo: ContractNo });
          this.setInvoiceModeNormal();
          notification['error']({
            message: 'Анхаар',
            description: res.data.retDesc
          });
          return;
        }

        const { isContract, isContractItem } = res.data.retData;
        if (!isContract || isContract.length === 0 || !isContractItem || isContractItem.length === 0) {
          resetFields();
          setFieldsValue({ ContractNo: ContractNo });
          this.setInvoiceModeNormal();
          return;
        }

        const isGZInsurance = this.state.baseData && this.state.baseData.isSetup && this.state.baseData.isSetup.length > 0 && this.state.baseData.isSetup[0].GZInsurance === isContractItem[0].ProductID;
        if (!isGZInsurance) {
          isContractItem[0].CountryType = null;
          isContractItem[0].InsType = null;
          isContractItem[0].PackageType = 'O';
          isContractItem[0].Limit = null;
          isContractItem[0].GZDPackageAmt = 0;
          isContractItem[0].Rate = 0;
        }

        let values = {};

        Object.keys(getFieldsValue()).forEach(key => {
          switch (key) {
            case 'SheetNo':
            case 'ActualAmt':
            case 'PremiumAmt':
            case 'BasePremiumAmt':
            case 'CommissionPercent':
            case 'DiscountPercent':
            case 'ProductID':
            case 'CountryType':
            case 'Days':
            case 'InsType':
            case 'Limit':
            case 'PackageType':
            case 'GZDPackageAmt':
            case 'Rate':
              values[key] = isContractItem[0][key];
              break;
            default:
              if (key.includes('Date')) {
                if (isContract[0][key])
                  values[key] = moment(isContract[0][key], dateFormat);
                else
                  values[key] = null;
              }
              else
                values[key] = isContract[0][key];
          }
        });

        setFieldsValue(values);

        this.setState({
          bufferData: res.data.retData,
          invoiceMode: BaseInvoiceMode.View,
          loading: false,
          itemValid: true,
          editable: isContract[0].Status !== 'V'
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.error(error);
      });
  }

  getProduct = (productID) => {
    var prod;
    if (this.state.baseData) {
      const { Product } = this.state.baseData;
      prod = Product && Product.find((product) => {
        return product.ProductID === productID
      });
    }
    return prod;
  }

  getProperties = (state) => {
    if (state.productID) {
      this.setState({ loading: true, ...state });
      request
        .post('Sheet_GetProductProperty', { token: this.state.LoggedSysuser.token, ProductID: state.productID })
        .then(res => {
          const data = res.data;
          if (data.retType !== 0) {
            this.setState({ loading: false });
            notification['error']({
              message: 'Анхаар',
              description: data.retDesc
            });
            return;
          }

          const { ProductProperty } = data.retData;
          const prod = this.getProduct(state.productID);

          let i = ProductProperty.findIndex(property => property.isRequired === 'Y');

          this.setState(prevState => ({
            loading: false,
            showItem: true,
            itemValid: state.itemValid || i < 0,
            bufferData: {
              ...prevState.bufferData, productProperty: { name: prod && prod.ProductName, properties: ProductProperty }
            }
          }));
        })
        .catch(err => {
          this.setState({ loading: false });
          console.error(err);
        })
    }
  }

  calcGZDAmount(values) {
    const isGZDType = this.state.baseData && this.state.baseData.isGZDType;
    if (isGZDType) {
      if (values.Days <= 0) return;
      var GZDPackageAmt = 0;
      isGZDType.forEach(item => {
        if (item.CountryType == values.CountryType && item.Limit == values.Limit && item.Period == values.Days) {
          if (values.PackageType === 'O') {
            if (values.InsType === 'INS1')
              GZDPackageAmt = item.Individual2;
            if (values.InsType === 'INS2' || values.InsType === 'INS3' || values.InsType === 'INS4')
              GZDPackageAmt = item.Individual1;
          }
          else {
            if (values.InsType === 'INS1')
              GZDPackageAmt = item.Family2;
            if (values.InsType === 'INS2' || values.InsType === 'INS3' || values.InsType === 'INS4')
              GZDPackageAmt = item.Family1;
          }
        }
      });

      this.setFieldsValue({ GZDPackageAmt });
    }
  }

  onClickNew = () => {
    this.setState({ loading: true });
    request
      .post('Sheet_GetContract', { token: this.state.LoggedSysuser.token, ContractNo: '' })
      .then(res => {
        if (res.data.retType !== 0) {
          this.setState({ loading: false });
          notification['error']({
            message: 'Анхаар',
            description: res.data.retDesc
          });
          return;
        }

        if (!res.data.retData.isContract) return;

        this.props.form.resetFields();

        this.setState({ bufferData: res.data.retData, invoiceMode: BaseInvoiceMode.Add, loading: false, productID: null, editable: true });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.error(error);
      });
  }

  onClickPrint = () => {
    const values = this.props.form.getFieldsValue(['ContractNo', 'SheetNo', 'ProductID', 'InsType']);
    if (values) {
      this.setState({ loading: true });
      const replacer = (key, value) =>
        typeof value === 'undefined' ? null : value;
      request
        .post('Sheet_GenerateReport', { token: this.state.LoggedSysuser.token, json: JSON.stringify(values, replacer) })
        .then(res => {
          if (res.data.retType !== 0) {
            this.setState({ loading: false });
            notification['error']({
              message: 'Анхаар',
              description: res.data.retDesc
            });
            return;
          }

          if (!res.data.retData) return;

          const reportUrl = encodeURIComponent(request.host + 'get_inPICount.asmx/Get_Report?key=' + res.data.retData);
          this.setState({ showReport: true, reportUrl, loading: false });
        })
        .catch(error => {
          this.setState({ loading: false });
          console.error(error);
        });
    }
  }

  onPressEnterCustomer = (e) => {
    e.preventDefault();
    if (e.target.value) {
      var CustID = '', Name = '';
      this.setState({ loading: true });
      switch (e.target.id) {
        case 'contract_form_CustID':
          CustID = e.target.value;
          break;
        case 'contract_form_CustName':
          Name = e.target.value;
          break;
        default:
      }
      request
        .post('ContractSheet_GetCustomer', { token: this.state.LoggedSysuser.token, CustID, Name })
        .then(res => {
          if (res.data.retType !== 0) {
            this.setState({ loading: false });
            notification['error']({
              message: 'Анхаар',
              description: res.data.retDesc
            });
            return;
          }
          const { Customer } = res.data.retData;
          if (Customer) {
            if (Customer.length > 1)
              this.setState({ loading: false, showCustomerName: true, Customer });
            else if (Customer.length > 0) {
              this.props.form.setFieldsValue({ CustID: Customer[0].CustID, CustName: Customer[0].Name });
              this.setState({ loading: false });
            }
            else
              this.setState({ loading: false, showCustomer: true, Customer: [{ CustID, Name }] });
          }
          else
            this.setState({ loading: false });
        })
        .catch(err => {
          this.setState({ loading: false });
          console.error(err);
        });
    }
  }

  onSelectCustomerName = (Customer) => {
    this.props.form.setFieldsValue({ CustID: Customer.CustID, CustName: Customer.Name });
    this.setState({ showCustomerName: false });
  }

  onCancelCustomerName = () => {
    this.setState({ showCustomerName: false });
  }

  onCancelReport = () => {
    this.setState({ showReport: false });
  }

  onClickProductButton = () => {
    const productID = this.props.form.getFieldValue('ProductID');
    this.getProperties({ productID, itemValid: true });
  }

  onCancelItem = () => {
    const { form } = this.itemFormRef.props;
    form.resetFields();
    this.setState({ showItem: false });
  }

  onOkItem = () => {
    const { form } = this.itemFormRef.props;
    form.validateFieldsAndScroll({ first: true }, (err, values) => {
      if (err) return;

      let { isContractItem } = this.state.bufferData;

      Object.keys(isContractItem[0]).forEach(key => {
        getValue(isContractItem[0], key, values[key]);
      });
      values = {
        name: 'sdf',
        age: 10
      }

      form.resetFields();

      var im = this.state.invoiceMode;
      if (im === BaseInvoiceMode.View)
        im = BaseInvoiceMode.Edit;

      this.setState(prevState => ({
        showItem: false,
        itemValid: true,
        invoiceMode: im,
        bufferData: {
          ...prevState.bufferData, isContractItem
        }
      }));
    });
  }

  onCancelCustomer = () => {
    const { form } = this.custFormRef.props;
    form.resetFields();
    this.setState({ showCustomer: false });
  }

  onOkCustomer = () => {
    const { form } = this.custFormRef.props;
    form.validateFieldsAndScroll({ first: true }, (err, values) => {
      if (err) return;

      this.setState({ loading: true });
      request
        .post('ContractSheet_ModifyCustomer', { token: this.state.LoggedSysuser.token, json: JSON.stringify({ arCustomer: [values] }) })
        .then(res => {
          if (res.data.retType !== 0) {
            this.setState({ loading: false });
            notification['error']({
              message: 'Анхаар',
              description: res.data.retDesc
            });
            return;
          }

          form.resetFields();
          notification['success']({
            message: '',
            description: 'Амжилттай хадгаллаа.'
          });
          this.props.form.setFieldsValue({ CustID: values.CustID, CustName: values.Name });
          this.setState({ loading: false, showCustomer: false });
        })
        .catch(error => {
          this.setState({ loading: false });
          console.error(error);
        });
    });
  }

  contractItemFormRef = itemFormRef => {
    this.itemFormRef = itemFormRef;
  }

  customerFormRef = custFormRef => {
    this.custFormRef = custFormRef;
  }

  onSubmitContractForm = (e) => {
    e.preventDefault();
    const { validateFieldsAndScroll, resetFields } = this.props.form;
    validateFieldsAndScroll({ first: true }, (err, values) => {
      if (!err) {
        if (!this.state.itemValid) {
          notification['error']({
            message: 'Анхаар',
            description: 'Дэлгэрэнгүй мэдээлэл оруулна уу.'
          });
          return;
        }

        let { isContract, isContractItem } = this.state.bufferData;
        Object.keys(isContract[0]).forEach(key => {
          switch (key) {
            case 'ContractAmt':
              isContract[0][key] = values.PremiumAmt;
              break;
            default:
              getValue(isContract[0], key, values[key]);
          }
        });

        Object.keys(isContractItem[0]).forEach(key => {
          var value = values[key];
          switch (key) {
            case 'Status':
              isContractItem[0][key] = 'A';
              break;
            default:
              getValue(isContractItem[0], key, value);
          }
        });
        this.setState({ loading: true });
        const replacer = (key, value) =>
          typeof value === 'undefined' ? null : value;
        request
          .post('Sheet_ModifyContract', {
            token: this.state.LoggedSysuser.token, json: JSON.stringify({ isContract, isContractItem }, replacer)
          })
          .then(res => {
            const data = res.data;
            if (data.retType !== 0) {
              this.setState({ loading: false });
              notification['error']({
                message: 'Анхаар',
                description: data.retDesc
              });
              return;
            }
            const isContract = data.retData;
            if (isContract) {
              notification['success']({
                message: '',
                description: 'Амжилттай хадгаллаа.'
              });
              this.getData(isContract[0]['ContractNo']);
            }
            else {
              notification['error']({
                message: '',
                description: 'Хадгалсан үр дүн ирсэнгүй.'
              });
              resetFields();
              this.setInvoiceModeNormal();
            }
          })
          .catch(err => {
            this.setState({ loading: false });
            console.error(err);
          })
      }
    });
  }

  onResetContractForm = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.Add) {
      this.props.form.resetFields();
      this.setInvoiceModeNormal();
    }
    else
      this.onPressEnterContractNo();
  }

  onPressEnterControls = (e) => {
    e.preventDefault();
  }

  onChangeActualAmt = (value) => {
    if (isNaN(value)) return;
    const values = this.props.form.getFieldsValue(['BasePremiumAmt', 'DiscountPercent']);
    var premiumAmt = value * values.BasePremiumAmt / 100 * (1 - values.DiscountPercent / 100);
    this.setFieldsValue({ PremiumAmt: premiumAmt });
    this.onChangeControls();
  }

  onChangeBasePremiumAmt = (value) => {
    if (isNaN(value)) return;
    const values = this.props.form.getFieldsValue(['ActualAmt', 'DiscountPercent']);
    var premiumAmt = values.ActualAmt * value / 100 * (1 - values.DiscountPercent / 100);
    this.setFieldsValue({ PremiumAmt: premiumAmt });
    this.onChangeControls();
  }

  onChangeDiscountPercent = (value) => {
    if (isNaN(value)) return;
    const values = this.props.form.getFieldsValue(['ActualAmt', 'BasePremiumAmt']);
    var premiumAmt = values.ActualAmt * values.BasePremiumAmt / 100 * (1 - value / 100);
    this.setFieldsValue({ PremiumAmt: premiumAmt });
    this.onChangeControls();
  }

  onChangeProduct = (value) => {
    const isGZInsurance = this.state.baseData && this.state.baseData.isSetup && this.state.baseData.isSetup.length > 0 && this.state.baseData.isSetup[0].GZInsurance === value;
    this.getProperties({ productID: value, itemValid: false });
    if (isGZInsurance) {
      this.setFieldsValue({ PackageType: 'O' });
    }
    this.onChangeControls();
  }

  onChangeGZDType = (name, value) => {
    const { getFieldsValue } = this.props.form;

    if (name === 'CountryType') {
      this.setFieldsValue({ Limit: null, Days: null });
    }
    else {
      const values = getFieldsValue(['CountryType', 'Limit', 'Days', 'PackageType', 'InsType']);
      values[name] = value;
      this.calcGZDAmount(values);
    }
    this.onChangeControls();
  }

  onChangeGZDPackageAmt = (name, value) => {
    if (isNaN(value)) return;
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue(['Limit', 'Rate', 'GZDPackageAmt']);
    values[name] = value;
    this.setFieldsValue({ ActualAmt: values.Limit * values.Rate, PremiumAmt: values.GZDPackageAmt * values.Rate });
    this.onChangeControls();
  }

  onChangeControls = () => {
    if (this.state.invoiceMode === BaseInvoiceMode.View)
      this.setState({ invoiceMode: BaseInvoiceMode.Edit });
  }

  setFieldsValue(values) {
    this.props.form.setFieldsValue(values);
    for (let [key, value] of Object.entries(values)) {
      switch (key) {
        case 'ActualAmt':
          this.onChangeActualAmt(value);
          break;
        case 'BasePremiumAmt':
          this.onChangeBasePremiumAmt(value);
          break;
        case 'DiscountPercent':
          this.onChangeDiscountPercent(value);
          break;
        case 'CountryType':
        case 'InsType':
        case 'Limit':
          this.onChangeGZDType(key, value);
          break;
        case 'GZDPackageAmt':
        case 'Rate':
          this.onChangeGZDPackageAmt(key, value);
          break;
        default:
      }
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const disabledActive = this.state.loading || [BaseInvoiceMode.Add, BaseInvoiceMode.Edit].includes(this.state.invoiceMode);
    const disabledEdit = this.state.loading || BaseInvoiceMode.Normal === this.state.invoiceMode || !this.state.editable;
    const formLayount = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 14 }
      },
      labelAlign: 'left',
      style: {
        maxWidth: '576px',
        width: '576px'
      },
      onSubmit: this.onSubmitContractForm,
      onReset: this.onResetContractForm,
      autoComplete: 'off'
    }
    const tailFormLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 14, offset: 10 }
      }
    };
    const formItemLayout = {
      style: { marginBottom: '0px' }
    }
    const required = [{ required: true, message: 'Мэдээлэл оруулах шаардлагатай.' }]
    const greaterThan = [{
      validator: (rule, value, callback) => {
        if (value > 0) {
          callback();
          return;
        }
        callback('0-ээс их утга оруулах  шаардлагатай.');
      },
      required: true
    }]
    const tableColumns = [
      {
        title: 'Код',
        dataIndex: 'CustID',
        width: 150,
        render: (text, record) => (
          <Button style={{ padding: 0 }} type='link' onClick={() => {
            this.onSelectCustomerName(record);
          }}>{text}</Button>
        )
      },
      {
        title: 'Нэр',
        dataIndex: 'Name',
        width: 200,
      },
      {
        title: 'Овог',
        dataIndex: 'LName',
        width: 200,
      },
      {
        title: 'Утас',
        dataIndex: 'Phone',
        width: 150
      }
    ]

    const { baseData } = this.state;
    const productID = getFieldValue('ProductID');
    const prod = this.getProduct(productID);
    const isGZInsurance = baseData && baseData.isSetup && baseData.isSetup.length > 0 && baseData.isSetup[0].GZInsurance === productID;
    const isGZDType = isGZInsurance && baseData && baseData.isGZDType && baseData.isGZDType.filter(value => value.CountryType === getFieldValue('CountryType'))

    return (
      <Spin indicator={loadingIcon} spinning={this.state.loading}>
        <Form {...formLayount}>
          <Form.Item label='Бүртгэлийн дугаар' {...formItemLayout}>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('ContractNo')(
                  <Input
                    disabled={disabledActive}
                    onPressEnter={this.onPressEnterContractNo}
                  />)}
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button shape='circle' type='primary' icon='plus' disabled={disabledActive} onClick={this.onClickNew} className='ButtonStyle' />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button shape='circle' type='link' icon='printer' disabled={this.state.invoiceMode !== BaseInvoiceMode.View} onClick={this.onClickPrint} className='ButtonStyle' />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='Төрөл' {...formItemLayout}>
            {getFieldDecorator('Type', { initialValue: 'N', rules: required })(
              <Select
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.isContract_Type && baseData.isContract_Type.map(iscontract_type => (
                  <Option key={iscontract_type.ConstKey}>{iscontract_type.ValueStr1}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Валют' {...formItemLayout}>
            {getFieldDecorator('CurrencyID', { initialValue: 'MNT', rules: required })(
              <Select
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.Currency && baseData.Currency.map(currency => (
                  <Option key={currency.CurrencyID}>{currency.CurrencyID}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Салбар' {...formItemLayout}>
            {getFieldDecorator('SiteID', {
              initialValue: baseData && baseData.ContractSite && baseData.ContractSite.length > 0 && baseData.ContractSite[0].SiteID,
              rules: required
            })(
              <Select
                showSearch
                optionFilterProp='children'
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.Site && baseData.Site.map(site => (
                  <Option key={site.SiteID}>{site.Name}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Бүтээгдэхүүн' {...formItemLayout}>
            <Row gutter={8}>
              <Col span={20}>
                {getFieldDecorator('ProductID', { initialValue: productID, rules: required })(
                  <Select
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 500 }}
                    showSearch
                    optionFilterProp='children'
                    onChange={this.onChangeProduct}
                    disabled={disabledEdit}>
                    {baseData && baseData.Product && baseData.Product.map(product => (
                      <Option key={product.ProductID}>{product.ProductName}</Option>
                    ))}
                  </Select>)}
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button type='link' icon='form' disabled={disabledEdit} onClick={this.onClickProductButton} className='ButtonStyle' />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label='Баталгааны дугаар' {...formItemLayout}>
            {getFieldDecorator('SheetNo', { rules: [{ required: prod && prod.NumberingType === '1' ? false : true, message: 'Мэдээлэл оруулах шаардлагатай.' }] })(
              <Input
                onChange={this.onChangeControls}
                onPressEnter={this.onPressEnterControls}
                disabled={disabledEdit}
              />)}
          </Form.Item>
          <Form.Item label='Мэргэжилтэн' {...formItemLayout}>
            {getFieldDecorator('ContractEmpCode', { initialValue: this.state.LoggedSysuser.EmpCode, rules: required })(
              <Select
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.Emp && baseData.Emp.map(emp => (
                  <Option key={emp.EmpCode}>{emp.EmpName}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Төлөөлөгч / Зуучлагч' {...formItemLayout}>
            {getFieldDecorator('AgentID', {
              initialValue: baseData && baseData.EmpCodeDtl && baseData.EmpCodeDtl.length > 0 && baseData.EmpCodeDtl[0].RegistryNumber,
              rules: required
            })(
              <Select
                showSearch
                optionFilterProp='children'
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.Agent && baseData.Agent.map(agent => (
                  <Option key={agent.AgentID}>{agent.AgentFName}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Даатгуулагч' {...formItemLayout} required='true'>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('CustID', { rules: required })(
                <Input
                  onChange={this.onChangeControls}
                  onPressEnter={this.onPressEnterCustomer}
                  disabled={disabledEdit}
                />)}
            </Form.Item>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('CustName', { rules: required })(
                <Input
                  onChange={this.onChangeControls}
                  onPressEnter={this.onPressEnterCustomer}
                  disabled={disabledEdit}
                />)}
            </Form.Item>
          </Form.Item>
          <Form.Item label='Баталгааны огноо' {...formItemLayout}>
            {getFieldDecorator('ContractDate', { initialValue: moment(this.state.today, dateFormat), rules: required })(
              <DatePicker
                style={{ width: '100%' }}
                onChange={this.onChangeControls}
                allowClear={false}
                disabled={disabledEdit}
                format={dateFormat}
                placeholder=''
              />)}
          </Form.Item>
          <Form.Item label='Эхлэх огноо' {...formItemLayout}>
            {getFieldDecorator('BeginDate', { initialValue: moment(this.state.today, dateFormat), rules: required })(
              <DatePicker
                style={{ width: '100%' }}
                onChange={this.onChangeControls}
                allowClear={false}
                disabled={disabledEdit}
                format={dateFormat}
                placeholder=''
              />)}
          </Form.Item>
          <Form.Item label='Дуусах огноо' {...formItemLayout}>
            {getFieldDecorator('EndDate', { rules: required })(
              <DatePicker
                style={{ width: '100%' }}
                onChange={this.onChangeControls}
                allowClear={false}
                disabled={disabledEdit}
                format={dateFormat}
                placeholder=''
              />)}
          </Form.Item>
          <Form.Item label='Төлөв' {...formItemLayout}>
            {getFieldDecorator('Status', { initialValue: 'H', rules: required })(
              <Select
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.isContractSheet_Status && baseData.isContractSheet_Status.map(isContractSheet_Status => (
                  <Option key={isContractSheet_Status.ConstKey}>{isContractSheet_Status.ValueStr1}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Тайлбар' {...formItemLayout}>
            {getFieldDecorator('Note')(
              <TextArea
                rows={2}
                style={{ marginTop: '4px' }}
                onChange={this.onChangeControls}
                disabled={disabledEdit}
              />)}
          </Form.Item>
          <div style={{ display: isGZInsurance ? 'block' : 'none' }}>
            <Form.Item label='Зорчих улс' {...formItemLayout}>
              {getFieldDecorator('CountryType', { initialValue: null, rules: isGZInsurance ? required : [] })(
                <Select
                  onChange={(value) => { this.onChangeGZDType('CountryType', value); }}
                  disabled={disabledEdit}>
                  {baseData && baseData.isGZDType_CountryType && baseData.isGZDType_CountryType.map(isGZDType_CountryType => (
                    <Option key={isGZDType_CountryType.ConstKey}>{isGZDType_CountryType.ValueStr1}</Option>
                  ))}
                </Select>)}
            </Form.Item>
            <Form.Item label='Зорчих хоног' {...formItemLayout}>
              {getFieldDecorator('Days', { initialValue: null, rules: isGZInsurance ? required : [] })(
                <Select
                  onChange={this.onChangeControls}
                  disabled={disabledEdit}>
                  {isGZDType && isGZDType
                    .reduce((unique, value) => {
                      if (!unique.find(item => item.Period === value.Period))
                        unique.push(value);
                      return unique;
                    }, [])
                    .map(item => (
                      <Option key={item.Period}>{item.Period}</Option>
                    ))}
                </Select>)}
            </Form.Item>
            <Form.Item label='Хамгаалалтын төрөл' {...formItemLayout}>
              {getFieldDecorator('InsType', { initialValue: null, rules: isGZInsurance ? required : [] })(
                <Select
                  onChange={(value) => { this.onChangeGZDType('InsType', value); }}
                  disabled={disabledEdit}>
                  {baseData && baseData.isContract_InsType && baseData.isContract_InsType.map(isContract_InsType => (
                    <Option key={isContract_InsType.ConstKey}>{isContract_InsType.ValueStr1}</Option>
                  ))}
                </Select>)}
            </Form.Item>
            <Form.Item label='Сонгосон үнэлгээ (USD)' {...formItemLayout}>
              {getFieldDecorator('Limit', { initialValue: null, rules: isGZInsurance ? required : [] })(
                <Select
                  onChange={(value) => { this.onChangeGZDType('Limit', value); }}
                  disabled={disabledEdit}>
                  {isGZDType && isGZDType
                    .reduce((unique, value) => {
                      if (!unique.find(item => item.Limit === value.Limit))
                        unique.push(value);
                      return unique;
                    }, [])
                    .map(item => (
                      <Option key={item.Limit}>{item.Limit}</Option>
                    ))}
                </Select>)}
            </Form.Item>
            <Form.Item {...formItemLayout} {...tailFormLayout}>
              {getFieldDecorator('PackageType', { initialValue: 'O', rules: isGZInsurance ? required : [] })(
                <Radio.Group buttonStyle='outline'
                  onChange={(e) => { this.onChangeGZDType('PackageType', e.target.value); }}
                  disabled={disabledEdit}>
                  <Radio.Button value='O'>Нэг хүн</Radio.Button>
                  <Radio.Button value='F'>Гэр бүл</Radio.Button>
                </Radio.Group>)}
            </Form.Item>
            <Form.Item label='Хураамж (USD)' {...formItemLayout}>
              {getFieldDecorator('GZDPackageAmt', { initialValue: 0, rules: isGZInsurance ? greaterThan : [] })(
                <InputNumber
                  style={{ width: '100%' }}
                  onChange={(value) => { this.onChangeGZDPackageAmt('GZDPackageAmt', value); }}
                  disabled={disabledEdit}
                  min={0}
                  precision={2}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onPressEnter={this.onPressEnterControls}
                />)}
            </Form.Item>
            <Form.Item label='Ханш (Т/Н)' {...formItemLayout}>
              {getFieldDecorator('Rate', { initialValue: 0, rules: isGZInsurance ? greaterThan : [] })(
                <InputNumber
                  style={{ width: '100%' }}
                  onChange={(value) => { this.onChangeGZDPackageAmt('Rate', value); }}
                  disabled={disabledEdit}
                  min={0}
                  precision={2}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onPressEnter={this.onPressEnterControls}
                />)}
            </Form.Item>
          </div>
          < Form.Item label='Хураамж төлөх хэлбэр' {...formItemLayout}>
            {getFieldDecorator('PaymentType', { initialValue: '01', rules: required })(
              <Select
                onChange={this.onChangeControls}
                disabled={disabledEdit}>
                {baseData && baseData.isContract_PaymentType && baseData.isContract_PaymentType.map(isContract_PaymentType => (
                  <Option key={isContract_PaymentType.ConstKey}>{isContract_PaymentType.ValueStr1}</Option>
                ))}
              </Select>)}
          </Form.Item>
          <Form.Item label='Үнэлгээ' {...formItemLayout}>
            {getFieldDecorator('ActualAmt', { initialValue: 0, rules: greaterThan })(
              <InputNumber
                style={{ width: '100%' }}
                onChange={this.onChangeActualAmt}
                disabled={disabledEdit}
                min={0}
                precision={2}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onPressEnter={this.onPressEnterControls}
              />)}
          </Form.Item>
          <Form.Item label='Хураамжийн хувь (%)' {...formItemLayout}>
            {getFieldDecorator('BasePremiumAmt', { initialValue: 0, rules: required })(
              <InputNumber
                style={{ width: '100%' }}
                onChange={this.onChangeBasePremiumAmt}
                disabled={disabledEdit}
                min={0}
                max={100}
                precision={2}
                onPressEnter={this.onPressEnterControls}
              />)}
          </Form.Item>
          <Form.Item label='Нийт хураамж' {...formItemLayout}>
            {getFieldDecorator('PremiumAmt', { initialValue: 0, rules: greaterThan })(
              <InputNumber
                style={{ width: '100%' }}
                onChange={this.onChangeControls}
                disabled={disabledEdit}
                min={0}
                precision={2}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onPressEnter={this.onPressEnterControls}
              />)}
          </Form.Item>
          <Form.Item label='Хөнгөлөлтийн хувь (%)' {...formItemLayout}>
            {getFieldDecorator('DiscountPercent', { initialValue: 0 })(
              <InputNumber
                style={{ width: '100%' }}
                onChange={this.onChangeDiscountPercent}
                disabled={disabledEdit}
                min={0}
                max={100}
                precision={2}
                onPressEnter={this.onPressEnterControls}
              />)}
          </Form.Item>
          <Form.Item label='Шимтгэлийн хувь (%)' {...formItemLayout}>
            {getFieldDecorator('CommissionPercent', { initialValue: 0 })(
              <InputNumber
                style={{ width: '100%' }}
                onChange={this.onChangeControls}
                disabled={disabledEdit}
                min={0}
                max={100}
                precision={2}
                onPressEnter={this.onPressEnterControls}
              />)}
          </Form.Item>
          <Form.Item {...tailFormLayout} >
            <Button disabled={!disabledActive} type='primary' htmlType='submit'>Хадгалах</Button>
            <Button style={{ marginLeft: '8px' }} disabled={!disabledActive} type='ghost' htmlType='reset'>Болих</Button>
          </Form.Item>
        </Form>
        {
          this.state.showItem &&
          <ContractItemForm
            wrappedComponentRef={this.contractItemFormRef}
            productProperty={this.state.bufferData && this.state.bufferData.productProperty}
            baseData={this.state.baseData && { agentType: this.state.baseData.arCustomer_AgentType, countryType: this.state.baseData.isCustomer_CountryType, gender: this.state.baseData.hrEmp_Gender }}
            bufferData={this.state.bufferData && this.state.bufferData.isContractItem}
            visible={this.state.showItem}
            onCancel={this.onCancelItem}
            onOk={this.onOkItem}
          />
        }
        {
          this.state.showCustomer &&
          <CustomerForm
            wrappedComponentRef={this.customerFormRef}
            Customer={this.state.Customer}
            visible={this.state.showCustomer}
            loading={this.state.loading}
            onCancel={this.onCancelCustomer}
            onOk={this.onOkCustomer}
          />
        }
        {
          this.state.showCustomerName &&
          <Modal
            visible={this.state.showCustomerName}
            title='Даатгуулагч'
            footer={null}
            onCancel={this.onCancelCustomerName}>
            <Table
              rowKey='CustID'
              columns={tableColumns}
              dataSource={this.state.Customer}
              scroll={{ x: 'max-content', y: 500 }}
              size='small'
              pagination={{ pageSize: 50 }} />
          </Modal>
        }
        {
          this.state.showReport &&
          <Modal
            visible={this.state.showReport}
            centered
            bodyStyle={{ height: '80vh' }}
            width='80vw'
            title='Хэвлэх'
            footer={null}
            destroyOnClose
            onCancel={this.onCancelReport}>
            <PDFViewer
              backend={PDFJs}
              src={this.state.reportUrl}
            />
          </Modal>
        }
      </Spin >
    );
  }
}

const WrappedContractForm = Form.create({ name: 'contract_form' })(ContractForm);

export default class ContractSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ContractNo: props.ContractNo
    };
  }

  render() {
    return (
      <div className='container'>
        <WrappedContractForm ContractNo={this.state.ContractNo} />
      </div>
    )
  }
}
