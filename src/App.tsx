import React from 'react';

import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {Footer} from "./layouts/NavbarAndFooter/Footer";
import {HomePage} from "./layouts/HomePage/HomePage";
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Auth } from './Auth/Auth';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import {useEffect} from "react";
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookcheckoutPage';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage';
import { setUserName } from './features/nameSlice';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';

export const App=()=> {
 
 const userName = localStorage.getItem("userName")||"";
 const dispath = useDispatch();

  useEffect(()=>{
    if(userName !== null ){
       dispath(setUserName(userName));
    }
  }, []);
  
  return (
      <div className='d-flex flex-column min-vh-100'>
       
          <Navbar/>
          <div className='flex-grow-1'>
            <ToastContainer/>
          <Switch>
            <Route path="/" exact>
              <Redirect to='/home' />
            </Route>
            
            <Route path="/home" exact>
              <HomePage/>
            </Route>

            <Route path="/search">
              <SearchBookPage/>
            </Route>

            <Route path="/login">
                <Auth/>
            </Route>
            <Route path="/checkout/:bookId">
                <BookCheckoutPage/>
            </Route>

            <Route path="/reviewlist/:bookId">
                <ReviewListPage/>
            </Route>
            <Route path='/shelf'>
                <ShelfPage/>
            </Route>
          </Switch>
          </div>
         <Footer/>
   
      </div>
  );
}


