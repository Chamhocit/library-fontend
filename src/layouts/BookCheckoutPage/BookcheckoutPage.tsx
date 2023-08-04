import { useEffect, useState } from "react";
import { useGetbooksQuery } from "../../services/bookApi";
import BookModel from "../../models/BookModel";

import { StarsReview } from "../Untils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { useGetReviewsQuery } from "../../services/reviewApi";
import { LastestReview } from "./LastestReview";
import axios from "axios";
import { error } from "console";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/authSlice";
import { SpinerLoading } from "../Untils/SpinerLoading";

export const BookCheckoutPage = () => {
    const bookId = (window.location.pathname).split('/')[2];
    const { name: userEmail, token: userToken } = useAppSelector(selectAuth);
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);
    useEffect(() => {
        if (userToken) {
            const url = "http://localhost:8080/api/books/secure/currentloans/count";
            const requestOption = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                }
            };
            axios(url, requestOption)
            .then(response=>{
                setCurrentLoansCount(response.data);
                setIsLoadingCurrentLoansCount(false);
            })
            .catch(error=>{
                setIsLoadingCurrentLoansCount(false);
                setHttpError(error.message);
            });

        }
    }, [userToken]);
    if(currentLoansCount>0){
        console.log(currentLoansCount);
    }

   


    const [book, setBook] = useState<BookModel>();
    const [httpError, setHttpError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);


    const {
        data: responseData,
        isSuccess: isGetBooksucccess,
        isError: isGetBookError,
        error: GetBookError
    } = useGetbooksQuery(`/${bookId}`);


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

    }, []);

    useEffect(() => {

        if (isGetBooksucccess && responseData) {

            const response = responseData;

            const loadedBook: BookModel = {
                id: parseInt(bookId),
                title: response.title,
                author: response.author,
                description: response.description,
                copies: response.copies,
                copiesAvailable: response.copiesAvailable,
                category: response.category,
                img: response.img,
            };
            // console.log(loadedBook);
            setBook(loadedBook);
            setIsLoading(false);
        }

        if (isGetBookError && GetBookError) {
            //  throw new Error('Some thing went wrong!');
            setHttpError(httpError);
        }


    }, [isGetBooksucccess, responseData, isGetBookError, GetBookError]);




    if (isGetBookError) {
        return (
            <div>
                {httpError}
            </div>
        );
    }
    if(isLoadingReview || isLoadingCurrentLoansCount){
        return(
            <SpinerLoading/>
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
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoanscount={currentLoansCount} />
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
                <CheckoutAndReviewBox book={book} mobile={true} currentLoanscount={currentLoansCount}/>
                <hr />
                <LastestReview reviews={reviews} bookId={book?.id} mobile={true} />
            </div>

        </div>
    );
}