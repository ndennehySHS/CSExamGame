document.addEventListener('DOMContentLoaded', function() {
    const salesList = document.getElementById('sales');
    const refreshBtn = document.getElementById('refresh');
    const userSelect = document.getElementById('user-select');
    const saleAmountInput = document.getElementById('sale-amount');
    const addSaleBtn = document.getElementById('add-sale');
  
    // Fetch and display aggregated sales data
    async function fetchSales() {
      try {
        const res = await fetch('/sales');
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
  
    // Fetch and populate the user dropdown
    async function fetchUsers() {
      try {
        const res = await fetch('/users');
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
  
    // Add a new sale
    addSaleBtn.addEventListener('click', async () => {
      const user = userSelect.value;
      const saleAmount = saleAmountInput.value;
      if (!user || !saleAmount) {
        alert('Please select a user and enter a sale amount.');
        return;
      }
      try {
        const res = await fetch('/sale', {
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
  
    // Refresh button click handler
    refreshBtn.addEventListener('click', async () => {
      await fetchSales();
      await fetchUsers();
    });
  
    // Initial fetch on page load
    fetchSales();
    fetchUsers();
  });