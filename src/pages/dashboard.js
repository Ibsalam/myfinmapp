import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import CsvComponent from '../components/Csv';
import TransactionsTable from "../components/Table";
import AddExpenseModal from "../components/Modals/AddExpenses";
import AddIncomeModal from "../components/Modals/AddIncome";
import AddBudgetModal from "../components/Modals/AddBudget";
import { addDoc, collection, getDocs, query, doc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import Chart from "../components/Charts";
import './Dashboard.css';  // Importing custom CSS

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);

  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showBudgetModal = () => setIsBudgetModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);
  const handleBudgetCancel = () => setIsBudgetModalVisible(false);

  const handleAddBudget = async (values) => {
    const { category, amount, date } = values;

    if (!user) {
      toast.error("You need to be logged in to add a budget");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      toast.error("Invalid budget amount");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid); // Reference to the user's document

      // Update user's document with new budget
      await updateDoc(userRef, {
        budgets: arrayUnion({
          category,
          amount: parsedAmount,
          date: date.format("YYYY-MM-DD"),
          createdAt: new Date(),
        }),
      });

      toast.success("Budget added successfully!");
      setBudget(prevBudget => prevBudget + parsedAmount);
      handleBudgetCancel(); // Close the modal
    } catch (error) {
      console.error("Error adding budget:", error);
      toast.error("Failed to add budget");
    }
  };

  const onFinish = async (values, type) => {
    try {
      const transactionData = {
        amount: parseFloat(values.amount),
        description: values.description || "",
        type: type,
        date: new Date().toISOString(),
      };

      // Add to transactions collection
      await addDoc(collection(db, `users/${user.uid}/transactions`), transactionData);

      if (type === "income") {
        setIncome(prevIncome => prevIncome + transactionData.amount);
      } else if (type === "expense") {
        setExpense(prevExpense => prevExpense + transactionData.amount);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
      if (type === "income") {
        handleIncomeCancel();
      } else if (type === "expense") {
        handleExpenseCancel();
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast.error(`Couldn't add ${type}`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();  // Fetch transactions when the user is logged in
      fetchBudget(); // Fetch budget on user change
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });

      setTransactions(transactionsArray);  // Save transactions into state
      balanceCalc(transactionsArray);      // Calculate balance after fetching transactions
      toast.success("Transactions Fetched!");
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Couldn't fetch transactions");
    }
    setLoading(false);
  };

  const fetchBudget = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const totalBudget = data?.budgets?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
        setBudget(totalBudget);
      }
    } catch (error) {
      console.error("Error fetching budget:", error);
      toast.error("Couldn't fetch budget");
    }
  };

  const balanceCalc = (transactionsArray) => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactionsArray.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === "income") {
        incomeTotal += amount;
      } else if (transaction.type === "expense") {
        expensesTotal += amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            budget={budget}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            showBudgetModal={showBudgetModal}
          />
          
          {transactions.length === 0 && (
            <div className="no-transactions">
              <p>No transactions to display</p>
            </div>
          )}

          <Chart income={income} expense={expense} />
          <TransactionsTable transactions={transactions} />
          <CsvComponent transactions={transactions} />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={(values) => onFinish(values, "expense")}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={(values) => onFinish(values, "income")}
          />
          <AddBudgetModal
            isBudgetModalVisible={isBudgetModalVisible}
            handleBudgetCancel={handleBudgetCancel}
            onFinish={handleAddBudget}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
