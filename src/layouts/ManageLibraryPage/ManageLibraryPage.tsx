import { useEffect, useState } from "react"
import api from "../../models/api";
import { error } from "console";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AdminMessages } from "./AdminMessages";
import { AddNewBook } from "./component/AddNewBook";

export const ManageLibraryPage = () => {

    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messagesClick, setMessagesClick] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const histo = useHistory();
    const userEmail = Cookies.get("userName");
    useEffect(() => {
        if (userEmail) {
            api.get("http://localhost:8080/api/auth/getRole")
                .then(response => {
                    setIsAdmin(response.data);
                }).catch(error => {
                    console.log(error);
                })
        } else {
            histo.push("/login");
            toast.error("You need to login again to access the page.");
        }
    }, [userEmail]);

    function addBookClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(false);
    }

    function changeQuantityOfBooksClickFunction() {
        setChangeQuantityOfBooksClick(true);
        setMessagesClick(false);
    }

    function messagesClickFunction() {
        setChangeQuantityOfBooksClick(false);
        setMessagesClick(true);
    }



    return (
        isAdmin ?
            <div className="container">
                <div className="mt-5">
                    <h3>Manage Library</h3>
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                                aria-selected="false">
                                Add new book
                            </button>
                            <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-quantity"
                                aria-selected="true">
                                Change quantity
                            </button>
                            <button onClick={messagesClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                                aria-selected="true">
                                Messages
                            </button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                            aria-labelledby="nav-add-book-tab">
                            <AddNewBook/>
                        </div>
                        <div className="tab-pane fade" id="nav-quantity" role="tabpanel"
                            aria-labelledby="nav-quantity-tab">
                            {changeQuantityOfBooksClick ? <>Change Quantity</> : <></>}
                        </div>
                        <div className="tab-pane fade" id="nav-messages" role="tabpanel"
                            aria-labelledby="nav-messages-tab">
                            {messagesClick ? <AdminMessages/> : <></>}
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="container">
                <h2>Do not have permission to access this page</h2>
                <p>Sorry, you do not have permission to access this page. Please contact your system administrator if you need assistance.</p>
            </div>
    );
}