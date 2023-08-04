import {useState, useEffect} from "react"
import BookModel from "../../models/BookModel"
import { SpinerLoading } from "../Untils/SpinerLoading";
import { SeachBook } from "./component/SearchBook";
import { Panigation } from "../Untils/Pagination";
import { useGetbooksQuery } from "../../services/bookApi";

export const SearchBookPage = ()=>{
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [httpError, setHttpError] = useState<{ status: number; data: any } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks]  = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book Category');

    let url:string = '';
    if(searchUrl===''){
        url = `?page=${currentPage-1}&size=${bookPerPage}`;
    }else{
        url = searchUrl;
    }
    useEffect(()=>{
        if(search===''){
            setSearchUrl('');
        }else{
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=0&size=${bookPerPage}`);
        }
    }, [search]);


    const searchHandleChange = ()=>{
        if(search===''){
            setSearchUrl('');
        }else{
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=0&size=${bookPerPage}`);
        }
        setCategorySelection('Book category');
    }

    const categoryField = (value:string)=>{
        if(value.toLowerCase()==='fe' ||
            value.toLowerCase()==='be'||
            value.toLowerCase()==='data'||
            value.toLowerCase()==='devops'){
                setCategorySelection(value);
                setSearchUrl(`/search/findByCategory?category=${value}&page=0&size=${bookPerPage}`);
            }else{
                setCategorySelection('All');
                setSearchUrl(`?page=${currentPage-1}&size=${bookPerPage}`);
            }
    }

    const {
        data: response,
        isSuccess: isGetBooksucccess,
        isError: isGetBookError,
        error: GetBookError
    } = useGetbooksQuery(url);
    useEffect(()=>{
        
            if(response && isGetBooksucccess){
                const responseData = response._embedded.books;
                // console.log(response);
                setTotalAmountOfBooks(response.page.totalElements);
                setTotalPages(response.page.totalPages);
    
                const loadBooks:BookModel[] = [];
                for(const key in responseData){
                    // const bookId = responseData[key]._links.self.href.split('/').pop();
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
                setIsLoading(false);
            }  
        if(GetBookError && isGetBookError){
            setIsLoading(false);
            // setHttpError(GetBookError);
        }
        window.scrollTo(0,0);
    }, [currentPage, GetBookError, response, isGetBookError, isGetBooksucccess]);
    if(isLoading){
        return (
            <div className="container m-5">
                <SpinerLoading/>
            </div>
        );
    }
    if(GetBookError){
        return(
            <div className="container m-5">
                <p>{Error.name}</p>
            </div>
        );
    }

    const indexOfLastBook :number = currentPage * bookPerPage;
    const indexOfFirstBook :number = indexOfLastBook-bookPerPage;
    let lastItem = bookPerPage * currentPage <= totalAmountOfBooks ? bookPerPage * currentPage : totalAmountOfBooks;
    const paginate = (pageNumber :number)=>setCurrentPage(pageNumber);

   

    return(
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control me-2" type="search"
                                placeholder="Search" aria-labelledby="Search"
                                onChange={e=>setSearch(e.target.value)}/>
                                <button onClick={()=>searchHandleChange()} className="btn btn-outline-success">
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {categorySelection}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li onClick={()=>categoryField('all')}>
                                        <a className="dropdown-item" href="#">
                                            All
                                        </a>
                                    </li>
                                    <li onClick={()=>categoryField('FE')}>
                                        <a className="dropdown-item" href="#">
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick={()=>categoryField('BE')}>
                                        <a className="dropdown-item" href="#">
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick={()=>categoryField('data')}>
                                        <a className="dropdown-item" href="#">
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={()=>categoryField('DevOps')}>
                                        <a className="dropdown-item" href="#">
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h5>Number of results: {totalAmountOfBooks}</h5>
                        <p>{indexOfFirstBook+1} to {lastItem} of {totalAmountOfBooks} item</p>
                        {books.map(item=>(
                            <SeachBook book={item} key = {item.id}/>
                        ))}
                        {totalPages>1 && 
                            <Panigation currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}