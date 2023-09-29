import { useEffect, useState } from "react";
import { SpinerLoading } from "../Untils/SpinerLoading";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import HistoryModal from "../../models/HistoryModal";
import { Panigation } from "../Untils/Pagination";
import Cookies from "js-cookie";

export const HistoryPage = () => {
    const [isLoadingHistory, setIsLaodingHistory] = useState(true);

    const [httpError, setHttpError] = useState(null);
    
    const [histories, setHistories] = useState<HistoryModal[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    
    const histo = useHistory();
    const [userEmail, setUserEmail] = useState("");
    useEffect(() => {
       const cookieUserEmail = Cookies.get("userName");
       if(cookieUserEmail){
        setUserEmail(cookieUserEmail);
       }else{
        histo.push("/login");
        toast.error("You need to login again to access the page.");
       }
    }, []);

    useEffect(() => {
        if (userEmail) {
            const url = `https://localhost:8443/api/histories/search/findHistoriesByUserEmail?userEmail=${userEmail}&page=${currentPage - 1}&size=5`;
            axios.get(url)
                .then(response => {
                    setHistories(response.data._embedded.histories);
                    setTotalPage(response.data.page.totalPages);
                    setIsLaodingHistory(false);
                }).catch(error => {
                    setHttpError(error.response.data.error);
                    setIsLaodingHistory(false);
                })
        }
    }, [userEmail, currentPage]);

    if (isLoadingHistory) {
        return (
            <SpinerLoading />
        );
    };

    if (httpError) {
        return (
            <div className="conatiner m-5">{httpError}</div>
        );
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (<>
        <div className="mt-2">
            {histories.length>0?
            <>
                <h5>Recent History: </h5>
                {histories.map(history=>(
                    <div key={history.id}>
                        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                            <div className="row g-0">
                                <div className="col-md-2">
                                    <div className="d-none d-lg-block">
                                        {history.img
                                        ?
                                        <img src={history.img} width="123" height="196" alt="Book"/>
                                        :
                                        <img src={require("./../../image/image-book/new-book-1.jpg")}
                                        width="123" height="196"/>
                                        }
                                    </div>
                                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                                        {history.img?
                                        <img src={history.img} width="123" height="196" alt="Book"/>
                                        :
                                        <img src={require("./../../image/image-book/new-book-1.jpg")}
                                        width="123" height="196"/>}
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-body">
                                        <h5 className="card-title">{history.author}</h5>
                                        <h4>{history.title}</h4>
                                        <p className="card-text">{history.description}</p>
                                         <hr/>
                                        <p className="card-text">Check out on: {history.checkoutDate}</p>
                                        <p className="card">Return on: {history.returnDate}</p>
                                       
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </>:
            <>
            <h3 className="mt-3">Currently no history: </h3>
            <Link className="btn btn-primary" to={"/search"}>Search for new book</Link>
            </>}
            {totalPage>1 && <Panigation currentPage={currentPage} totalPages={totalPage} paginate={paginate}/>}
        </div>
    </>);
}