// public/script.js

// Replace with your Vercel deployment URL
const API_BASE = 'https://database-example-rho.vercel.app/';

document.addEventListener('DOMContentLoaded', function() {
  const salesList = document.getElementById('sales');
  const refreshBtn = document.getElementById('refresh');
  const userSelect = document.getElementById('user-select');
  const saleAmountInput = document.getElementById('sale-amount');
  const addSaleBtn = document.getElementById('add-sale');

  async function fetchSales() {
    try {
      const res = await fetch(`${API_BASE}/api/sales`);
      const sales = await res.json();
      salesList.innerHTML = '';
      sales.forEach(sale => {
        const li = document.createElement('li');
        li.textContent = `${sale._id}: $${sale.totalSaleAmount.toFixed(2)}`;
        salesList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  }

  async function fetchUsers() {
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const users = await res.json();
      userSelect.innerHTML = '<option value="">Select User</option>';
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  addSaleBtn.addEventListener('click', async () => {
    const user = userSelect.value;
    const saleAmount = saleAmountInput.value;
    if (!user || !saleAmount) {
      alert('Please select a user and enter a sale amount.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, saleAmount })
      });
      if (res.ok) {
        saleAmountInput.value = '';
        await fetchSales();
        await fetchUsers();
      } else {
        const error = await res.json();
        alert('Error adding sale: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  });

  refreshBtn.addEventListener('click', async () => {
    await fetchSales();
    await fetchUsers();
  });

  fetchSales();
  fetchUsers();
});