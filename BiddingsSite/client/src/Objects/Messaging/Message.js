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

function Message() {

  let {Id} = useParams();
  const [Auc, setAuc] = useState([]);
  const [Mess, setMess] = useState([]);
  let navigate=useNavigate();
  const [Active,setActive]=useState();

  useEffect(() => {
    axios.get(`https://localhost:8080/Users/Active/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
        if (res.data.error){
           setActive(-1);
         }
         else{
            setActive(res.data);
            axios.get(`https://localhost:8080/Messaging/Message/${Id}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                setMess(res.data);
                axios.post(`https://localhost:8080/Messaging/ChangeToRead/${Id}`,Mess,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
                if (res.data.error){
                    alert(res.data.error)
                }
                });
                axios.get(`https://localhost:8080/Auctions/byid/${res.data.AuctionId}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((resA)=>{
                if (resA.data.error){
                    alert(resA.data.error)
                }else{
                    setAuc(resA.data);
                }
                });
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
        if(Active === Mess.UserId){
            alert("You can not send a message to yourself !!");
        }else{
            var input=
                {
                    Message:data.Message +"\n[."+ Active +".]" + 
                        "\n\n Replied to =>: ..." + Mess.Time_Send + "\n" + Mess.Message ,
                    Send_To: Mess.UserId,
                    AuctionId:Mess.AuctionId,
                    Time_Send:getToday(),
                    VtoA: Active,
                    VtoR: Mess.UserId,
                    Status: 0
                }

            axios.post("https://localhost:8080/Messaging",input, {headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                if (res.data.error){
                    alert(res.data.error);
                }else{
                    alert("Message successfully send");
                }
            }).catch ((err)=>console.log(err))
        }
        navigate("/Messaging");
    };

    const validationSchema = Yup.object().shape({
        Message: Yup.string().required("You can't send an empty message")
    });

    const onClick=()=>{
        if(Active === Mess.UserId){        
            axios.post(`https://localhost:8080/Messaging/DfA/${Id}`,Mess,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
                if (res.data.error){
                    alert(res.data.error)
                }else{
                    alert("Message successfully deleted");
                    navigate("/Messaging");
                }
            });
        } else if(Active === Mess.Send_To){
            axios.post(`https://localhost:8080/Messaging/DfR/${Id}`,Mess,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
                if (res.data.error){
                    alert(res.data.error)
                }else{
                    alert("Message successfully deleted");
                    navigate("/Messaging");
                }
            });
        }
    };


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
            <table>
                <caption className='Title'>Message Info</caption>
                <thead href="style.css" rel="stylesheet">
                    <tr>
                        <th scope="col">For Auction</th>
                        <th scope="col">From User</th>
                        <th scope="col">To User</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr className='body6'>
                        <th scope="row">{Mess.AuctionId}</th>
                        <td>{Mess.UserId}</td>
                        <td>{Mess.Send_To}</td>
                        <td>{Mess.Time_Send}</td>
                    </tr>          
                </tbody>
            </table>
            <table>
                <thead href="style.css" rel="stylesheet">
                    <tr>
                        <th scope="col">Message</th>
                    </tr>
                </thead>
                <tbody> 
                 <tr className='body6'>
                    <th scope="row" >{Mess.Message}</th>
                  </tr>          
                </tbody>
            </table>
            <div className='SendMessageCSS'>
                <button type="submit"  onClick={onClick} >Delete Message</button> 
            </div>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="SendMessageCSS">
                        <label>Message:</label>
                        <ErrorMessage name="Message" component="h1"/>
                        <Field as="textarea" id="SendMessageForm" name="Message" placeholder="(Send a message...)"/>
                    <button type="submit">Send a Reply</button>
                </Form>
            </Formik>
        </div>
    </div>
  );
}

export default Message;







