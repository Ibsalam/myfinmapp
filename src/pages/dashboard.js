import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import CsvComponent from '../components/Csv';
import TransactionsTable from "../components/Table";
import AddExpenseModal from "../components/Modals/AddExpenses";
import AddIncomeModal from "../components/Modals/AddIncome";
import AddBudgetModal from "../components/Modals/AddBudget";
import { addDoc, collection, getDocs, query, doc, getDoc } from "firebase/firestore"; // Added missing doc and getDoc imports
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { db, auth } from "../firebase"; // Ensure both db and auth are imported

function Dashboard() {
  const [transactions, setTransactions] = useState([]); // Corrected transactions state to store actual fetched transactions
  const [loading, setLoading] = useState(false); // State to manage loading state during fetching
  const [user] = useAuthState(auth); // Using Firebase auth hook to get the logged-in user
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false); // Modal state management for Expense
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false); // Modal state management for Income
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [budget, setBudget] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Show modal handlers
  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const showBudgetModal = () => setIsBudgetModalVisible(true); // Corrected budget modal function

  // Hide modal handlers
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);
  const handleBudgetCancel = () => setIsBudgetModalVisible(false);

  // Handling form submission for both Income and Expense
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"), // Corrected date format
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction); // Call to add the transaction to Firestore
  };

  const handleAddBudget = (values) => {
    setBudget(values.amount);
    handleBudgetCancel();
  };

  // Function to add a transaction to Firestore
  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
      setTransactions((prev) => [...prev, transaction]); // Update transactions state
      balanceCalc();
    } catch (e) {
      console.error("Error adding transaction! ", e);
      toast.error("Couldn't add Transaction");
    }
  }

  // Fetch transactions when the component mounts
  useEffect(() => {
    if (user) {
      fetchTransactions(); // Fetch the user's transactions from Firestore
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      balanceCalc();
    }
  }, [transactions]);

  useEffect(() => {
    if (expense >= budget) {
      toast.warn("You have reached your budget limit!");
    } else if (expense > budget) {
      toast.error("You have exceeded your budget!");
    }
  }, [expense, budget]);

  // Calculate total balance, income, and expenses
  const balanceCalc = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  // Function to fetch transactions from Firestore
  async function fetchTransactions() {
    setLoading(true); // Start loading indicator
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray); // Set fetched transactions to state
      toast.success("Transactions Fetched!");
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      toast.error("Couldn't fetch transactions");
    }
    setLoading(false); // Stop loading indicator
  }

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p> // Show loading message while fetching data
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            budget={budget}
            showExpenseModal={showExpenseModal} // Passing modal handlers to Cards component
            showIncomeModal={showIncomeModal}
            showBudgetModal={showBudgetModal}
          />
          <TransactionsTable transactions={transactions} />
          <CsvComponent transactions={transactions} />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible} // Expense modal visibility control
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible} // Income modal visibility control
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <AddBudgetModal
            isBudgetModalVisible={isBudgetModalVisible} // Budget modal visibility control
            handleBudgetCancel={handleBudgetCancel}
            onFinish={handleAddBudget}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
