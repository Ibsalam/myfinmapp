import React, { useEffect } from 'react';
import "./styles.css";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { auth } from '../../firebase';
import { signOut } from "firebase/auth"; // Import signOut from Firebase auth
import { toast } from "react-toastify"; // Import toast for notifications

function Header() {

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading]);

    function logOutFunction() {
        try {
            signOut(auth)
            .then(() => {
                toast.success("Logged Out Successfully!");
                navigate("/");
            })
            .catch((error) => {
                toast.error(error.message);
            });
        } catch (e) {
            toast.error(e.message);
        }
    }
    
    return <div className="navbar">
        <p className="logo">MyfinmAPP</p>
        {user && (
            <p className="logo link" onClick={logOutFunction}>
                Logout
            </p>
        )}
        
    </div>;
}

export default Header;