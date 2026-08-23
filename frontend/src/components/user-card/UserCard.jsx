import {useState} from "react";
import {useNavigate} from 'react-router';
import styles from './UserCard.module.css';

function UserCard({user, handleFollowChange}) {
    const navigate = useNavigate();
    const [followed, setFollowed] = useState(user.followed);

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
            handleFollowChange(user.username, true);
            setFollowed(true);
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
            handleFollowChange(user.username, false);
            setFollowed(false);
        } catch (err) {
            console.log(err);
        }
    } 

    const handleFollowClick = followed ? handleUnfollow : handleFollow;

    async function handleMessageClick() {
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

    return (
        <div className={styles.userCard}>
            <p onClick={() => navigate(`/user/${user.username}`)}>{`@${user.username}`}</p>
            <div>
                <button className={`${styles.button} ${followed? styles.unfollow : ""}`} onClick={handleFollowClick}>{followed ? 'Unfollow' : 'Follow'}</button>
                <button className={`${styles.messagebutton}`} onClick={handleMessageClick}>Message</button>
            </div>
        </div>
    )
}
export default UserCard;

// onClick={e => navigate(`/user/${user.username}`)}