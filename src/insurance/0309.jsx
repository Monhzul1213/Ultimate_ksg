import { Form, Input } from 'antd';
import React from 'react';
import cookie from 'react-cookies';

class BHistory32 extends React.Component {
    constructor(props) {
        super(props);
        const LoggedSysuser = cookie.load('LoggedSysuser');
        this.state = {
            loading: false,
            LoggedSysuser,
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
     const formLayount = {
      labelCol: {
        span: 12,
      },
      wrapperCol: {
        span: 12,
      },
      labelAlign: "left",
    };
        return (
            <div>
                <Form>
              <Form.Item
                label="Даатгуулагчийн овог"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Даатгуулагчийн нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Даатгуулачгийн регистр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Жолооны үнэмлэхний №"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                       <Form.Item
                label="ТХ-ийн улсын №"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="ТХ-ийн марк"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                      <Form.Item
                label="ТХ-ийн загвар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                            <Form.Item
                label="ТХ-ийн ангилал"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                 <Form.Item
                label="Хөдөлгүүрийн багтаамж"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                       <Form.Item
                label="Үйлдвэрлэсэн он"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                       <Form.Item
                label="МУ-д орж ирсэн он"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                             <Form.Item
                label="Арлын дугаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>                              <Form.Item
                label="Өнгө"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                                           <Form.Item
                label="Утасны дугаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
const EditableFormTable = Form.create()(BHistory32);
export default EditableFormTable;