import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';

type Todo = {
  id: string;
  content: string;
};

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data: any) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  return (
    <main>
      <button onClick={signOut}>Sign out</button>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
