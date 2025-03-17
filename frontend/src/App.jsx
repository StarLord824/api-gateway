import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import Users from "./Users";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:6000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <ApolloProvider client={client}>
      <Router>
        <nav className="p-4 bg-gray-800 text-white">
          <Link className="mr-4" to="/">Login</Link>
          <Link to="/users">Users</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/users" element={token ? <Users /> : <p>Please log in</p>} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
