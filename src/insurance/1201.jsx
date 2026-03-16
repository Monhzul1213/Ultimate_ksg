import { Form, Input } from 'antd';
import React from 'react';
import cookie from 'react-cookies';

class BHistory70 extends React.Component {
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
                label="Даатгуулагчийн регистр"
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
                             <Form.Item
                label="Мэйл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                             <Form.Item
                label="Хаяг"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                             <Form.Item
                label="Хүйс"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="зээлийн төрөл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Зээлийн дүн"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Барьцаа хөрөнгийн төрөл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Барьцаа хөрөнгийн байршил"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Банкны код"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>               <Form.Item
                label="банкны нэр"
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
const EditableFormTable = Form.create()(BHistory70);
export default EditableFormTable;