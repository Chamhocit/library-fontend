import { useEffect, useState } from "react";
import { useGetbooksQuery } from "../../services/bookApi";
import BookModel from "../../models/BookModel";

import { StarsReview } from "../Untils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LastestReview } from "./LastestReview";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectAuth } from "../../features/authSlice";
import { SpinerLoading } from "../Untils/SpinerLoading";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { error } from "console";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userToken = user.token;

    const bookIdString = (window.location.pathname).split('/')[2];
    const bookId = parseInt(bookIdString);



    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);
    const history = useHistory();
    const dispatch = useAppDispatch();

    // Is Book Check Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    const [book, setBook] = useState<BookModel>();
    const [httpError, setHttpError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    useEffect(() => {
        if (userToken) {
            //số lượng đang checkout
            const url = "http://localhost:8080/api/books/secure/currentloans/count";
            const requestOptions = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(url, requestOptions)
                .then(response => {
                    setCurrentLoansCount(response.data);
                    setIsLoadingCurrentLoansCount(false);
                })
                .catch(error => {
                    setIsLoadingCurrentLoansCount(false);
                    if (error.response && error.response.status === 401) {
                        history.push("/login");
                        dispatch(logout());
                        toast.error("Token has expired, you need to login again to access the page.");
                    } else if (error.response && error.response.data) {
                        setHttpError(error.response.data.error);
                    }
                });

            //check xem đã checkout
            const urlTwo = `http://localhost:8080/api/books/secure/ischeckout/byuser?bookId=${bookId}`;
            const requestOptionsTwo = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(urlTwo, requestOptionsTwo)
                .then(response => {
                    setIsCheckedOut(response.data);
                    setIsLoadingBookCheckedOut(false);
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        history.push("/login");
                        dispatch(logout());
                        toast.error("Token has expired, you need to login again to access the page.");
                    } else if (error.response && error.response.data) {
                        setHttpError(error.response.data.error);
                    }
                });

        } else {
            history.push("/login");
            toast.error("You need to login to access the page.");
        }
    }, [userToken, isCheckedOut]);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`)
            .then(response => {
                const dataReview = response.data._embedded.reviews;

                const loadedReviews: ReviewModel[] = [];
                let weighStarReview: number = 0;
                for (const key in dataReview) {
                    loadedReviews.push({
                        id: dataReview[key].id,
                        userEmail: dataReview[key].userEmail,
                        date: dataReview[key].date,
                        rating: dataReview[key].rating,
                        book_id: dataReview[key].bookId,
                        reviewDescription: dataReview[key].reviewDescription,
                    });
                    weighStarReview += dataReview[key].rating;
                };
                if (loadedReviews) {
                    setReviews(loadedReviews);
                    const round = (Math.round((weighStarReview / loadedReviews.length) * 2) / 2).toFixed(1);
                    setTotalStars(Number(round));
                    setIsLoadingReview(false);
                }

            }).catch(error => {
                setIsLoadingReview(false);
                setHttpError(error.message);
            });

    }, [isReviewLeft]);

    useEffect(() => {
        const url = `http://localhost:8080/api/books/${bookId}`;
        axios.get(url)
            .then(response => {
                const responseData = response.data
                const loadedBook: BookModel = {
                    id: bookId,
                    title: responseData.title,
                    author: responseData.author,
                    description: responseData.description,
                    copies: responseData.copies,
                    copiesAvailable: responseData.copiesAvailable,
                    category: responseData.category,
                    img: responseData.img,
                };
                setBook(loadedBook);
                setIsLoading(false);
            }).catch(error => {
                setIsLoading(false);
                setHttpError(error.message);
            });

    }, [isCheckedOut]);

    useEffect(() => {
        if (userToken) {
            const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
            const requestOptions = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content' : 'application/json',
                }
            }

            axios(url, requestOptions)
            .then(response=>{
                console.log(response);
                setIsReviewLeft(response.data);
            }).catch(error=>{
                setIsLoadingUserReview(false);
                setHttpError(error.response.data.error);
            })
           
        }
        setIsLoadingReview(false); 
    }, [userToken])

    async function checkoutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`;
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        }
        axios(url, requestOptions)
            .then(response => {
                setIsCheckedOut(true);
            })
            .catch(error => {
                setIsCheckedOut(false);
                toast.error(error.error);
            });

    }

    async function submintReview(starInput:number, reviewDescription: string) {
        let bookId: number = 0;
        if(book?.id){
            bookId=book?.id;
        }
        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewRequestModel),
        };
        const returnResponse = await fetch(url, requestOptions);
        if(!returnResponse.ok){
            console.log(returnResponse);
        }
        // await axios(url, requestOptions)
        // .then(response=>{

        // }).catch(error=>{
        //     console.log(error);
        //     setHttpError(error.response.data.error);
        // });
        setIsReviewLeft(true);
    }


    if (httpError) {
        return (
            <div>{httpError}</div>
        );
    }

    if (isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingReview) {
        return (
            <SpinerLoading />
        );
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width="226" height="349" alt="Book" />
                            : <img src={require('./../../image/image-book/new-book-1.jpg')} width='226' height='349' alt="Book" />}
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview Rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoanscount={currentLoansCount}
                        isCheckout={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft}
                        submitReview={submintReview}/>
                </div>
                <hr />
                <LastestReview reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center alighn-item-center">
                    {book?.img ?
                        <img src={book?.img} width="226" height="349" alt="Book" />
                        : <img src={require('./../../image/image-book/new-book-1.jpg')} width='226' height='349' alt="Book" />}
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview Rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoanscount={currentLoansCount}
                    isCheckout={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submintReview}/>
                <hr />
                <LastestReview reviews={reviews} bookId={book?.id} mobile={true} />
            </div>

        </div>
    );
}