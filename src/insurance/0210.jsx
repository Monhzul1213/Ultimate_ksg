import { Form, Input } from 'antd';
import React from 'react';
import cookie from 'react-cookies';

class BHistory26 extends React.Component {
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
                label="Өрөөний тоо"
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
                label="Утасны дугаар"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                            <Form.Item
                label="Гэрчилгээний №"
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
                label="Эзэмшигчийн нэр"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                       <Form.Item
                label="Ашиглалтанд орсон он"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                             <Form.Item
                label="Хөрөнгийн төрөл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>                              <Form.Item
                label="Зах зээлийн үнэ"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                                                           <Form.Item
                label="Орон сууцны хаяг"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                           <Form.Item
                label="Үйл ажиллагааны чиглэл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                           <Form.Item
                label="Барилгын хийц"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                           <Form.Item
                label="Зориулалт"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                           <Form.Item
                label="Байгуулагдсан огноо"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                      <Form.Item
                label="Талбайн хэмжээ"
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
const EditableFormTable = Form.create()(BHistory26);
export default EditableFormTable;