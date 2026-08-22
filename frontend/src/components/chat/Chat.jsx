import {useState} from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {useParams} from 'react-router';
import {useNavigate} from 'react-router';
import {useOutletContext} from 'react-router';
import {useAuth} from '../../context/useAuth';
import formatTimeAgo from '../../utils/formatTimeAgo';
import styles from './Chat.module.css';

function Chat() {
    const {id} = useParams();
    const {onNewMessage} = useOutletContext();
    const {user: currentUser} = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState(null);
    const [content, setContent] = useState("");
    const bottomRef = useRef(null);

    async function fetchMessages() {
        try {
            const res = await fetch(`/api/conversations/${id}/messages`, {
                credentials: 'include'
            })
            if (res.status === 401) {
                navigate('/login');
                return;
            }
            if (!res.ok) {
                return;
            }
            setMessages(await res.json());
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (messages && messages.length > 0) {
            bottomRef.current?.scrollIntoView();
        }
    }, [messages]);

    useEffect(() => {
        setMessages(null);
        fetchMessages();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmed = content.trim();
        if (trimmed === '') {
            return;
        }
        try {
            const res = await fetch(`/api/conversations/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({content: trimmed})
            });
            if (!res.ok) {
                return;
            }
            const newMessage = await res.json();
            setMessages(prev => [...prev, newMessage]);
            setContent('');
            onNewMessage(parseInt(id), newMessage);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            <ul className={`${styles.messageList} ${styles.hideScrollbar}`}>
                {messages && messages.map(message => {
                    const isOwn = message.sender.id === currentUser.id;
                    return (
                        <li key={message.id} className={`${styles.bubbleRow} ${isOwn ? styles.own : styles.other}`}>
                            <div className={styles.bubble}>
                                <p className={styles.messageContent}>{message.content}</p>
                                <span className={styles.timestamp}>{formatTimeAgo(message.createdAt)}</span>
                            </div>
                        </li>
                    );
                })}
                <div ref={bottomRef} />
            </ul>

            <form className={styles.form} onSubmit={handleSubmit}>
                <textarea
                    className={styles.input}
                    placeholder="Type a message"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                ></textarea>
                <button type="submit" className={styles.sendButton} disabled={content.trim() === ""}>
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chat;