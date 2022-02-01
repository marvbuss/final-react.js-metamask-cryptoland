import { Navbar, Welcome, Footer, Transfers } from "./components";
import { BrowserRouter } from "react-router-dom";
import "./style.css";

function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
            <Welcome />
            <Transfers />
            <Footer />
        </>
    );
}

export default App;
