import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';

function App() {
  const { user, signOut } = useAuthenticator();
  const [message, setMessage] = useState('');

  const apiUrl = 'https://nkxcgcfsj6.execute-api.ap-south-1.amazonaws.com/P2/Production_Uploadlink'; // Replace with your actual URL

  const handleSubmit = async () => {
    if (!user?.signInDetails?.loginId) {
      setMessage("User not signed in.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: user.signInDetails.loginId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Details sent successfully.");
      } else {
        const errorText = await response.text();
        setMessage(`Failed to send: ${errorText}`);
      }
    } catch (error) {
      console.error("Error sending to Lambda:", error);
      setMessage("An error occurred while sending data.");
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <button onClick={signOut}>Sign out</button>
      <h1>Welcome, {user?.signInDetails?.loginId}</h1>

      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
    </main>
  );
}

export default App;
