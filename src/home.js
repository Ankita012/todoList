import { useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { auth } from './firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import TodoDashboard from './TodoDashboard';
import './home.css'

function Home() {
    const [user, setUSer] = useState({})
    const [count, setCount] = useState(0)
    onAuthStateChanged(auth, (currentUser) => {
        setUSer(currentUser)
    })

    let navigate = useNavigate()
    useEffect(() => {
        console.log("Home Test")
        let authToken = sessionStorage.getItem('Auth-key')
        if(authToken) {
            navigate('/home')
        }
        if(!authToken) {
            navigate('/login')
        }
    },[count])

    const logOut = async () => {
        setCount((count) => count + 1);
        sessionStorage.removeItem('Auth-key')
        await signOut(auth)
        navigate('/login')
    }
    return (
     <div className='login'> 

        <AppBar position="static">
            <Toolbar className='navbar'>
                <div>Todo List App</div>
                <div className="user-name">
                    <div className="email">{user?.email}</div>
                    <button className="logout-btn" onClick={logOut}>Log Out</button>
                </div>
            </Toolbar>
        </AppBar>

        <TodoDashboard user={user}/>

     </div>
    );
}
export default Home