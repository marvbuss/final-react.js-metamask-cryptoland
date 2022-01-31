import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <>
            <nav className="navbar-container">
                <NavLink to="/" className="navbar-link">
                    <img src="/images/ethereum-colored.svg" alt="logo" />
                </NavLink>
                <div className="navbar-menu">
                    <NavLink to="/market" className="navbar-link">
                        Market
                    </NavLink>
                    <NavLink to="/nfts" className="navbar-link">
                        NFTs
                    </NavLink>
                    <NavLink to="/wallets" className="navbar-link">
                        Wallets
                    </NavLink>
                </div>
                <button className="navbar-btn">
                    <NavLink to="/login" className="navbar-btn-link">
                        Login
                    </NavLink>
                </button>
            </nav>
        </>
    );
}

export default Navbar;
