import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Login(props) {

    const navigate = useNavigate()

    document.title = 'Login | Greenbay'
 
  /* Checks if the login datas are correct, and then navigates to the logged in user's profile, saves "token" and "username" to localstorage */  
  useEffect(()=> {
    if(!props.loginData.message && props.formData.username && props.formData.password){
        localStorage.setItem("token", props.loginData.token)
        localStorage.setItem("username", props.loginData.username)
        navigate('/profile');
    }
}, [props.loginData])

    /* Displays register form and resets the login form */
    function displayRegister(){
        const loginForm = document.querySelector('#loginForm')
        const registerForm = document.querySelector('#registerForm')
        loginForm.style.display = 'none'
        registerForm.style.display = 'flex'
        loginForm.reset()
        document.title = 'Register | Greenbay'
    }

    /* Displays login form and resets the register form */
    function displayLogin(){
        const loginForm = document.querySelector('#loginForm')
        const registerForm = document.querySelector('#registerForm')
        loginForm.style.display = 'flex'
        registerForm.style.display = 'none'
        registerForm.reset()
        document.title = 'Login | Greenbay'
    }

    return (
        <section className="login">

            {/* Landing Page image, titles, displays error message if there is any trying to log in or register*/}
            <div className="login-header">
            </div>
            <div className="login-form">
            <h1>GreenBay</h1>
            <h3>Welcome to Greenbay</h3>
            <h4 className="error-message" style={props.loginData.message ? {display: 'block'} : {display: 'none'}}>{props.loginData.message}</h4>

            {/* Login form */}
            <form onSubmit={props.login} method="POST" autoComplete="off" id="loginForm">
                <input name="username" type="text" placeholder="Username" onChange={props.handleChange} value={props.formData.name}/>
                <input name="password" type="password" placeholder="Password" onChange={props.handleChange} value={props.formData.name}/>
                <button type="submit">Login</button>
                <small>Are you new here? <span onClick={displayRegister}>Create an account</span></small>
            </form>

            {/* Register form */}
            <form onSubmit={props.register} id="registerForm" autoComplete="off">
                <input name="email" type="text" placeholder="Email Address" onChange={props.handleRegister} value={props.registerData.name}/>
                <input name="username" type="text" placeholder="Username" onChange={props.handleRegister} value={props.registerData.name}/>
                <input name="password" type="password" placeholder="Password" onChange={props.handleRegister} value={props.registerData.name}/>
                <button type="submit">Sign Up</button>
                <small>Already have an account? <span onClick={displayLogin}>Sign In</span></small>
            </form>

        </div>
        </section>
    )
}