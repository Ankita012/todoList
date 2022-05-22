import { useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import './Signup.css'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';
import { Button, TextField, Container } from '@material-ui/core';

function Signup (){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [count, setCount] = useState(0)

    let navigate = useNavigate()
    useEffect(() => {
        console.log("Signup Test")
        let authToken = sessionStorage.getItem('Auth-key')
        if(authToken){
            navigate('/home')
        }
    },[count])

    const signup = async ()=>{
        setCount((count) => count + 1);
        if( password !== confirmPassword ){
            alert('Password and Confirm Password not matched!!')
        }else {
            try{
               const user = await createUserWithEmailAndPassword(auth,email,password);
               sessionStorage.setItem('Auth-key',user._tokenResponse.refreshToken)
               console.log(user)
               alert("User Signup successfully!!")
               navigate('/home')
            }catch(error){
                console.log(error.message)
                alert(error.message)
            }
        }
    };

    return (
     <div className='signup'>
        <Container maxWidth="sm" className="Signup-container">
            <h2 className='center'>Sign Up</h2> 
            {/* <form noValidate> */}
                <TextField variant="outlined" margin="normal" label="Enter Email" autoComplete="off"
                    value={email} onChange={(event)=>{setEmail(event.target.value)}} required fullWidth/>

                <TextField variant="outlined" margin="normal" label="Enter Password" autoComplete="off" type="password"
                    value={password} onChange={(event)=>{setPassword(event.target.value)}} required fullWidth/>

                <TextField variant="outlined" margin="normal" label="Re-Enter Password" autoComplete="off" type="password"
                    value={confirmPassword} onChange={(event)=>{setConfirmPassword(event.target.value)}} required fullWidth/>    

                <Button type="submit" variant="contained" color="primary"  className="btn" fullWidth onClick={signup}
                    disabled = {!email || !password}> Signup </Button>
            {/* </form> */}
        </Container>    
     </div>
    );
}
export default Signup