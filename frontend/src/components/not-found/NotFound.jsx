import {Link} from 'react-router';
import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className={styles.container}>
            <h1 className={styles.code}>404</h1>
            <p className={styles.message}>This page doesn't exist.</p>
            <Link to="/" className={styles.link}>Go back home</Link>
        </div>
    );
}

export default NotFound;