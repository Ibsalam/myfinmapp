import React from 'react';
import "./styles.css";
function Header() {
    function logOutFunction() {
        alert("Logged Out")
    }

    return <div className="navbar">
        <p className="logo">MyfinmApp</p>
        <p className="logo link" onClick={logOutFunction}>Logout</p>
    </div>;
}

export default Header;