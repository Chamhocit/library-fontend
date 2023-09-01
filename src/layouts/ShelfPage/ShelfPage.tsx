import { useEffect, useState } from "react";
import api from "../../models/api";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export const ShelfPage = ()=>{
    const [authenticate, setAuthenticate] = useState(false);
    const history = useHistory();
    useEffect(()=>{
         api.get('http://localhost:8080/api/books/authenticate')
        .then(response=>{
            setAuthenticate(response.data);
            console.log(response);
        }).catch(error=>{
            history.push("/login");
            toast.error("You need to login again to access the page.");
            console.log(error);
        });
    }, []);
    return(
        <div className="container">
            <div className="mt-3">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-loans-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-loans" type="button" role="tab" aria-controls="nav-loans"
                        aria-selected = "true">
                            Loans
                        </button>
                        <button className="nav-link active" id="nav-history-tab" data-bs-toggle="tab"
                        data-bs-target="#nav-history" type="button" role="tab" aria-controls="nav-history"
                        aria-selected = "false">
                            Your History
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-loans" role="tabpanel"
                    aria-labelledby="nav-loans-tab">
                        <p>Loans</p>
                    </div>
                    <div className="tab-pane fade" id="nav-history" role="tabpanel"
                    aria-labelledby="nav-history-tab">
                        <p>Checkout History</p>
                    </div>
                </div>

            </div>
        </div>
    );
}