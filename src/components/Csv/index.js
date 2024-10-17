import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { CSVLink } from 'react-csv';
import './styles.css';

const CsvComponent = ({ transactions }) => {
  const [fileList, setFileList] = useState([]);

  // Handle file upload
  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsedData = content.split('\n').slice(1).map(row => {
          const [name, amount, tag, type, date] = row.split(',');
          return {
            name,
            amount: parseFloat(amount),
            tag,
            type,
            date,
          };
        });
        // Here you can handle the parsed data (e.g., add to state)
        console.log(parsedData);
      };
      reader.readAsText(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="csv-container">
      <Upload
        accept=".csv"
        showUploadList={false}
        customRequest={handleUpload}
      >
        <Button type="primary">Import CSV</Button>
      </Upload>

      <CSVLink data={transactions} filename={"transactions.csv"}>
        <Button type="primary" className="export-btn">
          Export CSV
        </Button>
      </CSVLink>
    </div>
  );
};

export default CsvComponent;
