import { Navbar, Welcome, Footer, Transfers, Seperator } from "./components";
import { BrowserRouter } from "react-router-dom";
import "./style.css";

function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Seperator />
            </BrowserRouter>
            <Welcome />
            <Transfers />
            <Seperator />
            <Footer />
        </>
    );
}

export default App;
