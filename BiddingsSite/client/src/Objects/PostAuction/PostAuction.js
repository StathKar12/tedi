import React from "react";
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";






import { useNavigate } from "react-router-dom";
import "./PostAuction.css";

function PostAuction(){
    
    let navigate=useNavigate();

    const initialValues={
        Title:"",
        Text:"",
        Username:""
    };
    const onSubmit=(data)=>{
        axios.post("http://localhost:8080/Auctions",data);
        navigate("/");
    };
    const validationSchema = Yup.object().shape({
        Title: Yup.string().required(),
        Text: Yup.string().required(),
        Username: Yup.string().max(12).min(4).required(),
    });
    return(
        <div className="PostAuction">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}> 
                <Form className="PostAuctionCSS">
                    <label>Title : </label>
                    <ErrorMessage name="Title" component="h1"/>
                    <Field id="PostAuctionForm" name="Title" placeholder="(Ex.Ford Mondeo 2005...)"/>
                    <label>Text : </label>
                    <ErrorMessage name="Text" component="h1"/>
                    <Field id="PostAuctionForm" name="Text" placeholder="(Ex.Price = 15700$ ...)"/>
                    <label>Username : </label>
                    <ErrorMessage name="Username" component="h1"/>
                    <Field id="PostAuctionForm" name="Username" placeholder="(Ex.George21...)"/>
                <button type="submit"> Post Auction </button>
                </Form>
            </Formik>
        </div>
    );

}
export default PostAuction;