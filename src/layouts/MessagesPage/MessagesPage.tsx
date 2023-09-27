import { useEffect, useState } from "react"
import { PostNewMessage } from "./PostNewMessage";


import { Messages } from "./Messages";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const MessagesPage=()=>{
   
    const [messagesClick, setMessagesClick] = useState(false);
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

    return(
        <div className="container">
            <div className="mt-3 mb-2">
                <nav>
                    <div id="nav-tab" role="tablist" className="nav nav-tabs">
                        <button onClick={()=>setMessagesClick(false)} className="nav-link active"
                        id="nav-send-message-tab" data-bs-toggle="tab" data-bs-target="#nav-send-message"
                        type="button" role="tab" aria-controls="nav-send-message" aria-selected="true">
                            Submit Question
                        </button>
                        <button onClick={()=>setMessagesClick(true)} className="nav-link"
                        id="nav-message-tab" data-bs-toggle="tab" data-bs-target="#nav-message"
                        type="button" role="tab" aria-controls="nav-message" aria-selected="false">
                            Q/A Response/Pending
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-send-message" role="tabpanel"
                        aria-labelledby="nav-send-message-tab">
                            <PostNewMessage/>
                        </div>
                        <div className="tab-pane fade" id="nav-message" role="tabpanel" aria-labelledby="nav-message-tab">
                            {messagesClick? <Messages/>:<></>}
                        </div>
                </div>
            </div>
        </div>
    );
}