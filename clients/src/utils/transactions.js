import React, { useRef, useEffect } from "react";
import { AJAX } from "./ajax";

const transactionsRef = { current: [] };

const initializeTransactions = () => {
  const transactionsData = localStorage.getItem("transactions");
  if (!transactionsData || transactionsData === "undefined") {
    localStorage.setItem("transactions", "[]");
    transactionsRef.current = [];
  } else {
    transactionsRef.current = JSON.parse(transactionsData);
  }
};

const updateTransactions = () => {
  localStorage.setItem("transactions", JSON.stringify(transactionsRef.current));
};

const formatEpoch = (seconds) => {
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsStr = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsStr}`;
};

const loadTransactions = () => {
  return AJAX("../api/getTransactions.php")
    .then((response) => {
      if (response && response.transactions) {
        transactionsRef.current = response.transactions;
        updateTransactions();
        console.log(response.transactions);
      } else {
        console.warn("No transactions found in the API response.");
      }
    })
    .catch((error) => {
      console.error("Failed to load transactions:", error);
    });
};

const addTransaction = (id, other, amount, type, date) => {
  transactionsRef.current.unshift({
    id: id,
    other: other,
    amount: amount,
    type: type,
    date: formatEpoch(date),
  });
  updateTransactions();
};

const renderTransactions = (div) => {
  div.innerHTML = ""; // Clear the container
  if (transactionsRef.current.length === 0) {
    div.innerHTML =
      "<p class='text-gray-500 text-center'>No transactions available.</p>";
    return;
  }

  transactionsRef.current.forEach((transaction) => {
    const transactionDiv = document.createElement("div");
    transactionDiv.className =
      "transaction p-4 border-b border-gray-300 bg-white shadow-md rounded-lg mb-4";

    let sas = `
      <table class="w-full text-left border-collapse">
        <tr class="border-b border-gray-200">
          <th class="py-2 px-4 text-gray-600 font-semibold">ID</th>
          <th class="py-2 px-4 text-gray-600 font-semibold">:</th>
          <td class="py-2 px-4 text-gray-800">${transaction.id}</td>
        </tr>
    `;

    if (transaction.type !== 0) {
      sas += `
        <tr class="border-b border-gray-200">
          <th class="py-2 px-4 text-gray-600 font-semibold">${
            transaction.type > 0 ? "Sender" : "Receiver"
          }</th>
          <th class="py-2 px-4 text-gray-600 font-semibold">:</th>
          <td class="py-2 px-4 text-gray-800">${transaction.other}</td>
        </tr>
      `;
    }

    sas += `
      <tr class="border-b border-gray-200">
        <th class="py-2 px-4 text-gray-600 font-semibold">Amount</th>
        <th class="py-2 px-4 text-gray-600 font-semibold">:</th>
        <td class="py-2 px-4 text-gray-800">${transaction.amount / 100} Rs.</td>
      </tr>
      <tr class="border-b border-gray-200">
        <th class="py-2 px-4 text-gray-600 font-semibold">Type</th>
        <th class="py-2 px-4 text-gray-600 font-semibold">:</th>
        <td class="py-2 px-4 text-gray-800">
    `;

    if (transaction.type === 0) {
      sas += "Top Up";
    } else if (transaction.type === 1 || transaction.type === -1) {
      sas += "Online";
    } else {
      sas += "Offline";
    }

    sas += `
        </td>
      </tr>
      <tr>
        <th class="py-2 px-4 text-gray-600 font-semibold">Date-Time</th>
        <th class="py-2 px-4 text-gray-600 font-semibold">:</th>
        <td class="py-2 px-4 text-gray-800">${transaction.time}</td>
      </tr>
      </table>
    `;

    transactionDiv.innerHTML = sas;
    div.appendChild(transactionDiv);
  });
};

initializeTransactions();

export { loadTransactions, addTransaction, renderTransactions };
