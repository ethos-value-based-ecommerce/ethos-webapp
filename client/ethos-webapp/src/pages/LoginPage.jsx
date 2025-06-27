import React, { useState } from "react";

// Function to render a basic login page
const LoginPage = () => {
    const [formData, setFormData] = useState({username: "", password: ""})

    // TO DO: WORK ON LOGIN LATER ONCE BACKEND IS SET UP

    // Function to handle form submission
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Logging in with:", formData)
    };

   return(

       <section className="login-page">
           <div className="login-welcome">
           <h1>ETHOS</h1>
           <h2> Welcome Back!</h2>
           <p> Please log in to continue:</p>
           </div>


           <div className="login-form">
           <form onSubmit={handleSubmit}>
               <label htmlFor="Username">Username</label>
               <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />

               <label htmlFor="Password">Password</label>
               <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

               <button type="submit">Log In</button>


               <p>Forgot your password? <a href="#">Reset it here.</a></p>
               <p>Don't have an account? <a href="#">Sign up here.</a></p>
               <p>Or, <a href="/">continue as a guest.</a></p>


            </form>
        </div>
    </section>

   )
}


export default LoginPage;
