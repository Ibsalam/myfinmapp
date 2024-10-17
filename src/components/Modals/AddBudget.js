import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker } from "antd";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../firebase"; // Ensure these imports point to your Firebase config file
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import moment from "moment";

function AddBudgetModal({ isBudgetModalVisible, handleBudgetCancel, onFinish }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth); // Get the authenticated user

  const handleSubmit = async (values) => {
    if (!user) {
      toast.error("You need to be logged in to add a budget");
      return;
    }

    const { category, amount, date } = values;

    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid); // Reference to the user's document

      // Update user's document with new budget
      await updateDoc(userRef, {
        budgets: arrayUnion({
          category,
          amount: Number(amount),
          date: date.format("YYYY-MM-DD"),
          createdAt: new Date(),
        }),
      });

      toast.success("Budget added successfully!");
      setLoading(false);
      form.resetFields(); // Reset the form fields
      handleBudgetCancel(); // Close the modal
    } catch (error) {
      console.error("Error adding budget:", error);
      toast.error("Failed to add budget");
      setLoading(false);
    }
  };

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Budget"
      open={isBudgetModalVisible}
      onCancel={handleBudgetCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit} // Call the new handleSubmit function
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Category"
          name="category" // Updated field name to "category"
          rules={[{ required: true, message: "Please provide a category!" }]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the budget amount!" }]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the budget date!" }]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit" loading={loading}>
            {loading ? "Adding..." : "Add Budget"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddBudgetModal;
