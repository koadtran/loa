import {useNavigate} from 'react-router';
import styles from './Post.module.css';

function formatTimeAgo(dateString) {
    const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(dateString).toLocaleDateString();
}

function Post(props) {
    const navigate = useNavigate();
    const {post} = props;
    const {author, createdAt, content, _count } = post;

    const timeAgo = formatTimeAgo(createdAt);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.author} onClick={() => navigate(`/user/${author.username}`)}>{author.username}</p>
                <p className={styles.timestamp}>{timeAgo}</p>
            </div>
            <p className={styles.content}>{content}</p>
            <div className={styles.interaction}>
                <div className={styles.action}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" /></svg>
                    <p>{_count.likes}</p>
                </div>
                <div className={styles.action}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" /></svg>
                    <p>{_count.comments}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;