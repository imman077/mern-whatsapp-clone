import "./App.css";
import Login from "./components/Login/Login";
import { useStateValue } from "./components/ContentApi/StateProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  const [{ user }] = useStateValue();
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Chat />} />
              <Route path="/rooms/:roomId" element={<Chat />} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
