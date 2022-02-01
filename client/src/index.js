import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CryptolandProvider } from "./context/CryptolandContext";

ReactDOM.render(
    <CryptolandProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </CryptolandProvider>,
    document.getElementById("root")
);
