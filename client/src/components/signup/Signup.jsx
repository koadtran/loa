import {useState} from 'react';
import {useNavigate} from 'react-router';
import {Link} from 'react-router';
import styles from './Signup.module.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const passwordsMatch = password === confirmPassword;
    const showMismatchWarning = confirmPassword.length > 0 && !passwordsMatch;

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!passwordsMatch) {
            // setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({username, password}),
            });
            if (!res.ok) {
                setError((await res.json()).error);
            } else {
                const user = await res.json();
                console.log("Log in:", user);
                navigate('/feed');
            }
        } catch (err) {
            setError('Network error');
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
                        {showMismatchWarning && <p className={styles.error}>Passwords do not match</p>}
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={e => {setPassword(e.target.value); setError(null);}}/>
                        <label htmlFor="confirm-password">Confirm password</label>
                        <input type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value); setError(null)}}/>
                        <button type="submit">{loading? 'Signing up' : 'Sign up'}</button>
                        <p className={styles.linkwrapper}>Already have an account? <Link to='/login' className={styles.link}>Log in</Link></p>       
                    </form>
                </div>
            </div>
    )
}

export default Signup;