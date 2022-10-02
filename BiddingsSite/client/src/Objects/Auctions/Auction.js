import axios from 'axios';
import React from 'react';
import { useEffect, useState ,useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import "./Auctions.css"
import {MapContainer , TileLayer,Marker, Popup  } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import "./map.css"
const getToday=()=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }    

    today = yyyy+'-'+mm+'-'+dd+"T"+today.getHours()+":"+today.getMinutes();
    return today;
}
function Auction(){

    let {Id} = useParams();
    const [Auction,setAuction]=useState({});
    const [files,setFiles]=useState([]);
    const [Cats,setCat]=useState([]);
    const [location,setLocation]=useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [Bids, setBids] = useState([]);
    const [Active,setActive]=useState();

    const mapref=useRef();
    let navigate=useNavigate();

    const fun2=(value,key)=>{try {return renderImage(value,key)}catch(err){return <h2 key={key}> </h2>}}
    const renderImage=(file,key)=>{
        
        return(<div key={key} >
            <img className="cropped2" src={require('./../../UploadedItems/'+file.FileName)} alt=""/>  
        </div>)
    }
    const onSubmit=(data)=>{
        if(typeof data.Bid==="undefined")return;
        if(Auction.Number_of_Bids===0 && Number(data.Bid)<Number(Auction.First_Bid)){
            setErrorMessage(`For the First Bid you must place at least: ${Auction.First_Bid} $`);
        }
        else if(Auction.Currently >= data.Bid){
            setErrorMessage(`Please bid more than the current price`);
        }
        else
        {
            let isExecuted = window.confirm("Are You Sure You Want To Bid?");
           if(isExecuted)
           if(typeof Auction.Number_of_Bids!=="undefined"){
                const inputBid=
                {
                    Time:getToday(),
                    Amount:data.Bid,
                    AuctionId:Auction.id,
                    Seller:Auction.UserId
                }
                
                axios.post("https://localhost:8080/Bids/",inputBid,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                    if (res.data.error){
                        alert(res.data.error)
                    }else{
                        Auction.Number_of_Bids+=1;
                        Auction.Currently=data.Bid;
                        Auction.Buyer_Id=Active;
                        axios.post(`https://localhost:8080/Auctions/update`,Auction,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                            navigate(0);
                        });
                    }
                });
            }

        } 

    };
    
    const  BuyNow=()=>{
        if(typeof Auction.Active==="undefined")return;
        const inputBid=
        {
            Time:getToday(),
            Amount:Auction.Buy_Price,
            AuctionId:Auction.id,
            Seller:Auction.UserId
        }
        let isExecuted = window.confirm("Are You Sure You Want To Buy Now?");
        if(isExecuted)
        axios.post("https://localhost:8080/Bids/",inputBid,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                Auction.Number_of_Bids+=1;
                Auction.Active=2;
                Auction.Currently=Auction.Buy_Price;
                Auction.Buyer_Id=Active;
                axios.post(`https://localhost:8080/Auctions/update`,Auction,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                    // axios.post(`https://localhost:8080/Messaging/`,{Buyer_id:Active,Seller_id:Auction.UserId,},{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                        navigate(0);
                    // });
                });
            }
        });
    };
    const renderBuyPrice = () => {
        if(Auction.Buy_Price!=null)
            return <div> <button className='bidbutton' type="button" onClick={BuyNow}>Click To Buy Now For {Auction.Buy_Price}$!</button></div>;
    }
    const initialValues={
        Bid:""
    };
    
    
    const renderIfNotExpired=()=>{

        if(typeof Auction.Active!="undefined")
        {
           if(Auction.Active===0){
            return <h1 className="SOLD">This Auction Has Not Yet Started You Can Bid Soon!</h1>
           }else if(Auction.Active===2){
                return <h1 className="SOLD"> SOLD FOR :{Auction.Currently}</h1>
            }else if(Auction.Active===-1){
            return <h1 className="exp" >This Auction Has Expired You Can No Longer Bid!</h1>
           }else if(Active===-1 || Active===Auction.UserId )return <h1> </h1>
           
           return <div className="PostBid">
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form >
                            <ErrorMessage id="PostAuctionForm"  name="Bid" component="h1"/>
                            {errorMessage && <div > <h1>{errorMessage} </h1></div>}
                            <Field id="PostAuctionForm" name="Bid" placeholder="(Ex.200)"/>
                            <div><button className='bidbutton' type="submit">Current Bid is {Auction.Currently} $ , Click to Bid</button></div>
                        </Form>
                    </Formik>
                    {renderBuyPrice()}
                </div> 
        }
    };

    useEffect(() => {
        
        axios.get(`https://localhost:8080/Users/Active/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
             if (res.data.error){
                axios.get(`https://localhost:8080/Auctions/byid/${Id}`).then((res2)=>{
            
                    res2.data.Started=res2.data.Started.replace("T", " At: ");
                    res2.data.Ends=res2.data.Ends.replace("T", " At: ");
                   
                    setAuction(res2.data);
                });
                setActive(-1);
              }
              else{
                setActive(res.data);
                axios.get(`https://localhost:8080/Auctions/byid/${Id}`).then((res2)=>{
            
                    res2.data.Started=res2.data.Started.replace("T", " At: ");
                    res2.data.Ends=res2.data.Ends.replace("T", " At: ");
                   
                    setAuction(res2.data);
                    axios.post(`https://localhost:8080/History/`,{AuctionId:res2.data.id,UserId:res.data},{headers: {AccT: sessionStorage.getItem("AccT")}});
                });
              }
        });

        axios.get(`https://localhost:8080/Upload/byid/${Id}`).then((res2)=>{
            setFiles(res2.data);    
        });
        axios.get(`https://localhost:8080/Location/${Id}`).then((res3)=>{
            setLocation(res3.data[0]);
        });
        axios.get(`https://localhost:8080/Bids/byid/${Id}`).then((res4)=>{
            setBids(res4.data);
        });
        axios.get(`https://localhost:8080/Categories/byid/${Id}`).then((res5)=>{
            if (!res5.data.error){
                setCat(res5)
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    const validationSchema = Yup.object().shape({
        Bid: Yup.number().required(),
    });
    const onClick=(()=>{
        let categories="";
        Cats.data.forEach((element)=>{
            categories+="  <Category>"+element.CategoryName+"</Category>\n"
        });
        
        let bidsxml="";
        Bids.forEach((element)=>{
            bidsxml+=`     <Bid>\n      <Bidder Rating="${element.BidderRating}" UserID="${element.UserId}">\n         <Location>${element.BidderLocation}</Location>\n         `
            bidsxml+=`<Country>${element.BidderCountry}</Country>\n       </Bidder>\n       <Time>${element.Time}</Time>\n       <Amount>$${element.Amount}</Amount>\n     </Bid>\n`;
        });

        var xmltext = `<Item ItemID="${Id}">\n  <Name>${Auction.Name}</Name>\n${categories}  <Currently>$${Auction.Currently}</Currently>\n  `;
        xmltext+=`<First_Bid>$${Auction.First_Bid}</First_Bid>\n  <Number_of_Bids>${Auction.Number_of_Bids}</Number_of_Bids>\n  <Bids>\n${bidsxml}  </Bids>\n`;
        xmltext+=`  <Location>${location.Location}</Location>\n  <Country>${location.Country}</Country>\n  <Started>${Auction.Started}</Started>\n  <Ends>${Auction.Ends}</Ends>\n`;
        xmltext+=`  <Seller Rating="${Auction.SellerRating}" UserID="${Auction.UserId}"/>\n  <Description>${Auction.Description}</Description>\n</Item>`;
        var filename = "Auction"+String(Id)+".xml";
        var element = document.createElement('a');
        var bb = new Blob([xmltext], {type: 'text/plain'});

        element.setAttribute('href', window.URL.createObjectURL(bb));
        element.setAttribute('download', filename);

        element.dataset.downloadurl = ['text/plain', element.download, element.href].join(':');
        element.draggable = true; 
        element.classList.add('dragout');

        element.click();
    });

    const onClick2=(()=>{

        var catarray=[];
        Cats.data.forEach((element)=>{
            catarray.push(element.CategoryName);
        });

        var Bidsarray=[];
        Bids.forEach((element)=>{
            Bidsarray.push({Rating:element.BidderRating,UserId:element.UserId,Location:element.BidderLocation,Country:element.BidderCountry,Time:element.Time,Amount:element.Amount});
        });
        var jsontext = {
            ItemID:Id,
            Name:Auction.Name,
            Categories:catarray,
            Currently:Auction.Currently,
            First_Bid:Auction.First_Bid,
            Number_of_Bids:Auction.Number_of_Bids,
            Bids:Bidsarray, 
            Location:location.Location,
            Country:location.Country,
            Started:Auction.Started,
            Ends:Auction.Ends,
            Seller:Auction.UserId,
            Description:Auction.Description,
        };
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(jsontext)
          )}`;
          const link = document.createElement("a");
          link.href = jsonString;
          link.download = "Auction"+String(Id)+".json";
      
          link.click();
    });

    const renderDownloadXML=(()=>{
        if(Active===1)
          return (<div><button className='DownloadXML' type="submit" onClick={onClick}>Click To Download XML</button> 
          <button className='DownloadXML' type="submit" onClick={onClick2}>Click To Download JSON</button></div>);
    })
    const onClickDel=(()=>{
        let isExecuted = window.confirm("Are You Sure Deleting The Auction?");
        if(isExecuted)
        axios.post(`https://localhost:8080/Auctions/Delete/${Id}`,Auction,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                navigate("/Auctions");
                navigate(0);
            }
          });
    })
    const onClickChange=(()=>{
        navigate(`/UpdateAuction/${Id}`);
    })
    const renderChanges=(()=>{
        if(Active===Auction.UserId || Active===1){
            if(Auction.Active===0 || (Auction.Active>0 && Auction.Number_of_Bids===0) || Active===1)
                return(
                        <div><button className='DownloadXML' type="submit" onClick={onClickDel}>Click To Delete the Auction</button>
                        <button className='DownloadXML' type="submit" onClick={onClickChange}>Click To Change the Auction</button></div>
                      );
        }
    })

    const renderMap=(()=>{

        if(typeof location.Longtitude!=="undefined" && typeof location.Latitude!=="undefined" &&( location.Longtitude!==0 ||  location.Latitude!==0)){

           return(
           <MapContainer className='mapleaf' center={{lat:location.Latitude,lng:location.Longtitude}} zoom={12} ref={mapref}>
                {/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="crossOrigin="" /> */}
                <TileLayer url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=5BGWMRomNRQMyt3ZdEn6" />
                <Marker position={[location.Latitude, location.Longtitude]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >
                    <Popup>
                        {location.Location}
                    </Popup>
                </Marker>
           </MapContainer>
           )
        }
    })

    const renderCats=(()=>{
        if(typeof Cats.data !== "undefined"){
            let catarray="Categories :";
            Cats.data.forEach((element,index)=>{
                if(index===0)
                    catarray+=" "+element.CategoryName;
                else
                catarray+=", "+element.CategoryName;
            })
            return<h3 id="bd">{catarray}</h3>
        }
    });
    return(
    <div className='grid'>
    <div className='TryLeft'>
        <div className='CompleteAuction'>
            <div className="AuctionTitle"><span>{Auction.Name}</span></div>
            <div className='Photos'>
                {files.map((file,key)=>{
                    return (
                        fun2(file,key)
                    );
                })}
            </div>
            <div className='body2'>
                <h3 id="bd">Number of bids :{Auction.Number_of_Bids}</h3>
                <h3 id="bd">Country : {location.Country} </h3>
                <h3 id="bd">Location : {location.Location} </h3>
                <h3 id="bd">Cords : ({location.Latitude},{location.Longtitude})</h3>
                <h3 id="bd">Seller: {Auction.Seller} </h3>
                <h3 id="bd">Seller Rating: {Auction.SellerRating} </h3>
                <h3 id="bd">Starts : {Auction.Started}</h3>       
                <h3 id="bd">Ends :{Auction.Ends}</h3>
                <h3 id="bd">Description:</h3>       
                {renderCats()}
                <h3 id="bd" className='desc'>{Auction.Description}</h3>
                {renderMap()}
                {renderDownloadXML()}
                {renderChanges()}
            </div>
        </div> 
        </div>
        <div className='Auction'>

            {renderIfNotExpired()}

            {Bids.map((value,key) => {
                return ( 
                <div className="body2" key={key}>
                    <h3>Bidder: {value.Bidder}</h3>
                    <h3>Country: {value.BidderCountry}</h3>
                    <h3>Location: {value.BidderLocation}</h3>
                    <h3>Rating: {value.BidderRating}</h3>
                    <h3>Amount: {value.Amount}</h3>
                    <h3>Time: {value.Time}</h3>
                </div>
                )
            })}
        </div>
    </div>
    );
}

export default Auction