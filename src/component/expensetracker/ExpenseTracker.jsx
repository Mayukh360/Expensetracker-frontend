
import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthReducer";
import { useSelector } from "react-redux";

import axios from "axios";

export default function ExpenseTracker() {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState([]);
  const isToggle = useSelector((state) => state.auth.darkToggle);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [updateData, setUpdateData] = useState(null);

  async function fetchData() {
    const response = await axios.get("http://localhost:3000/getData");
    const data = response.data;
    const fetchedExpenses = [];
    if (userId == response.data.userId) {
    }
    for (const key in data) {
      if (data[key].userId == userId) {
        fetchedExpenses.push({
          id: data[key].id,
          amount: data[key].amount,
          description: data[key].description,
          category: data[key].category,
        });
      }
    }
    setExpenses(fetchedExpenses);
  }
  useEffect(() => {
    if (token) {
      dispatch(authActions.islogin(token));
    }

    fetchData();
  }, []);

  async function submitHandler(event) {
    event.preventDefault();

    const amountInput = formRef.current.elements.amount.value;
    const descriptionInput = formRef.current.elements.description.value;
    const categoryInput = formRef.current.elements.category.value;
    // console.log(amountInput, descriptionInput, categoryInput);
    // event.target.reset();

    const expenseData = {
      amount: parseInt(amountInput),
      description: descriptionInput,
      category: categoryInput,
    };
    // setExpenses([expenseData]);
    // setExpenses((prevExpenses) => [...prevExpenses, expenseData]);
    console.log(expenseData);
    if (!updateData) {
      await axios.post("http://localhost:3000/getData", expenseData, {
        headers: {
          Authorization: localStorage.getItem("token"), // Include the JWT token from local storage
        },
      });
    } else {
      await axios.put(
        `http://localhost:3000/addData/${updateData}`,
        expenseData
      );
      // console.log(updateData)
      setUpdateData(null);
    }
    fetchData();
  }

  const dltbtnHandler = (expenseId) => {
    console.log("ID", expenseId);
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== expenseId)
    );
    axios.delete(`http://localhost:3000/getData/${expenseId}`);
  };
  const editbtnhandler = (expenseId) => {
    //   findind the specific object  which needs to populate
    setUpdateData(expenseId);
    const expenseToEdit = expenses.find((expense) => expense.id === expenseId);
    if (expenseToEdit) {
      formRef.current.elements.amount.value = expenseToEdit.amount;
      formRef.current.elements.description.value = expenseToEdit.description;
      formRef.current.elements.category.value = expenseToEdit.category;
    }
  };

  const sum = expenses.reduce(
    (total, expense) => total + parseInt(expense.amount),
    0
  );

  if (sum) {
    dispatch(authActions.ispremium(sum));
  }
  // setTotalExpense(sum);
  // console.log(sum)
  function downloadExpensesAsTxt() {
    const data = expenses.map((expense) => {
      return `Amount: ${expense.amount} | Description: ${expense.description} | Category: ${expense.category}`;
    });
    const text = data.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      {isToggle && (
        <h1 className="text-white bg-gray-900 py-4 text-center  font-bold">
          Dark Theme Activated
        </h1>
      )}

      {!isToggle && (
        <div>
          <form
            ref={formRef}
            onSubmit={submitHandler}
            className="max-w-x1 mx-auto bg-gradient-to-b from-blue-200 to-purple-700 bg-opacity-75 rounded p-6 shadow-md mt-6"
          >
            <label className="block mb-2 font-medium text-gray-800">
              Expense Amount
            </label>
            <input
              type="number"
              id="amount"
              className="border border-gray-300 rounded px-3 py-2 mb-3 w-full"
            />
            <label className="block mb-2 font-medium text-gray-800">
              Expense Description
            </label>
            <input
              type="text"
              id="description"
              className="border border-gray-300 rounded px-3 py-2 mb-3 w-full"
            />
            <label className="block mb-2 font-medium text-gray-800">
              Select Category
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded px-3 py-2 mb-3 w-full"
            >
              <option value="">Select Category</option>
              <option value="fuel">Fuel</option>
              <option value="electricity">Electricity</option>
              <option value="food">Food</option>
              <option value="movie">Movie</option>
            </select>
            <button
              type="submit"
              className="bg-cyan-500 text-white font-medium py-2 px-4 rounded hover:bg-green-800"
            >
              {updateData ? "Update" : "Submit"}
            </button>
            <div className="text-center mt-4 ">
              <span className="text-2xl font-medium text-gray-100 bg-green-600 px-3 py-3">
                Total Amount :{sum}
              </span>
            </div>
          </form>
          <ul className="max-w-x1 mx-auto mt-6">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="max-w-x1 mx-auto mt-6 py-4 px-4 bg-gradient-to-b from-blue-200 to-purple-700 bg-opacity-75 "
              >
                <span className="font-medium">Amount: </span>
                {expense.amount} |{" "}
                <span className="font-medium">Description: </span>
                {expense.description} |{" "}
                <span className="font-medium">Category: </span>
                {expense.category}
                <button
                  onClick={() => {
                    dltbtnHandler(expense.id);
                  }}
                  className="ml-2   bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded  "
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    editbtnhandler(expense.id);
                  }}
                  className="ml-2  bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded "
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* ***** */}

      {/* {isToggle && (
        <div className="bg-gray-900">
          <button
            onClick={downloadExpensesAsTxt}
            className="bg-purple-600 text-white font-medium py-2 px-4 rounded"
          >
            Download File
          </button>
          <form
            ref={formRef}
            onSubmit={submitHandler}
            className="max-w-x1 mx-auto bg-gradient-to-b from-red-700 to-purple-800 rounded p-6 shadow-md mt-6 bg-gray-800 text-white"
          >
            <label className="block mb-2 font-medium">Expense Amount</label>
            <input
              type="number"
              id="amount"
              className="border bg-gray-700 border-white rounded px-3 py-2 mb-3 w-full text-white"
            />
            <label className="block mb-2 font-medium">
              Expense Description
            </label>
            <input
              type="text"
              id="description"
              className="border bg-gray-700 border-white rounded px-3 py-2 mb-3 w-full text-white"
            />
            <label className="block mb-2 font-medium">Select Category</label>
            <select
              id="category"
              className="border bg-gray-700 border-white rounded px-3 py-2 mb-3 w-full text-white"
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="utilities">Utilities</option>
              <option value="transportation">Transportation</option>
              <option value="other">Other</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700"
            >
              {updateData ? "Update" : "Submit"}
            </button>
            <div className="text-center mt-4">
              <span className="text-2xl font-medium bg-indigo-600 px-3 py-3">
                Total Amount: {sum}
              </span>
            </div>
          </form>
          <ul className="max-w-x1 mx-auto mt-6">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="max-w-x1 mx-auto mt-6 py-4 px-4 bg-gradient-to-b from-blue-200 to-purple-700 bg-opacity-75 text-white"
              >
                <span className="font-medium">Amount: </span>
                {expense.amount} |{" "}
                <span className="font-medium">Description: </span>
                {expense.description} |{" "}
                <span className="font-medium">Category: </span>
                {expense.category}
                <button
                  onClick={() => {
                    dltbtnHandler(expense.id);
                  }}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    editbtnhandler(expense.id);
                  }}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </>
  );
}
