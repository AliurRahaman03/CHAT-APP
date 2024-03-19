import { useState,useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";
import {ToastContainer,toast} from 'react-toastify'

function Login() {

  const [values,setValues]=useState({
    email:"",
    password:"",
  })

  const navigate=useNavigate();

  const toastOpts={
    position: "bottom-right",
    className:"toast-message",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  useEffect(() => {
    if (localStorage.getItem("user-infos1")) {
      // navigate("/");
    }
  }, []);

  function handleSubmit(event)
  {
    event.preventDefault();
    if(handleValidation())
    {
      try
      {
        fetch("http://localhost:8000/login",{
        method:"POST",
        body:JSON.stringify(values),
        headers:{
          'content-type':'application/json'
        }
        })
        .then((response)=>response.json())
        .then((data)=>{
          // console.log(data)
          if (data.token==undefined) {
          toast.error(data.msg, toastOpts);
        }
  
        if (data.token!==undefined) {
          localStorage.setItem(
            "user-infos1",
            JSON.stringify(data)
          );
          navigate('/')
        }
        })
        .catch((err)=>{
          console.log(err)
        })

        
      }
      catch(err)
      {
        console.log(err)
      }
    
    }
    
  }

  function handleChange(event)
  {
    event.preventDefault();
    setValues({...values,[event.target.name]:event.target.value});
  }
  
  function handleValidation()
  {
    const {email,password}=values

    if (email==="")
    {
      toast.error("Email is required", toastOpts);
      return false;
    }
    else if(password.length<6)
    {
      toast.error("password should be equal or greater than 6 characters",toastOpts);
      return false;
    }
    return true;
    
  }

  

  return (
      <section className="container">
        <form className="form" onSubmit={(event)=>[
          handleSubmit(event)
        ]} action="">
          <div>
            <img src="" alt="" />
            <h1>ChitChatZone</h1>
          </div>
          <input className="inp" type="email" name="email" placeholder="E-mail" onChange={handleChange}/>
          <input className="inp" type="password" name="password" placeholder="Password" onChange={handleChange}/>          
          <button className="btn" type="submit">Login</button>
          <p className="span-term">Don&apos;t Have any Account ?  <Link  to='/register'>Register</Link></p>
          
        </form>
        <ToastContainer />
      </section>
      
    
  )
}

export default Login