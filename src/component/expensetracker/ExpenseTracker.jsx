import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthReducer";
import { useSelector } from "react-redux";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExpenseTracker() {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // const ITEMS_PER_PAGE = 5;

  const [updateData, setUpdateData] = useState(null);
  const sum = expenses.reduce(
    (total, expense) => total + parseInt(expense.amount),
    0
  );

  async function fetchData(page) {
    try {
      const response = await axios.get("http://localhost:3000/getData", {
        params: { page, limit: itemsPerPage },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const { expenses, totalItems } = response.data;
      setExpenses(expenses);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      dispatch(authActions.islogin(token));
    }

    fetchData(currentPage);
  }, [currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset the current page when items per page changes
  };

  async function submitHandler(event) {
    event.preventDefault();

    const amountInput = formRef.current.elements.amount.value;
    const descriptionInput = formRef.current.elements.description.value;
    const categoryInput = formRef.current.elements.category.value;
    // console.log(amountInput, descriptionInput, categoryInput);
    event.target.reset();

    const expenseData = {
      amount: parseInt(amountInput),
      description: descriptionInput,
      category: categoryInput,
      totalexpense: sum,
    };

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
    fetchData(currentPage);
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

  const leaderBoardHandler = () => {
    navigate("/leaderboard");
  };

  async function downloadExpensesAsTxt() {
    const response = await axios.get("http://localhost:3000/download", {
      headers: {
        Authorization: localStorage.getItem("token"), // Include the JWT token from local storage
      },
    });
    console.log(response.data);
    const { fileUrl } = response.data;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "expenses.txt";
    link.click();
  }

  const allDownload = () => {
    navigate("/alldownload");
  };

  return (
    <>
      {isPremium && (
        <h1 className="text-white bg-gray-900 py-4 text-center  font-bold">
          You Are Premium User
        </h1>
      )}

      {!isPremium && (
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
              required
            />
            <label className="block mb-2 font-medium text-gray-800">
              Expense Description
            </label>
            <input
              type="text"
              id="description"
              className="border border-gray-300 rounded px-3 py-2 mb-3 w-full"
              required
            />
            <label className="block mb-2 font-medium text-gray-800">
              Select Category
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded px-3 py-2 mb-3 w-full"
              required
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
          <div className="flex items-center justify-center mt-4 space-x-4">
            <span className="text-white bg-gradient-to-b from-blue-200 to-purple-700 px-2 py-2 font-medium text-black">
              Select Number of Rows
            </span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border bg-gradient-to-b from-blue-200 to-purple-700 border-white rounded px-3 py-2 text-black"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
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
          <div className="flex justify-center mt-4 space-x-4">
            {currentPage > 1 && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
              >
                Previous Page
              </button>
            )}

            {currentPage < totalPages && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              >
                Next Page
              </button>
            )}
          </div>
        </div>
      )}
      {/* ***** */}

      {isPremium && (
        <div className="bg-gray-900">
          <button
            onClick={downloadExpensesAsTxt}
            className="bg-purple-600 hover:bg-purple-800 ml-2 text-white font-medium py-2 px-4 rounded"
          >
            Download File
          </button>

          <button
            onClick={allDownload}
            className="bg-pink-600 hover:bg-pink-800 ml-4 text-white font-medium py-2 px-4 rounded"
          >
            All Downloads
          </button>

          <button
            onClick={leaderBoardHandler}
            className="bg-green-600 hover:bg-green-800 text-white font-medium py-2 px-4 ml-4 rounded"
          >
            Leaderboard
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
              <option value="fuel">Fuel</option>
              <option value="electricity">Electricity</option>
              <option value="food">Food</option>
              <option value="movie">Movie</option>
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
          <div className="flex items-center justify-center mt-4 space-x-4">
            <span className="text-white bg-gray-500 px-2 py-2 font-medium">
              Select Number of Rows
            </span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border bg-gray-700 border-white rounded px-3 py-2 text-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
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
          <div className="flex justify-center mt-4 space-x-4">
            {currentPage > 1 && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
              >
                Previous Page
              </button>
            )}

            {currentPage < totalPages && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              >
                Next Page
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
