import React from 'react'
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import {  useState  } from "react";

function SignUp() {
    
    let navigate=useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const initialValues={
        username:"",
        password:"",
        ConfirmPassword:"",
        Name:"",
        LastName:"",
        AFM:"",
        Email:"",
        Phone:"",
        Country:"",
        Location:"",
    };
    const validationSchema = Yup.object().shape({
        username: Yup.string().max(18).min(6).required("Username is required to Sign Up"),
        password: Yup.string().max(18).min(6).required("Password is required to Sign Up"),
        ConfirmPassword : Yup.string().max(18).min(6).required("Password Confirmation is required to Sign Up"),
        Name: Yup.string().max(18).required("Name is required to Sign Up"),
        LastName: Yup.string().max(18).required("LastName is required to Sign Up"),
        AFM: Yup.number().required("AFM is Required to Sign Up"),
        Email: Yup.string().max(30).required("Email is required to Sign Up"),
        Phone: Yup.number().required("Phone Number is Required to Sign Up"),
        Country: Yup.string().max(18).required("Country is required to Sign Up"),
        Location: Yup.string().max(18).required("Location is required to Sign Up"),
    });

    const onSubmit = (data) => {
        if(data.ConfirmPassword!==data.password){
            setErrorMessage("Password Missmatch");
            return;
        }
        axios.post(`https://localhost:8080/Users/SignUp/`,data).then((res)=>{
            if(res.data.error){
                alert(res.data.error)
            }else{
                alert("Your Sign Up Was Successfull Please Wait For Admin Approval!")
                navigate("/");
                navigate(0);
            }
        });
    };

    return (
        <div className="SignUpCSS">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}> 
                <Form className="SignUpCSS">

                    <label>Name : </label>
                    <ErrorMessage name="Name" component="h1"/>
                    <Field id="SignUpForm" name="Name"/>

                    <label>LastName : </label>
                    <ErrorMessage name="LastName" component="h1"/>
                    <Field id="SignUpForm" name="LastName"/>

                    <label>AFM : </label>
                    <ErrorMessage name="AFM" component="h1"/>
                    <Field id="SignUpForm" name="AFM"/>

                    <label>Email : </label>
                    <ErrorMessage name="Email" component="h1"/>
                    <Field id="SignUpForm" name="Email"/>

                    <label>Phone : </label>
                    <ErrorMessage name="Phone" component="h1"/>
                    <Field id="SignUpForm" name="Phone"/>

                    <label>Country : </label>
                    <ErrorMessage name="Country" component="h1"/>
                    <Field id="SignUpForm" name="Country"/> 

                    <label>Location : </label>
                    <ErrorMessage name="Location" component="h1"/>
                    <Field id="SignUpForm" name="Location"/>

                    <label>Username : </label>
                    <ErrorMessage name="username" component="h1"/>
                    <Field id="SignUpForm" name="username"/>

                    <label>Password : </label>
                    <ErrorMessage name="password" component="h1"/>
                    <Field type="password" id="SignUpForm" name="password"/>

                    <label>Confirm Password : </label>
                    {errorMessage && <div > <h1>{errorMessage} </h1></div>}
                    <Field type="Password" id="SignUpForm" name="ConfirmPassword"/>

                    <button type="submit"> Sign Up </button>
                </Form>
            </Formik>
        </div>

    )
}

export default SignUp
