import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";

const App = () => {
  const isAdmin = window.location.pathname.startsWith("/admin");
  return isAdmin ? <Admin /> : <Home />;
};

export default App;
