import React from 'react'
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import "./SignUp.css";

function SignUp() {
    const initialValues={
        username:"",
        password:"",
    };
    const validationSchema = Yup.object().shape({
        username: Yup.string().max(18).min(6).required("Username is required to Sign Up"),
        password: Yup.string().max(18).min(6).required("Password is required to Sign Up"),
    });
const onSubmit = (data) => {
    axios.post("http://localhost:8080/Users",data).then(() => {
        console.log(data);
    });
};

    return (
        <div className="SignUpCSS">
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}> 
                <Form className="SignUpCSS">
                    <label>Username : </label>
                    <ErrorMessage name="username" component="h1"/>
                    <Field id="SignUpForm" name="username"/>
                    <label>Password : </label>
                    <ErrorMessage name="password" component="h1"/>
                    <Field type="password" id="SignUpForm" name="password"/>
                    <button type="submit"> Sign Up </button>
                </Form>
            </Formik>
        </div>

    )
}

export default SignUp
