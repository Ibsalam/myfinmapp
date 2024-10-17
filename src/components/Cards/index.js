import { Card, Row } from "antd";
import Button from "../Button";
import "./styles.css";

function Cards({ 
  income,
  expense,
  totalBalance,
  budget,  // Budget value passed as a prop
  showExpenseModal,
  showIncomeModal,
  showBudgetModal, 
}) {
  return (
    <div>
      <Row className="my-row">
        {/* Current Balance Card */}
        <Card bordered={true} className="my-card">
          <h2>Current Balance</h2>
          <p>₦{totalBalance}</p>
          <Button text="Reset Balance" blue={true} />
        </Card>

        {/* Total Income Card */}
        <Card bordered={true} className="my-card">
          <h2>Total Income</h2>
          <p>₦{income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>

        {/* Total Expenses Card */}
        <Card bordered={true} className="my-card">
          <h2>Total Expenses</h2>
          <p>₦{expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>

        {/* Budget Card */}
        <Card bordered={true} className="my-card">
          <h2>Budget</h2>
          <p>₦{budget}</p> {/* Display the current budget value */}
          <Button text="Add Budget" blue={true} onClick={showBudgetModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
