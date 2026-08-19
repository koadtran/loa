import {useState} from "react";
import {useNavigate} from 'react-router';
import styles from './UserCard.module.css';

function UserCard({user}) {
    const navigate = useNavigate();
    return (
        <div className={styles.userCard} onClick={e => navigate(`/user/${user.username}`)}>
            <p>{`@${user.username}`}</p>
            <button className={styles.button}>Follow</button>
        </div>
    )
}
export default UserCard;