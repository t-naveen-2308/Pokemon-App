import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>PokéTeam Manager</h1>
            </div>
            <div className="navbar-links">
                <Link
                    to="/"
                    className={location.pathname === '/' ? 'active' : ''}
                >
                    Search
                </Link>
                <Link
                    to="/team"
                    className={location.pathname === '/team' ? 'active' : ''}
                >
                    My Team
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
