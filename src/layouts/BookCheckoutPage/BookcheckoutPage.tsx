import { useEffect, useState } from "react";
import { useGetbooksQuery } from "../../services/bookApi";
import BookModel from "../../models/BookModel";

import { StarsReview } from "../Untils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LastestReview } from "./LastestReview";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SpinerLoading } from "../Untils/SpinerLoading";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import api from "../../models/api";
import Cookies from "js-cookie";


export const BookCheckoutPage = () => {
    
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


    const userEmail = Cookies.get("userName");
    if(userEmail){
        console.log(userEmail);
    }else{
        history.push("/login");
        toast.error("You need to login again to access the page.");
    }
    

    useEffect(() => {
        
            //số lượng đang checkout
            const url = "http://localhost:8080/api/books/secure/currentloans/count";
            api.get(url)
                .then(response => {
                    setCurrentLoansCount(response.data);
                    setIsLoadingCurrentLoansCount(false);
                })
                .catch(error => {
                    setIsLoadingCurrentLoansCount(false);
                    setHttpError(error.response.data.error);
                });

            //check xem đã checkout
            const urlTwo = `http://localhost:8080/api/books/secure/ischeckout/byuser?bookId=${bookId}`;
            
            api.get(urlTwo)
                .then(response => {
                    setIsCheckedOut(response.data);
                    setIsLoadingBookCheckedOut(false);
                })
                .catch(error => {
                    setHttpError(error.response.data.error);
                    setIsLoadingBookCheckedOut(false);
                });
        
    }, [isCheckedOut]);


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
        
            const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
            api.get(url)
            .then(response=>{
                setIsReviewLeft(response.data);
            }).catch(error=>{
                setIsLoadingUserReview(false);
                setHttpError(error.response.data.error);
            })
        
        setIsLoadingReview(false); 
    }, [])

    async function checkoutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`;
        api.put(url)
            .then(response => {
                setIsCheckedOut(true);
            })
            .catch(error => {
                setIsCheckedOut(false);
                toast.error(error.response.data.error);
            });
    }

    async function submintReview(starInput:number, reviewDescription: string) {
        let bookId: number = 0;
        if(book?.id){
            bookId=book?.id;
        }
        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `http://localhost:8080/api/reviews/secure`;
        api.post(url, reviewRequestModel)
        .then(response=>{
            setIsReviewLeft(true);
        }).catch(error=>{
            console.log(error);
        })
        
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