import { useEffect, useState } from "react";
import MessageModel from "../../models/MessageModel";
import api from "../../models/api";
import { error } from "console";
import { Panigation } from "../Untils/Pagination";
import { AdminMessage } from "./component/AdminMessage";
import AdminMessageRequest from "../../models/AdminResponseModel";
import { toast } from "react-toastify";

export const AdminMessages = () => {
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);
    //Panogation
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    //Recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const url = `http://localhost:8080/api/messages/search/findMessagesByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
        api.get(url)
            .then(response => {
                setMessages(response.data._embedded.messages);
                setTotalPage(response.data.page.totalPages);
                setIsLoadingMessages(false);
            }).catch(error => {
                setIsLoadingMessages(false);
                setHttpError(error.response.data.error);
            })
        window.scrollTo(0, 0);
    }, [currentPage, btnSubmit]);

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion (id:number, response:string) {
        const url = `http://localhost:8080/api/messages/secure/admin/message`;
        if(id!==null && response!==""){
            const messageAdminResponse: AdminMessageRequest = new AdminMessageRequest(id, response);
            api.put(url, messageAdminResponse)
            .then(response=>{
                setBtnSubmit(!btnSubmit);
            })
            .catch(error=>{
                toast.error(error.response.data.error);
            })
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-3">
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A</h5>
                    {messages.map(mes => (
                        <AdminMessage message={mes} key={mes.id} submitResponseToQuestion={submitResponseToQuestion}/>
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPage>1 && <Panigation currentPage={currentPage} totalPages={totalPage} paginate={paginate}/>}
        </div>
    )
}
