import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {useEffect, useState} from "react";
import { logout, selectAuth, setUser } from "../../features/authSlice";
import { toast } from "react-toastify";
import { useLogoutUserMutation } from "../../services/authApi";
import { removeUsername, selectAuthName } from "../../features/nameSlice";
import api from "../../models/api";
import axios from "axios";

export const Navbar=()=>{
   
    const [showName, setShowName] = useState(false);
    
    const {userName} = useAppSelector(selectAuthName);
    const dispath = useAppDispatch();
    const history = useHistory();
    useEffect(()=>{
        if(userName){
            setShowName(true);
        }else{
            setShowName(false);
        }
    }, [userName]);

    const handleLogout =  () => {
        api.post('http://localhost:8080/api/auth/logout')
        .then(response=>{
          dispath(removeUsername());
          history.push("/login");
          toast.success(response.data);
          console.log(response.data);
        }).catch(error=>{
           toast.error(error.response.data.error);
        });
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
                             <span className="navbar-brand">Welcome {userName}</span>
                            <li className="nav-item m-1">
                                <button onClick={()=>handleLogout()} type="button" className="btn btn-outline-light">LogOut</button>
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