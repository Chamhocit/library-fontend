import { useEffect, useState } from "react"
import ReviewModel from "../../models/ReviewModel"
import axios from "axios";
import BookModel from "../../models/BookModel";
import { SpinerLoading } from "../Untils/SpinerLoading";
import { Review } from "../Untils/Review";
import { Panigation } from "../Untils/Pagination";

export const ReviewListPage = ()=>{
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] =useState(null);

    //Panigation
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewPerPage] = useState(5);
    const [totalAmountReviews, setTotalAmountReview] = useState(0);
    const [totalPages, setTotalPages] = useState(0);



    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        axios.get(`http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage-1}&size=${reviewPerPage}`)
            .then(response => {
                const dataReview = response.data._embedded.reviews;

                setTotalAmountReview(response.data.page.totalElements);
                setTotalPages(response.data.page.totalPages);
                const loadedReviews: ReviewModel[] = [];
                
              
                for (const key in dataReview) {
                    loadedReviews.push({
                        id: dataReview[key].id,
                        userEmail: dataReview[key].userEmail,
                        date: dataReview[key].date,
                        rating: dataReview[key].rating,
                        book_id: dataReview[key].bookId,
                        reviewDescription: dataReview[key].reviewDescription,
                    });
                   
                };
                
                    setReviews(loadedReviews);
                    setIsLoading(false);

            }).catch(error => {
                setIsLoading(false);
                setHttpError(error.response.data.error);
            });

    }, [currentPage]);

    if(isLoading){
        return(
            <SpinerLoading/>
        );
    }

    if(httpError){
        return(
            <div className="conatiner m-5">{httpError}</div>
        )
    }

    const indexOfLastReview:number = currentPage * reviewPerPage;
    const indexOfFirstReview:number = indexOfLastReview - reviewPerPage;

    let lastItem = reviewPerPage * currentPage <= totalAmountReviews ? reviewPerPage * currentPage : totalAmountReviews;
    const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
    return(
     
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview+1} to {lastItem} of {totalAmountReviews} items:
            </p>
            <div className="row">
                {reviews.map(review=>(
                    <Review review={review} key={review.id}/>
                ))}
            </div>
            {totalPages>1 && <Panigation currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
      
    );
}