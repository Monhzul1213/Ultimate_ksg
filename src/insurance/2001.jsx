import { Form, Input } from 'antd';
import React from 'react';
import cookie from 'react-cookies';

class BHistory73 extends React.Component {
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
                label="ТХ-ийн улсын №"
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
                label="Жолоочийн овог"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                             <Form.Item
                label="Жолоочийн нэр"
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
                label="Хаяг"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                   <Form.Item
                label="Төрсөн огноо"
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
                label="Мэйл"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
                    </Form.Item>
                                     <Form.Item
                label="ЖХД -ын бүлэг"
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
                label="Үндсэн үйл ажиллагаа"
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
                label="ЖХД Гэрээ байгуулсан"
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
              </Form.Item>
                                    <Form.Item
                label="Даатгуулагчийн утасны дугаар"
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
                label="Жолоо барьсан жил"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
              </Form.Item>
                                    <Form.Item
                label="Чиргүүлтэй эсэх"
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
                label="ТХ-ийн марк"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
              </Form.Item>
                                    <Form.Item
                label="Даацын хэмжээ"
                style={{ marginBottom: "0px" }}
                {...formLayount}
              >
                {getFieldDecorator("PremiumAmt")(
                  <Input/>
                )}
              </Form.Item>
                                    <Form.Item
                label="Суудлын тоо"
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
                label="Өнгө"
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
const EditableFormTable = Form.create()(BHistory73);
export default EditableFormTable;