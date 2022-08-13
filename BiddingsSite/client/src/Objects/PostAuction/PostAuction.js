import React, { useState } from "react";
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PostAuction.css";
import Select from "react-select";



const options =
 [  {multiValue: true},
    { label: "Tech ", value: "Tech" },
    { label: "Electronics ", value: "Electronics" },
    { label: "Fashion ", value: "Fashion" },
    { label: "Health & Beauty ", value: "Health & Beauty" },
    { label: "Home & Garden ", value: "Home & Garden " },
    { label: "Art ", value: "Art" },
    { label: "Motors ", value: "Motors" },
    { label: "Industrial equipment ", value: "Industrial equipment" },
  ];

function PostAuction(){

    let navigate=useNavigate();

    const [selected, setSelected] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    
    const initialValues={
        Title:"",
        Text:"",
        Username:""
    };
    const onSubmit=(data)=>{
        if(selected.length>0)
        {
            axios.post("http://localhost:8080/Auctions",data).then((res) =>{
                selected.forEach(category =>{   
                    axios.post("http://localhost:8080/Categories",{CategoryName:category.value,AuctionId:res.data.id});
                });
            });
            navigate("/");
        }
        else{
            setErrorMessage('You Must Choose At Least One Category For Your Auction!');
        }
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
                    <label>Categories :</label>
                    {errorMessage && <div className="error"> <h1>{errorMessage} </h1></div>}
                    <Select id={"Categories"} name={"Categories"} options={options} selected={selected} onChange={setSelected} isMulti={true} placeholder={"Choose At Least One Category to Post"}/>
                <button type="submit"> Post Auction </button>
                </Form>
            </Formik> 
        </div>
    );

}
export default PostAuction;