import { useEffect, useState } from "react";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [hasCustomer, setHasCustomer] = useState(false);
  const [accountTypes, setAccountTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [nationalNumber, setNationalNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      setError("User not authenticated.");
      setIsLoading(false);
      return;
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch account types
      const accountTypesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/account-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (accountTypesRes.ok) {
        const accountTypesData = await accountTypesRes.json();
        setAccountTypes(accountTypesData);
      }

      // Check customer status
      const customerRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const customerData = await customerRes.json();
      setHasCustomer(customerData.hasCustomer);

      if (customerData.hasCustomer) {
        // Fetch accounts
        const accountsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/accounts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const accountsData = await accountsRes.json();

        if (accountsData.accounts.length > 0) {
          const firstAccount = accountsData.accounts[0];
          setAccount(firstAccount);

          // Fetch transactions
          const txRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/accounts/${firstAccount.id}/transactions`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const txData = await txRes.json();
          setTransactions(txData.transactions || []);
        } else {
          setError("No accounts found for this user.");
        }
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAsCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/accounts/create`, {
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
      });

      if (response.ok) {
        alert("Account created successfully! Welcome to SecureBank.");
        await loadDashboardData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Something went wrong!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white text-opacity-80">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="fade-in">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Welcome to SecureBank
          </h1>
          <p className="text-white text-opacity-80">Manage your finances with confidence</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {!hasCustomer ? (
          /* Account Registration Form */
          <div className="banking-card p-8 fade-in hover-lift">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
              <p className="text-gray-600">Set up your banking account to get started</p>
            </div>

            <form onSubmit={handleRegisterAsCustomer} className="max-w-2xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National Number
                  </label>
                  <input
                    type="text"
                    value={nationalNumber}
                    onChange={(e) => setNationalNumber(e.target.value)}
                    className="form-input"
                    placeholder="Enter your national ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="form-input"
                    placeholder="Your nationality"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    value={selectedAccountType}
                    onChange={(e) => setSelectedAccountType(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Choose account type</option>
                    {accountTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center pt-4">
                <button type="submit" className="btn-primary px-8 py-3">
                  Create My Account
                </button>
              </div>
            </form>
          </div>
        ) : account ? (
          /* Account Dashboard */
          <>
            {/* Account Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6 fade-in">
              <div className="banking-card p-6 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Account Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${account.balance?.toLocaleString() || '0.00'}
                    </p>
                    <p className="text-sm text-gray-500">{account.currency || 'USD'}</p>
                  </div>
                  <div className="bg-bank-gradient p-3 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="banking-card p-6 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Account Number</p>
                    <p className="text-xl font-bold text-gray-900 font-mono">
                      {account.account_number}
                    </p>
                    <p className="text-sm text-gray-500">Secure Account</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="banking-card p-6 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Account Type</p>
                    <p className="text-xl font-bold text-gray-900">
                      {account.account_type_id || 'Standard'}
                    </p>
                    <p className="text-sm text-gray-500">Member since {new Date(account.created_at).getFullYear()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="banking-card p-6 fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                <button className="btn-secondary">
                  View All
                </button>
              </div>

              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.transaction_id} className="flex items-center justify-between p-4 bg-gray-50 bg-opacity-50 rounded-xl hover:bg-gray-100 hover:bg-opacity-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-xl ${
                          tx.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <svg className={`w-4 h-4 ${
                            tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {tx.type === 'deposit' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7m6 4V4m0 0L9 8m4-4l4 4" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.transaction_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Account Found</h3>
            <p className="text-white text-opacity-60">Please contact support if you believe this is an error.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;