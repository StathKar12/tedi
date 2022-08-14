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
    { label: "Home & Gsarden ", value: "Home & Garden " },
    { label: "Art ", value: "Art" },
    { label: "Motors ", value: "Motors" },
    { label: "Industrial equipment ", value: "Industrial equipment" },
  ];


function PostAuction(){

    let navigate=useNavigate();

    const [selected, setSelected] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleUploadFiles = files => 
    {
        const uploaded = [...uploadedFiles];
        files.some((file) => 
        {
            if (uploaded.findIndex((f) => f.name === file.name) === -1)
            {
                uploaded.push(file);
            }
            setUploadedFiles(uploaded);
            return "";
        })
        setUploadedFiles(uploaded);
    }

    const handleFileEvent =  (e) => {   
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        handleUploadFiles(chosenFiles);
    }

    const initialValues={
        Name:"",
        Description:"",
        Buy_Price:"",
        First_Bid:"",
        Started:"",
        Ends:"",
        Seller:0,
        Country: "",
        Location: "",
        Longtitude:"",
        Latitude: "",

        Time: "12:34"
    };

    const onSubmit=(data)=>{
        if(selected.length>0)
        {
            const input=
            {
                Name:data.Name,
                Description:data.Description,
                First_Bid:data.First_Bid,
                Currently:data.First_Bid,
                Number_of_Bids:0,
                Started:data.Started,
                Ends:data.Ends,
                Seller:1 //To fix with user id that makes the auction
            }
            if(data.Buy_Price.length>0){
                input.Buy_Price=data.Buy_Price;
            }

            axios.post("http://localhost:8080/Auctions",input).then((res) =>{
                selected.forEach(category =>{   
                    axios.post("http://localhost:8080/Categories",{CategoryName:category.value,AuctionId:res.data.id});
                });
                const input2={Location:data.Location,Country:data.Country,AuctionId:res.data.id};
                if(data.Longtitude.length>0 && data.Latitude.length>0)
                {
                    input2.Longtitude=data.Longtitude;
                    input2.Latitude=data.Latitude;
                }
                axios.post("http://localhost:8080/Location",input2);

                if(uploadedFiles.length>0){
                    uploadedFiles.forEach(image =>{   
                        const formData = new FormData();
                        formData.append('fileupload', image);
                        axios.post(`http://localhost:8080/Upload/${res.data.id}`, formData).then((response) => {
                          console.log(response.data);
                        });
                     });
                }
            });
 
            navigate("/");
        }
        else{
            setErrorMessage('You Must Choose At Least One Category For Your Auction!');
        }
    };

    const validationSchema = Yup.object().shape({
        Buy_Price: Yup.number(),
        First_Bid: Yup.number().required(),
        Name: Yup.string().required(),
        Description: Yup.string().required(),
        Started: Yup.string().required(),
        Ends: Yup.string().required(),
        Country: Yup.string().required(),
        Location: Yup.string().required(),
        Longtitude: Yup.number(),
        Latitude: Yup.number(),
    });
    
    return(
        <div className="PostAuction">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}> 
                <Form className="PostAuctionCSS">
                    
                    <label>Name : </label>
                    <ErrorMessage name="Name" component="h1"/>
                    <Field id="PostAuctionForm" name="Name" placeholder="(Ex.Ford Mondeo 2005...)"/>
                    
                    <label>Description : </label>
                    <ErrorMessage name="Description" component="h1"/>
                    <Field id="PostAuctionForm" name="Description" placeholder="(Ex.Diesel 200.000 kilometeres ...)"/>
                    
                    <label>Buy_Price (Optional): </label>
                    <ErrorMessage name="Buy_Price" component="h1"/>
                    <Field id="PostAuctionForm" name="Buy_Price" placeholder="(Ex.200)"/>
                    
                    <label>First_Bid : </label>
                    <ErrorMessage name="First_Bid" component="h1"/>
                    <Field id="PostAuctionForm" name="First_Bid" placeholder="(Ex.50)"/>
                    
                    <label>Starts (Ex. 01/02/2022 , 12-00 PM): </label>
                    <ErrorMessage name="Started" component="h1"/>
                    <Field type="datetime-local" id="PostAuctionForm" name="Started"/>
                    
                    <label>Ends (Ex. 01/02/2022 , 01-00 AM): </label>
                    <ErrorMessage name="Ends" component="h1"/>
                    <Field type="datetime-local" id="PostAuctionForm" name="Ends"/>

                    <label>Country : </label>
                    <ErrorMessage name="Country" component="h1"/>
                    <Field id="PostAuctionForm" name="Country" placeholder="(Ex.Greece)"/>
                    
                    <label>Location : </label>
                    <ErrorMessage name="Location" component="h1"/>
                    <Field id="PostAuctionForm" name="Location" placeholder="(Ex.Johns Place)"/>
                    
                    <label>Longtitude (Optional): </label>
                    <ErrorMessage name="Longtitude" component="h1"/>
                    <Field id="PostAuctionForm" name="Longtitude" placeholder="(Ex.0.00000)"/>
                    
                    <label>Latitude (Optional): </label>
                    <ErrorMessage name="Latitude" component="h1"/>
                    <Field id="PostAuctionForm" name="Latitude" placeholder="(Ex.0.00000)"/>
                    
                    <label htmlFor='fileUpload'>Images (Optional):
                    <ErrorMessage name="Images" component="h1"/>
                    <Field type="file" id="PostAuctionForm" name="Images" placeholder="(Ex.0.00000)" multiple onChange={handleFileEvent}/>
                    </label>
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