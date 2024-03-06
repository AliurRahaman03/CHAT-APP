import {  useState, useEffect } from "react";
import { Buffer } from "buffer";
import loader from '../assets/loader.gif'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AvatarSet() {

    const api="https://api.multiavatar.com/45678945";

    const [avatars,setAvatars]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [selectedAvatar,setSelectedAvatar]=useState(undefined);

    const navigate=useNavigate()

    const toastOpts={
        position: "bottom-right",
        className:"toast-message", 
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

    function setProfilePicture()
    {
        if(selectedAvatar==undefined)
        {
            toast.error("Please select an avatar",toastOpts)
        }
        else
        {
            const user=JSON.parse(localStorage.getItem("user-infos1"))
            const id = user.userid;

            fetch(`http://localhost:8000/setAvatar/${id}`,{
                method:"POST",
                body:JSON.stringify({image:avatars[selectedAvatar]}),
                headers:{
                    "Content-Type":"application/json"
                }

            })
            .then((response)=>response.json())
            .then((data)=>{
                console.log(data)
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("user-infos",JSON.stringify(user));
                navigate('/')
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    useEffect(()=>{
        const fetchData=async()=>{
          try
          {
            const data=[];
            for(let i=0;i<4;i++){
              const response=await fetch(`${api}/${Math.round(Math.random() * 1000)}`)
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const buffer=await response.arrayBuffer()
              const base64String=Buffer.from(buffer).toString('base64')
              data.push(base64String);
              }
              setAvatars(data)
              setIsLoading(false)
          }
          catch(err)
          {
            console.log(err);
          }
          
  
        }
        fetchData();
        console.log(avatars)
      },[])


  return (
    <>
    {isLoading ?(
      <div className="container-avatar">
        <img src={loader} alt="loader" className="loader" />
      </div>
    ):(
      <div className="container-avatar">
        <div className="title-container">
          <h1>Pick an avatar as your profile picture</h1>
        </div>
        <div className="avatars">
          {
            avatars.map((avatar,index)=>{
              return(
                // <div key={avatar} className={`avatar ${selectedAvatar===avatar?"selected":""}`}>
                //   <img
                //     src={`data:image/svg+xml;base64,${avatar}`}
                //     alt="avatar"
                //     key={avatar}
                //     onClick={() => setSelectedAvatar(index)}
                //   />
                // </div>
                <div key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              )
            })

          }
          
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
        <ToastContainer/>
      </div>
    )}
      
    </>
  )
}

export default AvatarSet;