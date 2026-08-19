import {useAuth} from '../../context/useAuth'; 
import {useNavigate} from 'react-router';
import styles from './Navbar.module.css';

function Navbar() {
    const {setUser} = useAuth();
    const navigate = useNavigate();

    async function handleLogout(e) {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            if (!res.ok) {
                console.log((await res.json()).status);
            } else {
                setUser(null);
                navigate('/login');
            }
        } catch (err) {
            console.log('Network error');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.option} onClick={() => navigate('/')}>
                <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-120v-720h720v720H120Zm600-160H240v60h480v-60Zm-480-60h480v-60H240v60Zm0-140h480v-240H240v240Zm0 200v60-60Zm0-60v-60 60Zm0-140v-240 240Zm0 80v-80 80Zm0 120v-60 60Z"/></svg>
                <p className={styles.buttonName}>Feed</p>
            </div>
            <div className={styles.option} onClick={() => navigate('/people')}>
                <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm466 0q-47 47-113 47-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-240Zm0-400Z"/></svg>
                <p className={styles.buttonName}>People</p>
            </div>
            <div className={styles.option} onClick={() => navigate('/user')}>
                <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                <p className={styles.buttonName}>Account</p>
            </div>
            <button className={`${styles.logout} ${styles.option}`} onClick={handleLogout}>
                <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                <p className={styles.buttonName}>Log out</p>
            </button>
        </div>
    )
}

export default Navbar;