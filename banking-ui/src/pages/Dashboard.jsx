import { useEffect, useState } from "react";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [hasCustomer, setHasCustomer] = useState(false);
  const [accountTypes, setAccountTypes] = useState([]);

  const [nationalNumber, setNationalNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      setError("User not authenticated.");
      return;
    }

    fetch(`http://localhost:3001/account-types`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch account types");
        }
        return res.json();
      })
      .then((data) => {
        setAccountTypes(data);
      })
      .catch((err) => {
        console.error("Error fetching account types:", err);
        setAccountTypes([]);
      });

    fetch(`http://localhost:3001/users/${userId}/customer`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to check customer status");
        }
        return res.json();
      })
      .then((data) => {
        setHasCustomer(data.hasCustomer);

        if (data.hasCustomer) {
          fetch(`http://localhost:3001/users/${userId}/accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(async (res) => {
              if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch user accounts");
              }
              return res.json();
            })
            .then((data) => {
              if (data.accounts.length > 0) {
                const firstAccount = data.accounts[0];
                setAccount(firstAccount);

                fetch(
                  `http://localhost:3001/accounts/${firstAccount.id}/transactions`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
                  .then(async (res) => {
                    if (!res.ok) {
                      const text = await res.text();
                      throw new Error(
                        text || "Failed to fetch transactions"
                      );
                    }
                    return res.json();
                  })
                  .then((txData) => setTransactions(txData.transactions))
                  .catch((err) => {
                    console.error("Error fetching transactions:", err);
                    setTransactions([]);
                  });
              } else {
                setError("No accounts found for this user.");
              }
            })
            .catch((err) => {
              console.error("Error fetching user accounts:", err);
              setError("Failed to load user accounts.");
            });
        }
      })
      .catch((err) => {
        console.error("Error checking customer status:", err);
        setError("Failed to check customer status.");
      });
  }, []);

  const handleRegisterAsCustomer = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/accounts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        national_number: nationalNumber,
        nationality: nationality,
        birth_date: birthDate,
        account_type_id: selectedAccountType,
        initial_balance: 0,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to register as customer");
        }
        return res.json();
      })
      .then(() => {
        alert("Registered as customer! Please reload the page.");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error registering as customer:", err);
        alert("Failed to register as customer.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {!hasCustomer ? (
        <div className="bg-yellow-100 p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-4">
            You are not registered as a customer
          </h2>
          <form
            onSubmit={handleRegisterAsCustomer}
            className="space-y-4 max-w-md mx-auto"
          >
            <div>
              <label className="block mb-1">National Number</label>
              <input
                type="text"
                value={nationalNumber}
                onChange={(e) => setNationalNumber(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Account Type</label>
              <select
                value={selectedAccountType}
                onChange={(e) => setSelectedAccountType(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Account Type</option>
                {accountTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Register as Customer
            </button>
          </form>
        </div>
      ) : account ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <p>
            <strong>Account Number:</strong> {account.account_number}
          </p>
          <p>
            <strong>Balance:</strong> {account.balance} {account.currency}
          </p>
          <p>
            <strong>Type:</strong> {account.account_type_id}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(account.created_at).toLocaleString()}
          </p>
        </div>
      ) : (
        !error && <p>Loading account...</p>
      )}

      {hasCustomer && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          {transactions.length > 0 ? (
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li
                  key={tx.transaction_id}
                  className="bg-gray-50 p-4 rounded shadow-sm"
                >
                  <p>
                    <strong>Type:</strong> {tx.type}
                  </p>
                  <p>
                    <strong>Amount:</strong> {tx.amount}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(tx.transaction_date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p>No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;