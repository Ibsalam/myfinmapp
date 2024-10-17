import { Card, Row } from "antd";
import Button from "../Button";
import "./styles.css";

function Cards({ 
    income,
    expense,
    totalBalance,
    budget,
    showExpenseModal,
    showIncomeModal,
    showBudgetModal, // Added prop for showing the budget modal
}) {
  return (
    <div>
      <Row className="my-row">
        {/* Card 1 */}
        <Card bordered={true} className="my-card">
          <h2>Current Balance</h2>
          <p>₦{totalBalance}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>

        {/* Card 2 */}
        <Card bordered={true} className="my-card">
          <h2>Total Income</h2>
          <p>₦{income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>

        {/* Card 3 */}
        <Card bordered={true} className="my-card">
          <h2>Total Expenses</h2>
          <p>₦{expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>

        {/* Card 4 for Budget */}
        <Card bordered={true} className="my-card">
          <h2>Budget</h2>
          <p>₦{budget}</p> {/* Display the budget amount */}
          <Button text="Add Budget" blue={true} onClick={showBudgetModal} /> {/* Button to add budget */}
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
