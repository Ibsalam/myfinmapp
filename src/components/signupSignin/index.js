import React, { useState } from "react";
import "./styles.css";
import Input from '../Header/Input';
import Button from "../Button";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignupSigninComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Correctly call the useNavigate hook
    const provider = new GoogleAuthProvider();

    function signupWithEmail() {
        setLoading(true);
        // Authenticate or create a new account using email and password
        if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
            if (password === confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        toast.success("Account created successfully!");
                        setLoading(false);
                        setName("");
                        setPassword("");
                        setEmail("");
                        setConfirmPassword("");
                        createDoc(user); // Create a user doc in Firestore
                        navigate("/dashboard"); // Navigate to dashboard
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        toast.error(errorMessage);
                        setLoading(false);
                    });
            } else {
                toast.error("Passwords do not match!");
                setLoading(false);
            }
        } else {
            toast.error("All fields are required!");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        setLoading(true);
        if (!user) {
            console.log("No user provided to createDoc");
            return;
        }
    
        const userRef = doc(db, "users", user.uid);
        try {
            const userData = await getDoc(userRef);
            if (!userData.exists()) {
                await setDoc(userRef, {
                    name: user.displayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                console.log("Document created successfully for user:", user.uid);
                toast.success("New Doc Created!");
                setLoading(false);
            } else {
                console.log("Document already exists for user:", user.uid);
                // toast.error("Doc already exists!");
                setLoading(false);
            }
        } catch (e) {
            console.error("Error creating document:", e);
            toast.error(e.message);
            setLoading(false);
        }
    }
    

    function loginUsingEmail() {
        console.log("Email", email);
        console.log("password", password);
        setLoading(true);
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    toast.success("Logged in Successfully!");
                    console.log("Logged in Successfully!");
                    setLoading(false);
                    navigate("/dashboard"); // Navigate to dashboard after successful login
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    setLoading(false);
                    toast.error(errorMessage);
                });
        } else {
            toast.error("All fields are required!");
            setLoading(false);
        }
    }

        function googleAuth() {
            setLoading(true);
            try {
                signInWithPopup(auth, provider)
                .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("user>>>", user);
                createDoc(user);
                setLoading(false);
                navigate("/dashboard");
                toast.success("User Authenticated");
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                setLoading(false);
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                // The email of the user's account used.
                const email = error.customData.email;
            });
            } catch (e) {
                setLoading(false);
                toast.error(e.message);
            }
            
        }
    return (
        <>
            {loginForm ? (
                <div className="signup-wrapper">
                    <h2 className="title">
                        Login to <span style={{ color: "var(--theme)" }}>MyfinmAPP</span>
                    </h2>
                    <form>
                        <Input
                            type="email"
                            label="Email"
                            state={email}
                            setState={setEmail}
                            placeholder="example@example.com"
                        />
                        <Input
                            type="password"
                            label="Password"
                            state={password}
                            setState={setPassword}
                            placeholder="********"
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Login Using Email and Password"}
                            onClick={loginUsingEmail}
                        />
                        <p style={{ textAlign: "center", margin: 0 }}>Or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Login Using Google"}
                            blue={true} />
                        <p
                            className="p-login"
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}>
                            Don't Have an Account? Click Here
                        </p>
                    </form>
                </div>
            ) : (
                <div className="signup-wrapper">
                    <h2 className="title">
                        Sign Up to <span style={{ color: "var(--theme)" }}>MyfinmAPP</span>
                    </h2>
                    <form>
                        <Input
                            label="Full Name"
                            state={name}
                            setState={setName}
                            placeholder="John Doe"
                        />
                        <Input
                            type="email"
                            label="Email"
                            state={email}
                            setState={setEmail}
                            placeholder="example@example.com"
                        />
                        <Input
                            type="password"
                            label="Password"
                            state={password}
                            setState={setPassword}
                            placeholder="********"
                        />
                        <Input
                            type="password"
                            label="Confirm Password"
                            state={confirmPassword}
                            setState={setConfirmPassword}
                            placeholder="********"
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading..." : "Signup Using Email and Password"}
                            onClick={signupWithEmail}
                        />
                        <p style={{ textAlign: "center", margin: 0 }}>Or</p>
                        <Button
                            onClick={googleAuth}
                            text={loading ? "Loading..." : "Signup Using Google"} blue={true} />
                        <p
                            className="p-login"
                            style={{ cursor: "pointer" }}
                            onClick={() => setLoginForm(!loginForm)}>
                            Already have an Account? Click Here
                        </p>
                    </form>
                </div>
            )}
        </>
    );
}

export default SignupSigninComponent;
