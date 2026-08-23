import {useState} from 'react';
import {useEffect} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import {useAuth} from '../../context/useAuth';
import Post from '../post/Post';
import styles from './User.module.css';

function User() {
    const [user, setUser] = useState(null);
    const [followed, setFollowed] = useState(false);
    const navigate = useNavigate();
    const {user: currentUser} = useAuth();
    let {username} = useParams();

    if (!username) {
        username = currentUser?.username;
    }

    async function handleFollow(){
        try {
            const res = await fetch(`/api/users/${user.username}/follow`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            if (!res.ok) {
                return;
            }
            setFollowed(true);
            fetchUser();
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUnfollow(){
        try {
            const res = await fetch(`/api/users/${user.username}/follow`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            if (!res.ok) {
                return;
            }
            setFollowed(false);
            fetchUser();
        } catch (err) {
            console.log(err);
        }
    } 

    const handleClick = followed ? handleUnfollow : handleFollow;

    async function fetchUser() {
        try {
            const res = await fetch(`/api/users/${username}`, {credentials: 'include'});
            if (res.status === 401) {
                return;
            }
            const user = await res.json();
            setUser(user);
            setFollowed(user.followed);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleMessage() {
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username: user.username }),
            });
            if (!res.ok) {
                return;
            }
            const conversation = await res.json();
            navigate(`/messages/${conversation.id}`);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {fetchUser()},[username, currentUser]);

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>
            {user && <>
                    <div className={styles.header}>
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
                    </div>
                    {(user.username !== currentUser.username) && <div className={styles.buttons}>
                        <button className={`${styles.followbutton} ${followed? styles.unfollow : ""}`} onClick={handleClick}>{followed ? `Unfollow ${user.username}` : `Follow ${user.username}`}</button>
                        <button className={styles.messagebutton} onClick={handleMessage}>Message</button>
                    </div>}
                    <ul className={styles.list}>
                        {user.posts.map(post => <li key={post.id}><Post post={post}/></li>)}
                    </ul>
                </>
            }
        </div>
    )
}

export default User;