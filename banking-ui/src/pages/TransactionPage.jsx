import { useState } from 'react';

function TransactionPage() {
const [accountNumber, setAccountNumber] = useState('');  // ← الآن نستخدم رقم الحساب
const [amount, setAmount] = useState('');
const [type, setType] = useState('deposit');

const handleSubmit = async (e) => {
e.preventDefault();

const endpoint = type === 'deposit'
  ? 'http://localhost:3001/transactions/deposit-by-number'
  : 'http://localhost:3001/transactions/withdraw-by-number';

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_number: accountNumber,
      amount: parseFloat(amount),
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert(`${type === 'deposit' ? 'Deposit' : 'Withdraw'} successful!`);
    console.log('Transaction ID:', data.transaction_id);
  } else {
    alert(data.error || 'Transaction failed');
  }
} catch (error) {
  console.error('Transaction error:', error);
  alert('Something went wrong!');
}


};

return ( <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center"> <form
     onSubmit={handleSubmit}
     className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
   > <h2 className="text-2xl font-bold mb-6 text-center">Deposit / Withdraw</h2>

    <div className="mb-4">
      <label className="block text-gray-700">Account Number</label>
      <input
        type="text"
        className="w-full mt-2 p-2 border rounded focus:outline-none"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700">Amount</label>
      <input
        type="number"
        className="w-full mt-2 p-2 border rounded focus:outline-none"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700">Transaction Type</label>
      <select
        className="w-full mt-2 p-2 border rounded focus:outline-none"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="deposit">Deposit</option>
        <option value="withdraw">Withdraw</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
    >
      Submit
    </button>
  </form>
</div>

);
}

export default TransactionPage;
