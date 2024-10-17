import React, { useState } from "react";
import { Table, Input, Select, Button, Space } from "antd";
import "./styles.css";

const { Search } = Input;
const { Option } = Select;

function TransactionsTable({ transactions }) {
  const [filteredData, setFilteredData] = useState(transactions);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [filterType, setFilterType] = useState("");

  // Search function
  const onSearch = (value) => {
    const filtered = transactions.filter((transaction) =>
      transaction.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setSearchKeyword(value);
  };

  // Filter function by transaction type (income/expense)
  const onFilterType = (value) => {
    const filtered = transactions.filter((transaction) =>
      value ? transaction.type === value : true
    );
    setFilteredData(filtered);
    setFilterType(value);
  };

  // Sort function for Date and Amount
  const handleSort = (value) => {
    let sortedData = [...filteredData];
    if (value === "date") {
      sortedData = sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (value === "amount") {
      sortedData = sortedData.sort((a, b) => a.amount - b.amount);
    }
    setFilteredData(sortedData);
    setSortOrder(value);
  };

  // Define table columns
  const columns = [
    {
      title: "Description",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Amount (₦)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>₦{amount.toLocaleString()}</span>,
      sorter: (a, b) => a.amount - b.amount,
      sortOrder: sortOrder === "amount" ? "ascend" : null,
    },
    {
      title: "Category",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) => (
        <span className={text === "income" ? "income-text" : "expense-text"}>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortOrder: sortOrder === "date" ? "ascend" : null,
    },
  ];

  return (
    <div className="table-container">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by description"
          onSearch={onSearch}
          enterButton
          allowClear
          value={searchKeyword}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Select
          placeholder="Sort By"
          onChange={handleSort}
          style={{ width: 150 }}
          value={sortOrder}
        >
          <Option value="date">Date</Option>
          <Option value="amount">Amount</Option>
        </Select>
        <Select
          placeholder="Filter by Type"
          onChange={onFilterType}
          style={{ width: 150 }}
          value={filterType}
          allowClear
        >
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey={(record) => record.date + record.name}
      />
    </div>
  );
}

export default TransactionsTable;
