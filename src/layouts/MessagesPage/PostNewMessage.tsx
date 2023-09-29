import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
import api from "../../models/api";
import { toast } from "react-toastify";
import MessageModel from "../../models/MessageModel";

export const PostNewMessage = () => {

    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');

    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);


    const submitNewQuestion = async () => {
        const url = 'https://localhost:8443/api/messages/secure/add/message';
        const messageRequestModel: MessageModel = new MessageModel(title, question);
        if (title !== "" && question !== "") {
            api.post(url, messageRequestModel)
                .then(response => {
                    setTitle('');
                    setQuestion('');
                    setDisplaySuccess(true);
                    setDisplayWarning(false);
                }).catch(error => {
                    toast.error(error.response.data.error);
                });

        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    };

    return (
        <div className="card mt-3">
            {displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Question added successfully
                </div>
            }
            <div className="card-header">
                Ask question to Luv 2 Read Admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">
                            Title
                        </label>
                        <input type="text" className="form-control" id="exampleFormControlInput1"
                            placeholder="Tilte" onChange={e => setTitle(e.target.value)} value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">
                            Question
                        </label>
                        <textarea className="form-control" id="exampleFormControlTextarea1"
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>

                        </textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );


}