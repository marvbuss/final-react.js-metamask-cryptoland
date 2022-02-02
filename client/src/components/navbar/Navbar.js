import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <>
            <nav className="navbar-container">
                <NavLink to="/" className="navbar-link">
                    <img src="/images/ethereum-colored.svg" alt="logo" />
                </NavLink>
                <div className="navbar-menu">
                    <NavLink to="/community" className="navbar-link">
                        Community
                    </NavLink>
                    <NavLink to="/nft" className="navbar-link">
                        NFT
                    </NavLink>
                    <NavLink to="/roadmap" className="navbar-link">
                        Roadmap
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
