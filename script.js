// Local Storage Keys
const STORAGE_KEY = "myShopAppData";

// Load data from local storage
let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  users: [],
  currentUser: null,
  shops: [],
  shopState: "closed", // "open" or "closed"
  daysOpen: 0,
  salesHistory: [],
  dailyTips: [
    "Track your expenses daily to avoid overspending.",
    "Keep your stock organized for better management.",
    "Offer discounts to attract more customers.",
    "Regularly update your inventory to avoid stockouts.",
  ],
};

// Save data to local storage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// DOM Elements
const authPage = document.getElementById("auth-page");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const shopSetupPage = document.getElementById("shop-setup-page");
const dashboard = document.getElementById("dashboard");
const shopNameDisplay = document.getElementById("shop-name-display");
const openShopBtn = document.getElementById("open-shop");
const closeShopBtn = document.getElementById("close-shop");
const addItemBtn = document.getElementById("add-item");
const dailyExpensesInput = document.getElementById("daily-expenses");
const addExpensesBtn = document.getElementById("add-expenses");
const totalSalesDisplay = document.getElementById("total-sales");
const totalExpensesDisplay = document.getElementById("total-expenses");
const profitLossDisplay = document.getElementById("profit-loss");
const daysOpenDisplay = document.getElementById("days-open");
const salesHistoryList = document.getElementById("sales-history");
const dailyTipDisplay = document.getElementById("daily-tip");

// Show Signup Form
document.getElementById("show-signup").addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

// Show Login Form
document.getElementById("show-login").addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

// Signup
document.getElementById("signup-btn").addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  // Check if user already exists
  const userExists = appData.users.some((user) => user.email === email);
  if (userExists) {
    alert("User already exists. Please log in.");
    return;
  }

  // Add new user
  appData.users.push({ email, password });
  appData.currentUser = email;
  saveData();

  authPage.style.display = "none";
  shopSetupPage.style.display = "block";
});

// Login
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Check if user exists
  const user = appData.users.find((user) => user.email === email && user.password === password);
  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  appData.currentUser = email;
  saveData();

  authPage.style.display = "none";
  shopSetupPage.style.display = "block";
});

// Save Shop Name
document.getElementById("save-shop-name").addEventListener("click", () => {
  const shopName = document.getElementById("shop-name").value;

  // Save shop name
  appData.shops.push({ email: appData.currentUser, shopName, stock: [], expenses: [], sales: [] });
  saveData();

  shopSetupPage.style.display = "none";
  dashboard.style.display = "block";
  shopNameDisplay.textContent = shopName;
  updateShopState();
  showDailyTip();
});

// Add Item to Stock
addItemBtn.addEventListener("click", () => {
  if (appData.shopState !== "open") {
    alert("Please open the shop first.");
    return;
  }

  const itemName = document.getElementById("item-name").value;
  const itemQuantity = parseInt(document.getElementById("item-quantity").value);
  const itemPrice = parseFloat(document.getElementById("item-price").value);

  if (!itemName || isNaN(itemQuantity) || isNaN(itemPrice)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Add item to stock
  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  shop.stock.push({ itemName, itemQuantity, itemPrice });
  saveData();

  // Clear input boxes
  document.getElementById("item-name").value = "";
  document.getElementById("item-quantity").value = "";
  document.getElementById("item-price").value = "";

  // Update stock list
  updateStockList();
});

// Update Stock List
function updateStockList() {
  const stockList = document.getElementById("stock-list");
  stockList.innerHTML = "";

  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  if (shop.stock) {
    shop.stock.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.itemName} - Quantity: <span class="${item.itemQuantity < 5 ? "low-stock" : ""}">${item.itemQuantity}</span> - Price: ${item.itemPrice}
        <button onclick="increaseQuantity(${index})">+</button>
        <button onclick="decreaseQuantity(${index})">-</button>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      `;
      stockList.appendChild(li);
    });
  }
}

// Increase Quantity
function increaseQuantity(index) {
  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  shop.stock[index].itemQuantity += 1;
  saveData();
  updateStockList();
}

// Decrease Quantity
function decreaseQuantity(index) {
  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  if (shop.stock[index].itemQuantity > 0) {
    shop.stock[index].itemQuantity -= 1;
    saveData();
    updateStockList();
  }
}

// Edit Item
function editItem(index) {
  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  const item = shop.stock[index];

  const newName = prompt("Enter new item name:", item.itemName);
  const newQuantity = prompt("Enter new quantity:", item.itemQuantity);
  const newPrice = prompt("Enter new price:", item.itemPrice);

  if (newName && newQuantity && newPrice) {
    item.itemName = newName;
    item.itemQuantity = parseInt(newQuantity);
    item.itemPrice = parseFloat(newPrice);
    saveData();
    updateStockList();
  }
}

// Delete Item
function deleteItem(index) {
  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  shop.stock.splice(index, 1);
  saveData();
  updateStockList();
}

// Add Daily Expenses
addExpensesBtn.addEventListener("click", () => {
  if (appData.shopState !== "open") {
    alert("Please open the shop first.");
    return;
  }

  const expenses = parseFloat(dailyExpensesInput.value);
  if (isNaN(expenses)) {
    alert("Please enter a valid amount.");
    return;
  }

  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  shop.expenses.push(expenses);
  saveData();

  // Clear input box
  dailyExpensesInput.value = "";

  // Update summary
  updateSummary();
});

// Update Summary
function updateSummary() {
  const shop = appData.shops.find((shop) => shop.email === appData.currentUser);
  const totalSales = shop.stock.reduce((sum, item) => sum + item.itemQuantity * item.itemPrice, 0);
  const totalExpenses = shop.expenses.reduce((sum, expense) => sum + expense, 0);
  const profitLoss = totalSales - totalExpenses;

  totalSalesDisplay.textContent = totalSales.toFixed(2);
  totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
  profitLossDisplay.textContent = profitLoss.toFixed(2);

  // Add to sales history
  const today = new Date().toLocaleDateString();
  appData.salesHistory.push({ date: today, totalSales, totalExpenses, profitLoss });
  saveData();
  updateSalesHistory();
}

// Update Sales History
function updateSalesHistory() {
  salesHistoryList.innerHTML = "";
  appData.salesHistory.forEach((sale) => {
    const li = document.createElement("li");
    li.textContent = `Date: ${sale.date} - Sales: ${sale.totalSales.toFixed(2)} - Expenses: ${sale.totalExpenses.toFixed(2)} - Profit/Loss: ${sale.profitLoss.toFixed(2)}`;
    salesHistoryList.appendChild(li);
  });
}
