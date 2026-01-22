import { useState } from 'react';

function TransactionPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTransactionResult(null);

const endpoint = `${import.meta.env.VITE_API_BASE_URL}/transactions/${type === 'deposit' ? 'deposit-by-number' : 'withdraw-by-number'}`;

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
        setTransactionResult({
          success: true,
          message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`,
          transactionId: data.transaction_id,
          amount: parseFloat(amount),
          type: type
        });

        // Clear form
        setAccountNumber('');
        setAmount('');
      } else {
        setTransactionResult({
          success: false,
          message: data.error || 'Transaction failed'
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setTransactionResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Transaction Center
          </h1>
          <p className="text-white text-opacity-80">Manage your account transactions securely</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <div className="banking-card p-8 hover-lift fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-bank-gradient rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">New Transaction</h2>
              <p className="text-gray-600">Deposit or withdraw funds from your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('deposit')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      type === 'deposit'
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span className="font-medium">Deposit</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('withdraw')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      type === 'withdraw'
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7m6 4V4m0 0L9 8m4-4l4 4" />
                      </svg>
                      <span className="font-medium">Withdraw</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    className="form-input pl-8"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !accountNumber || !amount}
                className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Execute Transaction
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Transaction Result / Info */}
          <div className="space-y-6">
            {/* Result Display */}
            {transactionResult && (
              <div className={`banking-card p-6 fade-in ${
                transactionResult.success ? 'border-green-200 bg-green-50 bg-opacity-50' : 'border-red-200 bg-red-50 bg-opacity-50'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-xl ${
                    transactionResult.success ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      transactionResult.success ? 'text-green-600' : 'text-red-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {transactionResult.success ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      transactionResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {transactionResult.success ? 'Transaction Successful' : 'Transaction Failed'}
                    </h3>
                    <p className={`text-sm ${
                      transactionResult.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transactionResult.message}
                    </p>
                  </div>
                </div>

                {transactionResult.success && (
                  <div className="bg-white bg-opacity-60 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Transaction ID</p>
                        <p className="font-mono font-medium">{transactionResult.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className={`font-bold ${
                          transactionResult.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transactionResult.type === 'deposit' ? '+' : '-'}${transactionResult.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="banking-card p-6 hover-lift fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-start p-4">
                  <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Transaction History
                </button>
                <button className="w-full btn-secondary flex items-center justify-start p-4">
                  <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Transfer to Another Account
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Security Notice</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All transactions are processed securely with 256-bit encryption. Your financial data is protected at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
