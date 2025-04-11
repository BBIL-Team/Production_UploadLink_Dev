import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main style={{ padding: '2rem' }}>
      <button onClick={signOut}>Sign out</button>
      <h1>Welcome, {user?.signInDetails?.loginId}</h1>
      <p>🎉 App successfully hosted. You can start building your features now.</p>
      <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
        Review next step of this tutorial
      </a>
    </main>
  );
}

export default App;
