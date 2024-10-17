import React, { useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpenseModal from "../components/Modals/AddExpenses";
import AddIncomeModal from "../components/Modals/AddIncome";
import { addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import { collection } from "firebase/firestore";  // Firestore collection
import { db } from "../firebase";  // Firestore database
import { auth } from "../firebase";

function Dashboard() {
    const transaction = [
        {
            type: "income",
            amount: 1800,
            tag: "salary",
            name: "income 1",
            date: "2024-10-17",
        },
        {
            type: "expense",
            amount: 600,
            tag: "food",
            name: "expense 1",
            date: "2024-10-18",
        },
    ]
    const [user] = useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false); // Fixed variable names and syntax
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false); // Fixed variable names and syntax

    const showExpenseModal = () => setIsExpenseModalVisible(true); // Fixed function definition
    const showIncomeModal = () => setIsIncomeModalVisible(true); // Fixed function definition

    const handleExpenseCancel = () => setIsExpenseModalVisible(false); // Fixed function definition
    const handleIncomeCancel = () => setIsIncomeModalVisible(false); // Fixed function definition

    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: moment(values.date).format("YYY-MMM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };
            addTransaction(newTransaction);
        };

        async function addTransaction(transaction) {
            try {
                const docRef = await addDoc(
                    collection(db, `users/${user.uid}/transactions`),
                    transaction
                );
                console.log("Document written with ID: ", docRef.id);

                toast.success("Transaction Added!");
            } catch (e) {
                console.error("Error adding transaction! ", e);
                toast.error("Couldn't add Transaction");
                }
            }

    return (
        <div>
            <Header />
            <Cards
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            />
            <AddExpenseModal
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFinish={onFinish}
            />

            <AddIncomeModal
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFinish={onFinish}
            />
        </div>
    );
}

export default Dashboard;
