import { Navbar, Welcome, Footer, Transactions } from "./components";
import { BrowserRouter, Route, Link } from "react-router-dom";
import "./style.css";

function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
            <Welcome />
            <Transactions />
            <Footer />
        </>
    );
}

export default App;
