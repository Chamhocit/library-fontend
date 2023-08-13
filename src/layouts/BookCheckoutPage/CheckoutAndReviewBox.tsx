import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";

import { LeaveAReview } from "../Untils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{book: BookModel|undefined, mobile: boolean, 
    currentLoanscount: number, isCheckout:boolean
    checkoutBook: any, isReviewLeft:boolean, submitReview:any}>=(props)=>{

    function reviewRender(){
        if(!props.isReviewLeft){
            return(
                <LeaveAReview submitReview={props.submitReview}/>
            )
        }else{
            return(
                <p><b>Thank you for your review!</b></p>
            );
        }
    }
    
    return(
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoanscount}/5</b>
                        books checked out
                    </p>
                    <hr/>
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 
                        ?  <h4 className="text-success">Available</h4>
                        :  <h4 className="text-danger">Wait List</h4>
                    }
                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies}</b>
                            coppies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable}</b>
                            available
                        </p>
                    </div>
                </div>
                {!props.isCheckout ? <button onClick={()=>props.checkoutBook()} className="btn btn-success btn-lg">Check out</button>
                : <p><b>Book checked out. Enjoy!</b></p>}
                
                <hr/>
                <p className="mt-3">
                    This number can change until placing order has been complete.
                </p>
               
               {reviewRender()}
            </div>
        </div>
    );
}