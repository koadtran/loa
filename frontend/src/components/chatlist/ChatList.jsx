import {useNavigate} from 'react-router';
import {useAuth} from '../../context/useAuth';
import formatTimeAgo from '../../utils/formatTimeAgo';
import styles from './ChatList.module.css';

function ChatList({conversations}) {
    const navigate = useNavigate();
    const {user: currentUser} = useAuth();
    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>
            {conversations && (
                <ul className={styles.list}>
                    {conversations.map(conversation => {
                        const lastMessage = conversation.messages[0];
                        return (
                            <li
                                key={conversation.id}
                                className={styles.item}
                                onClick={() => navigate(`/messages/${conversation.id}`)}
                            >
                                <p className={styles.participants}>
                                    {conversation.participants
                                        .filter(p => p.user.id !== currentUser.id)
                                        .map(p => `@${p.user.username}`)
                                        .join(', ')}
                                </p>
                                {lastMessage ? (
                                    <div className={styles.preview}>
                                        <span className={styles.previewContent}>{lastMessage.content}</span>
                                        <span className={styles.previewTimestamp}>{formatTimeAgo(lastMessage.createdAt)}</span>
                                    </div>
                                ) : (
                                    <p className={styles.emptyPreview}>No messages yet</p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    )
}

export default ChatList;