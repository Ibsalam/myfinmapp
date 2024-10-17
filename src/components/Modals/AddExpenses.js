import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel, // This function will close the modal
  onFinish,
}) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState(["food", "education", "office"]);

  const handleCategoryChange = (value) => {
    const newCategories = value.filter((val) => !categories.includes(val));
    setCategories([...categories, ...newCategories]);
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense"); // Handle form submission
          form.resetFields(); // Reset form fields
          handleExpenseCancel(); // Automatically close the modal after submission
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Description"
          name="name"
          rules={[{ required: true, message: "Describe the transaction!" }]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the expense amount!" }]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the expense date!" }]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select
            mode="tags"
            className="select-input-2"
            onChange={handleCategoryChange}
            placeholder="Select or add category"
          >
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
