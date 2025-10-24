import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { app } from "../../config/firebase.init";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState("");

  const auth = getAuth(app);

  // Sign up new user
  const signUp = async (email, password) => {
    try {
      setLoader(true);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // login user
  const login = async (email, password) => {
    try {
      setLoader(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message); // Lấy message thay vì set cả object
      throw error;
    } finally {
      setLoader(false);
    }
  };

  //logout user
  const logOut = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  //Update User Profile
  const updateUser = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setUser(auth.currentUser);
    } catch (error) {
      setError(error);
      throw error;
    }
  };

  // google login
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      setLoader(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  // observer for user
  // useEffect(() => {
  //   const unSubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user);
  //     if (user) {
  //       axios
  //         .post("http://localhost:3000/api/set-token", {
  //           email: user.email,
  //           name: user.displayName,
  //         })
  //         .then((data) => {
  //           if (data.data) {
  //             localStorage.setItem("token", data.data);
  //             setLoader(false);
  //           }
  //         });
  //     } else {
  //       localStorage.removeItem("token");
  //       setLoader(false);
  //     }
  //   });
  //   return () => unSubscribe();
  // }, []);

  // useEffect(() => {
  //   const unSubscribe = onAuthStateChanged(auth, (user) => {
  //     setUser(user); // Cập nhật user ngay khi trạng thái thay đổi
  //     console.log("User from Firebase:", user); // In ra để kiểm tra

  //     if (user) {
  //       axios
  //         .post("http://localhost:3000/api/set-token", {
  //           email: user.email,
  //           name: user.displayName,
  //         })
  //         .then((data) => {
  //           if (data.data) {
  //             localStorage.setItem("token", data.data);
  //           }
  //         })
  //         .catch((error) => console.error("Token Error:", error))
  //         .finally(() => setLoader(false)); // Đảm bảo loader tắt khi xong
  //     } else {
  //       localStorage.removeItem("token");
  //     }
  //     setLoader(false);
  //   });

  //   return () => unSubscribe();
  // }, []);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("User from Firebase:", user);
      setUser(user);
      if (user) {
        axios
          .post("https://backend-shoes-79qb.onrender.com/api/set-token", {
            email: user.email,
            name: user.displayName,
          })
          .then((data) => {
            if (data.data) {
              localStorage.setItem("token", data.data);
            }
          })
          .catch((error) => console.error("Token Error:", error))
          .finally(() => setLoader(false));
      } else {
        localStorage.removeItem("token");
      }
      setLoader(false);
    });

    return () => unSubscribe();
  }, []);

  const contextValue = {
    user,
    currentUser: user,
    signUp,
    login,
    logOut,
    updateUser,
    googleLogin,
    error,
    setError,
    loader,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
export { AuthContext };
export default AuthProvider;
