import React, { useState } from "react";
import "./App.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

const App: React.FC = () => {
  const { user, signOut } = useAuthenticator();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Replace with your actual API Gateway endpoint
  const API_ENDPOINT = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/send-email";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Get the user's email from Cognito attributes
    const email = user?.attributes?.email || user?.signInDetails?.loginId;

    if (!email) {
      setMessage("Error: No email found for the authenticated user.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(`Success: ${result.message || "Email sent to Lambda!"}`);
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage(`Error: ${error.message || "Failed to send email."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Send Email to Lambda</h2>
      {user ? (
        <>
          <p>Logged in as: {user.attributes?.email || user.signInDetails?.loginId}</p>
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: isLoading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Sending..." : "Send My Email"}
            </button>
          </form>
          <button
            onClick={signOut}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <p>Please sign in to send your email.</p>
      )}
      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.startsWith("Error") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default App;
