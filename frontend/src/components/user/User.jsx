import {useState} from 'react';
import {useEffect} from 'react';
import {useParams} from 'react-router';
import {useAuth} from '../../context/useAuth';
import Post from '../post/Post';
import styles from './User.module.css';

function User() {
    const [user, setUser] = useState(null);
    const {user: currentUser} = useAuth();
    let {username} = useParams();

    if (!username) {
        username = currentUser?.username;
    }

    async function fetchUser() {
        try {
            const res = await fetch(`/api/users/${username}`, {credentials: 'include'});
            if (res.status === 401) {
                return;
            }
            setUser(await res.json());
        } catch (err) {
            console.log('Network error');
        }
    }

    useEffect(() => {fetchUser()},[username, currentUser]);

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>
            {user && <>
                    <div className={styles.nameContainer}><span className={styles.nametag}>{`@${user.username}`}</span></div>
                    <div className={styles.stats}>
                        <div className={styles.number}>
                            <p>{user._count.posts !== 1? "Posts" : "Post"}</p>
                            <p>{user._count.posts}</p>
                        </div>
                        <div className={styles.number}>
                            <p>{user._count.followers !== 1? "Followers" : "Follower"}</p>
                            <p>{user._count.followers}</p>
                        </div>
                        <div className={styles.number}>
                            <p>Following</p>
                            <p>{user._count.following}</p>
                        </div>
                    </div>
                    <ul className={styles.list}>
                        {user.posts.map(post => <li key={post.id}><Post post={post}/></li>)}
                    </ul>
                </>
            }
        </div>
    )
}

export default User;