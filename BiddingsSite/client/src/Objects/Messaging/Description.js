import React from 'react'
import "./Messaging"
import {Route,Routes,Link} from 'react-router-dom';
import Incoming from "../Messaging/Incoming";
import Outgoing from "../Messaging/Outgoing";
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import { useNavigate,useParams} from "react-router-dom";
import { useEffect, useState  } from "react";
import axios from 'axios';

const getToday=()=>{
    var today = new Date();
    var ss = today.getSeconds();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }
    if(ss<10){
        ss='0'+ss
    }

    today = yyyy+'-'+mm+'-'+dd+"T"+today.getHours()+":"+today.getMinutes()+":"+ss;
    return today;
}

function Description() {

  let {Id} = useParams();
  const [Auc, setAuc] = useState([]);
  let navigate=useNavigate();
  const [Active,setActive]=useState();

  useEffect(() => {
    axios.get(`https://localhost:8080/Users/Active/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
        if (res.data.error){
           setActive(-1);
         }
         else{
           setActive(res.data);
            axios.get(`https://localhost:8080/Auctions/byid/${Id}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                setAuc(res.data);
            }
        });
    }
    })
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const initialValues={
    Message:"",
    Send_To:0,
    Auction_Id:0,
    Time_Send: "12:34"
  };

    const onSubmit=(data)=>{
        var input;
        if(Active===Auc.UserId){
            input=
            {
                Message:data.Message +"\n[."+ Active +".]",
                Send_To: Auc.Buyer_Id,
                AuctionId:Auc.id,
                Time_Send:getToday(),
                VtoA: Active,
                VtoR: Auc.Buyer_Id,
                Status: 0
            }
        }else if(Active===Auc.Buyer_Id){
            input=
            {
                Message:data.Message +"\n[."+ Active +".]",
                Send_To: Auc.UserId,
                AuctionId:Auc.id,
                Time_Send:getToday(),
                VtoA: Active,
                VtoR: Auc.UserId,
                Status: 0
            }
        }else{
            alert("NOT YOUR AUCTION OR BUY!!!");
            return;
        }

        axios.post("https://localhost:8080/Messaging",input, {headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
            if (res.data.error){
                alert(res.data.error);
            }else{
                alert("Message successfully send");
            }
        })
        navigate("/Messaging");
    };

    const validationSchema = Yup.object().shape({
        Message: Yup.string().required("You can't send an empty message")
    });

  return (
    <div>
        <div className='MessagingSidebar'>
            <div className='a'>
                <Link to="/Messaging/Incoming">Incoming</Link>
                <Link to="/Messaging/Outgoing">Outgoing</Link>
            </div>
            <Routes>
                <Route path='/Messaging/Incoming' element={<Incoming/>} />
                <Route path='/Messaging/Outgoing' element={<Outgoing/>} />
            </Routes>
        </div>
        <div className='User'>
            <table>
                <caption className='Title'>Auction Info</caption>
                <thead href="style.css" rel="stylesheet">
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Seller ID</th>
                        <th scope="col">Buyer ID</th>
                        <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody> 
                  <tr className='body6'>
                    <th scope="row">{Auc.id}</th>
                    <td>{Auc.Name}</td>
                    <td>{Auc.UserId}</td>
                    <td>{Auc.Buyer_Id}</td>
                    <td>{Auc.Currently}</td>
                  </tr>          
                </tbody>
            </table>
            <table>
                <thead href="style.css" rel="stylesheet">
                    <tr>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody> 
                 <tr className='body6'>
                    <th scope="row">{Auc.Description}</th>
                  </tr>          
                </tbody>
            </table>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="SendMessageCSS">
                        <label>Message:</label>
                        <ErrorMessage name="Message" component="h1"/>
                        <Field as="textarea" id="SendMessageForm" name="Message" placeholder="(Send a message...)"/>
                    <button type="submit">Send a Message</button>
                </Form>
            </Formik>
        </div>
    </div>
  );
}

export default Description;
