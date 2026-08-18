import {useState} from 'react';
import {useNavigate} from 'react-router';
import {Link} from 'react-router';
import {useAuth} from '../../context/useAuth';
import styles from './Login.module.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUser} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({username, password}),
            });
            if (!res.ok) {
                setError((await res.json()).error);
            } else {
                const user = await res.json();
                setUser(user);
                console.log("Logged in:", user.username);
                navigate('/');
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.photo}></div>
            <div className={styles.page}>
                <div className={styles.logowrapper}>
                    <p className={styles.wordmark}>Loa</p>
                    <p className={styles.slogan}>where everyone gets a megaphone</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <p className={styles.error}>{error}</p>}
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={username} onChange={e => {setUsername(e.target.value); setError(null);}}/>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={e => {setPassword(e.target.value); setError(null);}}/>
                    <button type="submit">{loading? 'Logging in' : 'Log in'}</button>
                    <p className={styles.linkwrapper}>New to Loa? <Link to='/signup' className={styles.link}>Sign up</Link></p>
                </form>
            </div>
        </div>
    )
}
export default Login;