import { Form, Input } from 'antd';
import React from 'react';
import cookie from 'react-cookies';

class BHistory17 extends React.Component {
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
                label="Хөрөнгийн нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Төрөл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Зүйлийн байршил, хаяг"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Даатгалын зүйлийн ашиглах зориулалт"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                      <Form.Item
                label="Даатгалын зүйлийн насжилт"
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
const EditableFormTable = Form.create()(BHistory17);
export default EditableFormTable;