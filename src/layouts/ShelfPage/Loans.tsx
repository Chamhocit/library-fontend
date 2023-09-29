import { useEffect, useState } from "react"
import ShelfCurrentLoans from "../../models/ShelfCurrentLoans";
import api from "../../models/api";
import { Link } from "react-router-dom";
import { SpinerLoading } from "../Untils/SpinerLoading";
import { LoansModal } from "./LoansModal";


export const Loans = () => {
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);



    useEffect(() => {
        api.get('https://localhost:8443/api/books/secure/currentloans')
            .then(response => {

                setShelfCurrentLoans(response.data);
                setIsLoadingUserLoans(false);

            }).catch(error => {

                setIsLoadingUserLoans(false);
                setHttpError(error.response.data.error);
                console.log(error);
            });
        window.scrollTo(0, 0);
    }, [checkout]);

    async function returnBook(bookId: number) {
        const url = `https://localhost:8443/api/books/secure/return?bookId=${bookId}`;
        api.put(url).then(response => {
            setCheckout(true);
            console.log(checkout);
        }).catch(error => {
            setHttpError(error.response.data.error);
        });
    }

    async function renewLoan(bookId: number) {
        const url = `https://localhost:8443/api/books/secure/renew/loan?bookId=${bookId}`;
        api.put(url).then(response => {
            setCheckout(true);
            console.log(checkout);
        }).catch(error => {
            setHttpError(error.response.data.error);
        });
    }

    if (isLoadingUserLoans) {
        return (
            <SpinerLoading />
        );
    };
    if (httpError) {
        return (
            <div className="container m-5">{httpError}</div>
        );
    };

    return (
        <div>
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5>Current Loans</h5>
                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {shelfCurrentLoan.book?.img ?
                                            <img src={shelfCurrentLoan.book?.img} width="226" height="349" alt="Book" />
                                            :
                                            <img src={require('./../../image/image-book/new-book-1.jpg')} width="226" height="349" alt="Book" />
                                        }
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {shelfCurrentLoan.daysLeft > 0 &&
                                                    <p className="text-secondary">
                                                        Due in {shelfCurrentLoan.daysLeft} days.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft === 0 &&
                                                    <p className="text-success">
                                                        Due Today.
                                                    </p>
                                                }
                                                {shelfCurrentLoan.daysLeft < 0 &&
                                                    <p className="text-danger">
                                                        Past due by {shelfCurrentLoan.daysLeft} days.
                                                    </p>
                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action"
                                                        aria-current="true" data-bs-toggle="modal"
                                                        data-bs-target={`#modal${shelfCurrentLoan.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={'search'} className="list-group-item list-group-item-action">
                                                        Search more book?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help other find their adventure by reviewing your loan.
                                            </p>
                                            <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                                Leave a review
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal renewLoan={renewLoan} returnBook={returnBook} shelfCurrentLoan={shelfCurrentLoan} mobile={false} />
                            </div>
                        ))}
                    </> :
                    <>
                        <h3 className="mt-3">
                            Currently no loans
                        </h3>
                        <Link className="btn btn-primary" to={'/search'}>
                            Search for a new book
                        </Link>
                    </>
                }
            </div>

            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5 className="mb-3">Current Loans:</h5>
                        {shelfCurrentLoans.map(shelfCurrentLoan => (
                            <div key={shelfCurrentLoan.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {shelfCurrentLoan.book?.img ?
                                        <img src={shelfCurrentLoan.book?.img} width="226" height="349" alt="Book" />
                                        :
                                        <img src={require('./../../image/image-book/new-book-1.jpg')} width="226" height="349" alt="Book" />
                                    }
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {shelfCurrentLoan.daysLeft > 0 &&
                                                <p className="text-secondary">
                                                    Due in {shelfCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            {shelfCurrentLoan.daysLeft === 0 &&
                                                <p className="text-success">
                                                    Due Today.
                                                </p>
                                            }
                                            {shelfCurrentLoan.daysLeft < 0 &&
                                                <p className="text-danger">
                                                    Past due by {shelfCurrentLoan.daysLeft} days.
                                                </p>
                                            }
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action"
                                                    aria-current="true" data-bs-toggle="modal"
                                                    data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'search'} className="list-group-item list-group-item-action">
                                                    Search more book?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">
                                            Help other find their adventure by reviewing your loan.
                                        </p>
                                        <Link className="btn btn-primary" to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>

                                <hr />
                                <LoansModal renewLoan={renewLoan} returnBook={returnBook} shelfCurrentLoan={shelfCurrentLoan} mobile={true} />
                            </div>
                        ))}
                    </> :
                    <>
                        <h3 className="mt-3">
                            Currently no loans
                        </h3>
                        <Link className="btn btn-primary" to={'/search'}>
                            Search for a new book
                        </Link>
                    </>
                }
            </div>
        </div>
    );

}