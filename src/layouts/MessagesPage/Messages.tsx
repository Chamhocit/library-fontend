import { useEffect, useState } from "react";
import MessageModel from "../../models/MessageModel";
import Cookies from "js-cookie";
import { SpinerLoading } from "../Untils/SpinerLoading";
import api from "../../models/api";
import axios from "axios";
import { Panigation } from "../Untils/Pagination";



export const Messages = () => {

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const userEmail = Cookies.get("userName");
    //Messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    //Panigation
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        const url = `https://localhost:8443/api/messages/search/findMessagesByUserEmail?userEmail=${userEmail}&page=${currentPage - 1}&size=5`;
        api.get(url)
        .then(response=>{
            setMessages(response.data._embedded.messages);
            setTotalPage(response.data.page.totalPages);
            setIsLoadingMessages(false);
        }).catch(error=>{
            setIsLoadingMessages(false);
            setHttpError(error.response.data.error);
        });
    }, [currentPage]);

    if (isLoadingMessages) {
        <SpinerLoading />
    };

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    };
    const paginate = (pageNumber:number)=>setCurrentPage(pageNumber);
    return (
        <div className="mt-2">
            {messages.length>0?
            <>
                <h5>Current Q/A:</h5>
                {messages.map(message=>(
                    <div key={message.id}>
                        <div className="card mt-2 p-3 bg-body rouned">
                            <h5>Case #{message.id}: {message.title}</h5>
                            <h6>{message.userEmail}</h6>
                            <p>{message.question}</p>
                            <hr/>
                            <div>
                                <h5>Response</h5>
                                {message.response && message.adminEmail 
                                ? 
                                    <>
                                        <h6>{message.adminEmail}</h6>
                                        <p>{message.response}</p>
                                    </>
                                :
                                <p><i>Pending response from administration. Please be patient</i></p>}
                            </div>
                        </div>
                    </div>
                ))}
            </>
            :
            <h5>All questions you submit will be shown here</h5>
            }
            {totalPage>1 && <Panigation currentPage={currentPage} totalPages={totalPage} paginate={paginate}/>}
        </div>
    );
}