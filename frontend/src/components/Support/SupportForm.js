import { Form, Input, Select } from "antd";
import React from "react";
import "./SupportForm.css";
import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;

const SupportForm = () => {
  return (
    <div className="support-form-container">
      <div className="support-form">
        <h1>Submit a request</h1>
        <Form className="edit-form">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email address should not be empty" },
            ]}
          >
            <div className="email-box">
              <h3>Your email address</h3>
              <Input placeholder="Email address" />
            </div>  
            
          </Form.Item>
          <Form.Item>
            <Select
              style={{ width: 200 }}
              placeholder="What do you need help with"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="broken">Broken image/video</Option>
              <Option value="item">Item not Displayed</Option>
              <Option value="other">Other</Option>
              <Option value="que">Question/Comment</Option>
              <Option value="sec">Security Vulnerability</Option>
              <Option value="ver">Verification issue/Question</Option>
            </Select>
            ,
          </Form.Item>
          <Form.Item>
            <h3>Issue Subject</h3>
            <Input placeholder="Let us know your issue subject" />
            <p>
              Please provide a one-line description of the issue you're
              currently facing.
            </p>
          </Form.Item>
          <Form.Item>
            <h3>Your address</h3>
            <Input placeholder="We don't share your address details" />
            <p>
              Please provide the wallet address linked to your Rarible Account
            </p>
          </Form.Item>

          <Form.Item
            name="bio"
            rules={[{ required: true, message: "Royalties must be a number" }]}
          >
            <div className="bio-box">
              <div className="royalti-input">
                <h3>
                  Please describe the problem in as much detail as possible.
                </h3>
                <Input.TextArea placeholder="Describe your problem briefly" />
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <button className="submit-button" type="primary" htmlType="submit">
              Submit
            </button>
          </Form.Item>
        </Form>
      </div>
      <div className="support-search">
        <Input allowClear prefix={<SearchOutlined />} placeholder="Search" />
      </div>
    </div>
  );
};

export default SupportForm;
