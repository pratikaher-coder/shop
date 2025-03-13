document.addEventListener("DOMContentLoaded", function () {
  // Daily Summary Modal
  const dailySummaryModal = document.getElementById("dailySummaryModal");
  const openDailySummary = document.getElementById("openDailySummary");
  const closeDailySummary = document.getElementById("closeDailySummary");

  openDailySummary.addEventListener("click", () => {
    dailySummaryModal.style.display = "block";
  });
  closeDailySummary.addEventListener("click", () => {
    dailySummaryModal.style.display = "none";
  });

  // Bills Modal
  const billsModal = document.getElementById("billsModal");
  const openBills = document.getElementById("openBills");
  const closeBills = document.getElementById("closeBills");
  const billForm = document.getElementById("billForm");
  const billResult = document.getElementById("billResult");

  openBills.addEventListener("click", () => {
    billsModal.style.display = "block";
  });
  closeBills.addEventListener("click", () => {
    billsModal.style.display = "none";
  });

  billForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const customerName = document.getElementById("customerName").value;
    const billItems = document.getElementById("billItems").value;
    const totalAmount = document.getElementById("totalAmount").value;
    billResult.innerHTML = `<p>Bill for <strong>${customerName}</strong> generated. Items: ${billItems}. Total: $${totalAmount}</p>`;
    billForm.reset();
  });

  // Calculator Modal
  const calculatorModal = document.getElementById("calculatorModal");
  const openCalculator = document.getElementById("openCalculator");
  const closeCalculator = document.getElementById("closeCalculator");
  const calcDisplay = document.getElementById("calcDisplay");
  const calcButtons = document.querySelectorAll(".calc-btn");
  const calcClear = document.getElementById("calcClear");
  const calcEqual = document.getElementById("calcEqual");

  openCalculator.addEventListener("click", () => {
    calculatorModal.style.display = "block";
  });
  closeCalculator.addEventListener("click", () => {
    calculatorModal.style.display = "none";
  });

  calcButtons.forEach(button => {
    button.addEventListener("click", () => {
      calcDisplay.value += button.getAttribute("data-value");
    });
  });

  calcClear.addEventListener("click", () => {
    calcDisplay.value = "";
  });

  calcEqual.addEventListener("click", () => {
    try {
      calcDisplay.value = eval(calcDisplay.value);
    } catch (error) {
      calcDisplay.value = "Error";
    }
  });

  // Inventory Search
  const searchInput = document.getElementById("searchInput");
  const inventoryTable = document.getElementById("inventoryTable").getElementsByTagName("tbody")[0];

  searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();
    const rows = inventoryTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const itemName = rows[i].getElementsByTagName("td")[0].textContent.toLowerCase();
      rows[i].style.display = itemName.indexOf(filter) > -1 ? "" : "none";
    }
  });

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === dailySummaryModal) {
      dailySummaryModal.style.display = "none";
    } else if (e.target === billsModal) {
      billsModal.style.display = "none";
    } else if (e.target === calculatorModal) {
      calculatorModal.style.display = "none";
    }
  });
});
