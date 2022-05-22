import { useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import "./Signup.css"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';
import { Button, TextField, Container } from '@material-ui/core';

function Login() {
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [count, setCount] = useState(0)

    let navigate = useNavigate()
    useEffect(() => {
        console.log("Login Test")
        let authToken = sessionStorage.getItem('Auth-key')
        if(authToken){
            navigate('/home')
        }
    },[count])

    const login = async ()=> {
        setCount((count) => count + 1);
        try {
            const user = await signInWithEmailAndPassword(auth,loginEmail,loginPassword);
            sessionStorage.setItem('Auth-key',user._tokenResponse.refreshToken)
            alert("User Logged in successfully!!")
            navigate('/home')
         }catch(error) {
            console.log("Error",error.message)
            alert(error.message)
        }
    };

    return (
     <div className='login'>
        <h1>Welcome on Todo App</h1> 
        <Container maxWidth="sm" className="Signup-container">
            <h2>Login</h2> 
            {/* <form noValidate> */}
            <TextField variant="outlined" margin="normal" label="Enter Email" autoComplete="off"
                value={loginEmail} onChange={(event)=>{setLoginEmail(event.target.value)}} required fullWidth/>

            <TextField variant="outlined" margin="normal" label="Enter Password" autoComplete="off" type="password"
                value={loginPassword} onChange={(event)=>{setLoginPassword(event.target.value)}} required fullWidth/>

            <Button type="submit" variant="contained" color="primary" className="btn login-btn" fullWidth onClick={login}
                disabled = {!loginEmail || !loginPassword}> Login </Button>
            {/* </form> */}
            <div className='new-user-text'>New User? <a href="/signup">Register</a> Here</div> 
        </Container>    
     </div>
    );
}
export default Login