import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import api from "../../../models/api";
import { error } from "console";
import { toast } from "react-toastify";

export const ChangeQuantity: React.FC<{ book: BookModel, deleteBook:any }> = (props, key) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetBookInState = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        }
        fetBookInState();

    }, []);

    async function increaseQuantity() {
        const url = `https://localhost:8443/api/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;
        api.put(url)
        .then(response=>{
            setQuantity(quantity+1);
            setRemaining(remaining+1);
        }).catch(error=>{
            toast.error(error.response.data.error);
        });
    }

    async function decreaseQuantity() {
        const url = `https://localhost:8443/api/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;
        api.put(url)
        .then(response=>{
            setQuantity(quantity-1);
            setRemaining(remaining-1);
        }).catch(error=>{
            toast.error(error.response.data.error);
        });
    }

    async function deleteBook() {
        const url = `https://localhost:8443/api/admin/secure/delete/book?bookId=${props.book?.id}`;
        api.delete(url)
        .then(response=>{
            props.deleteBook();
        }).catch(error=>{
            toast.error(error.response.data.error);
        });
    }

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {props.book.img
                            ? <img src={props.book.img}
                                width="123"
                                height="196"
                                alt="Book" />
                            : <img src={require("../../../image/image-book/new-book-1.jpg")}
                                width="123"
                                height="196"
                                alt="Book" />
                        }
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {props.book.img
                            ? <img src={props.book.img}
                                width="123"
                                height="196"
                                alt="Book" />
                            : <img src={require("../../../image/image-book/new-book-1.jpg")}
                                width="123"
                                height="196"
                                alt="Book" />
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className="card-text">{props.book.description}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity : <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Books Remaining : <b>{remaining}</b></p>
                    </div>
                </div>
                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button onClick={deleteBook} className="m-1 btn btn-md btn-danger">
                            Delete
                        </button>
                    </div>
                </div>
                <button className="m1 btn btn-md btn-primary text-white" onClick={increaseQuantity}>Add Quantity</button>
                <button className="m1 btn btn-md btn-warning" onClick={decreaseQuantity}>Decrease Quantity</button>
            </div>
        </div>
    );

}