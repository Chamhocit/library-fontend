import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {useEffect, useState} from "react";
import { logout, selectAuth, setUser } from "../../features/authSlice";
import { toast } from "react-toastify";
import { useLogoutUserMutation } from "../../services/authApi";

export const Navbar=()=>{
   
    const [showName, setShowName] = useState(false);
    const {name, token} = useAppSelector(selectAuth);
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [logoutUser, {
        isSuccess: isLogoutSuccess,
    }] = useLogoutUserMutation();
    useEffect(()=>{
        if(isLogoutSuccess){
            console.log(isLogoutSuccess);
            dispatch(logout());
            toast.success("User Logout Successfully");
            history.push("/home");
        }
        if(name){
            setShowName(true);
        }else{
            setShowName(false);
        }
    }, [name, isLogoutSuccess]);

    const handleLogout =  async() => {
        if(token){
          await logoutUser(token); 
        }
    };
   

    return(
        <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
            <div className="container-fluid">
                <span className="navbar-brand">Luv 2 Read</span>
                <button className="navbar-toggler" type="button"
                        data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle Navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/home">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/search">Search Books</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {showName ? (
                            <>
                             <span className="navbar-brand">Welcome {name}</span>
                            <li className="nav-item m-1">
                                <button onClick={()=>handleLogout()} type="button" className="btn btn-outline-light" >LogOut</button>
                            </li>
                            </>
                        ) : (
                             <li className="nav-item m-1">
                                <Link type="button" className="btn btn-outline-light" to="/login">Sign in</Link>
                            </li>
                        )}
                      
                    </ul>
                </div>
            </div>
        </nav>
    );
}