import {ReturnBook} from "./ReturnBook";
import {useEffect, useState} from "react";
import BookModel from "../../../models/BookModel";
import { SpinerLoading } from "../../Untils/SpinerLoading";
import { Link } from "react-router-dom";
import { useGetbooksQuery } from "../../../services/bookApi";


export const Carousel=()=> {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const {
        data: responseData,
        isSuccess: isGetBooksucccess,
        isError: isGetBookError,
        error: GetBookError
    } = useGetbooksQuery("?page=0&size=9");

    useEffect(()=>{
    
            if(isGetBooksucccess && isGetBooksucccess){
                // console.log(responseData);
                const response = responseData._embedded.books;
                const loadedBooks: BookModel[] = [];
          
                for(const key in response){
                // const bookUrl = response[key]._links.self.href;
                // const bookId = bookUrl.substring(bookUrl.lastIndexOf('/')+1);
                // console.log(bookId);
                loadedBooks.push({
                        id: response[key].id,
                        title: response[key].title,
                        author: response[key].author,
                        description: response[key].description,
                        copies: response[key].copies,
                        copiesAvailable: response[key].copiesAvailable,
                        category: response[key].category,
                        img: response[key].img,
                    });
                }
                setBooks(loadedBooks);
                setIsLoading(false);
            }

            if(isGetBookError && GetBookError){
                 setIsLoading(false);
                 
            }
          
      
    }, [isGetBooksucccess, responseData, isGetBookError, GetBookError]);

    if(isLoading){
        return(
           <SpinerLoading/>
        )
    }
    
    if(isGetBookError && GetBookError){
        return (
          <div className="container m-5">
            <p>Fail to fetch</p>
          </div>
        );
    }

    return (
        <div className="container mt-5" style={{height: 550}}>
            <div className="homepage-carousel-title">
                <h3>Find your next "I stayed up to late reading" book.</h3>
            </div>
            <div id="carouselExampleControls" className="carousel carousel-dark slide mt-5
            d-none d-lg-block" data-bs-interval="false">
                {/* Desktop */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(0,3).map(book=>(
                                <ReturnBook book={book} key={book.id}/>
                            ))}
                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                        {books.slice(2,5).map(book=>(
                                <ReturnBook book={book} key={book.id}/>
                            ))}
                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                        {books.slice(2,5).map(book=>(
                                <ReturnBook book={book} key={book.id}/>
                            ))}
                        </div>
                    </div>

                </div>
                    <button className="carousel-control-prev" type="button"
                            data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button"
                            data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                {/*Mobile*/}
                <div className="d-lg-none mt-3">
                    <div className="row d-flex justify-content-center align-items-center">
                       <ReturnBook book={books[0]} key={books[0].id}/>
                    </div>
                </div>
                <div className="homepage-carousel-title mt-3">
                    <Link className="btn btn-outline-secondary btn-lg" to="/search">View More</Link>

                </div>
            </div>

    );
}