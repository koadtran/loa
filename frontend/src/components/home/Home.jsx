import Navbar from '../navbar/Navbar';
import styles from './Home.module.css';

function Home({children}) {
    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.children}>{children}</div>
        </div>
    )
}

export default Home;