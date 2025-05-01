import { useEffect, useState } from "react";

function AccountPage() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3001/accounts/1', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Fetch failed');
        }
        return res.json();
      })
      .then(data => setAccount(data))
      .catch(err => {
        console.error('Error fetching:', err);
        setError('Failed to load account data.');
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!account) return <p>Loading...</p>;

  return (
    <div>
      <h1>Account Info</h1>
      <p>Account Number: {account.account_number}</p>
      <p>Balance: ${account.balance}</p>
    </div>
  );
}

export default AccountPage;
