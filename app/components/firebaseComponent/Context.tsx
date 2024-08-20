"use client";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebaseConfig";
import { useRouter } from "next/navigation";

export const AuthContext: any = createContext(null);

const AuthState = ({ children }: any) => {
  const [registerFormData, setRegisterFormData]: any = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginFormData, setloginFormData] = useState({
    email: "",
    password: "",
  });
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const createUserDataInFirebase = async () => {
    const { email, password } = registerFormData;
    return createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/profile");
      })
      .catch((error) => {
        console.error("Registration Error: ", error);
      });
  };

  const loginUserDataInFirebase = async () => {
    const { email, password } = loginFormData;
    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/profile");
      })
      .catch((error) => {
        console.error("Login Error: ", error);
      });
  };

  const logOut = () => {
    signOut(auth);
    return router.push("/");
  };

  useEffect(() => {
    const checkAuthState = onAuthStateChanged(auth, (currentUser: any) => {
      setUsers(currentUser);
      setLoading(false);
    });
    return () => {
      checkAuthState();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        registerFormData,
        setRegisterFormData,
        loginFormData,
        setloginFormData,
        createUserDataInFirebase,
        loginUserDataInFirebase,
        users,
        loading,
        setLoading,
        logOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
