import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function Register() {

  const [values,setValues]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
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

  function handleSubmit(event)
  {
    event.preventDefault();
    if(handleValidation())
    {
      
      fetch("http://localhost:8000/register",{
        method:"POST",
        body:JSON.stringify(values),
        headers:{
          'content-type':'application/json'
        }
      })
      .then((response)=>response.json())
      .then((data)=>{
        console.log(data)
      })
      .catch((err)=>{
        console.log(err)
      })
    navigate('/');
    }
    
  }

  function handleChange(event)
  {
    event.preventDefault();
    setValues({...values,[event.target.name]:event.target.value});
  }
  
  function handleValidation()
  {
    const {name,email,password,confirmPassword}=values

    if(name.length<3)
    {
      toast.error("Username should be greater than 3 characters",
      toastOpts
      );
      return false;
    }
    else if (email==="")
    {
      toast.error("Email is required", toastOpts);
      return false;
    }
    else if(password.length<6)
    {
      toast.error("password should be equal or greater than 6 characters",toastOpts);
      return false;
    }
    else if(password !== confirmPassword)
    {
      toast.error("password and confirm password should be same!",
      toastOpts
      );
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
            <h1>CHAT-APP</h1>
          </div>
          <input className="inp" type="text" name="name" placeholder="Username" onChange={handleChange}/>
          <input className="inp" type="email" name="email" placeholder="E-mail" onChange={handleChange}/>
          <input className="inp" type="password" name="password" placeholder="Password" onChange={handleChange}/>
          <input className="inp" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}/>
          
          <button className="btn" type="submit">Register</button>
          <p className="span-term">Already Registered ?  <Link  to='/login'>Login</Link></p>
          
        </form>
        <ToastContainer />
      </section>
      
    
  )
}

export default Register