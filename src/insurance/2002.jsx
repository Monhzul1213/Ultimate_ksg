import { Form, Input } from 'antd';
import React from 'react';
import cookie from 'react-cookies';

class BHistory74 extends React.Component {
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
      const { data } = this.props
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
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Даатгуулагчийн нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Даатгуулагчийн регистр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Утасны дугаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                             <Form.Item
                label="Даатгуулагчийн дугаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                             <Form.Item
                label="Хаяг"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                             <Form.Item
                label="Төрсөн огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Хүйс"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Үндсэн ажилчдын тоо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                                     <Form.Item
                label="Мэйл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                                     <Form.Item
                label="Байгуулагдсан огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                                     <Form.Item
                label="Үндсэн үйл ажиллагаа"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
                    </Form.Item>
                                     <Form.Item
                label="Газар нутгийн хязгаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input disabled={true}/>
                )}
              </Form.Item>
                </Form>
            </div>
        );
    }
}
const EditableFormTable = Form.create()(BHistory74);
export default EditableFormTable;