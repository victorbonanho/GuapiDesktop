import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import RegisterProduct from "./pages/RegisterProduct";
import Configuration from "./pages/Configuration";
import Header from "./components/Header";
import Stock from "./pages/Stock";
import SubHeader from "./components/SubHeader";
import { FiHome } from "react-icons/fi";
import { RiBookletLine } from "react-icons/ri";
import { FiArchive } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import EditProduct from "./pages/EditProduct";

function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex bg-lightBackground dark:bg-darkBackground">
      <div className="sticky top-0 h-screen">
        <Header />
      </div>
      <div className="w-full">
        <SubHeader
          title={
            currentPath === "/"
              ? "Home"
              : currentPath === "/produtos"
              ? "Produtos"
              : currentPath === "/estoque"
              ? "Estoque"
              : currentPath === "/configuracao"
              ? "Configuração"
              : currentPath.includes("/editar")
              ? "Produtos"
              : currentPath === "/cadastrar"
              ? "Produtos"
              : ""
          }
          Icon={
            currentPath === "/"
              ? FiHome
              : currentPath === "/produtos"
              ? RiBookletLine
              : currentPath === "/estoque"
              ? FiArchive
              : currentPath === "/configuracao"
              ? GoGear
              : currentPath.includes("/cadastrar")
              ? RiBookletLine
              : currentPath === "/cadastrar"
              ? RiBookletLine
              : GoGear
          }
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/estoque" element={<Stock />} />
          <Route path="/cadastrar" element={<RegisterProduct />} />
          <Route path="/editar/:id" element={<EditProduct />} />
          <Route path="/configuracao" element={<Configuration />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-lightBackground dark:bg-darkBackground h-screen w-full">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
