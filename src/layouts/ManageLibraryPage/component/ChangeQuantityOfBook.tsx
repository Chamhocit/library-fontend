import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import api from "../../../models/api";
import { error } from "console";
import { SpinerLoading } from "../../Untils/SpinerLoading";
import { Panigation } from "../../Untils/Pagination";
import { ChangeQuantity } from "./Changequantity";

export const ChangeQuantityOfBooks = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');

    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {
        const baseUrl: string = `https://localhost:8443/api/books?page=${currentPage - 1}&size=${bookPerPage}`;
        api.get(baseUrl)
            .then(response => {
                setIsLoading(false);
                
                setTotalAmountOfBooks(response.data.page.totalElements);
                setTotalPages(response.data.page.totalPages);
                const responseData = response.data._embedded.books;

                const loadBooks: BookModel[] = [];
                for (const key in responseData) {
                    loadBooks.push({
                        id: responseData[key].id,
                        title: responseData[key].title,
                        author: responseData[key].author,
                        description: responseData[key].description,
                        copies: responseData[key].copies,
                        copiesAvailable: responseData[key].copiesAvailable,
                        category: responseData[key].category,
                        img: responseData[key].img,
                    });
                }
                setBooks(loadBooks);

            }).catch(error => {
                setIsLoading(false);
                setHttpError(error.response.data.error);
            })
    }, [currentPage, bookDelete]);

    const indexOfLastBook :number = currentPage * bookPerPage;
    const indexOfFirstBook :number = indexOfLastBook-bookPerPage;
    let lastItem = bookPerPage * currentPage <= totalAmountOfBooks 
                    ? bookPerPage * currentPage : totalAmountOfBooks;
    const paginate = (pageNumber :number)=>setCurrentPage(pageNumber);

    const deleteBook = ()=>setBookDelete(!bookDelete);
    if(isLoading){
        return(
            <SpinerLoading/>
        );
    }

    if(httpError){
        return(
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return(
        <div className="container mt-5">
            {totalAmountOfBooks>0 ?
                <>
                    <div className="mt-3">
                        <h3>Number of results: ({totalAmountOfBooks})</h3>
                    </div>
                    <p>
                        {indexOfFirstBook+1} to {totalAmountOfBooks} items:
                    </p>
                    {books.map(book=>(
                        <ChangeQuantity book={book} key={book.id} deleteBook = {deleteBook}/>
                    ))}
                </>

            : 
            <h5>Add a book before changing quantity</h5>}
            {totalPages>1 && 
                <Panigation currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );

}