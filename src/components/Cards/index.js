import { Card, Row } from "antd";
import Button from "../Button";
import "./styles.css";

function Cards({ showExpenseModal, showIncomeModal }) { // Accept props
  return (
    <div>
      <Row className="my-row">
        {/* Card 1 */}
        <Card bordered={true} className="my-card">
          <h2>Current Balance</h2>
          <p>₦0.00</p> {/* Display Naira symbol */}
          <Button text="Reset Balance" blue={true} />
        </Card>

        {/* Card 2 */}
        <Card bordered={true} className="my-card">
          <h2>Total Income</h2>
          <p>₦0.00</p> {/* Display Naira symbol */}
          <Button text="Add Income" blue={true} onClick={showIncomeModal} /> {/* Use showIncomeModal */}
        </Card>

        {/* Card 3 */}
        <Card bordered={true} className="my-card">
          <h2>Total Expenses</h2>
          <p>₦0.00</p> {/* Display Naira symbol */}
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} /> {/* Use showExpenseModal */}
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
