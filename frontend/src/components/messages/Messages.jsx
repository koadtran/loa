import {useState} from 'react';
import {useEffect} from 'react';
import ChatList from '../chatlist/ChatList';
import {Outlet} from 'react-router';
import {useNavigate} from 'react-router';
import styles from './Messages.module.css';

function Messages() {
    const [conversations, setConversations] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    async function fetchConversations() {
        try {
            const res = await fetch('/api/conversations', {credentials: 'include'});
            if (res.status === 401) {
                navigate('/login');
                return;
            }
            if (!res.ok) {
                return;
            }
            setConversations(await res.json());
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {fetchConversations()}, []);

    function handleNewMessage(conversationId, message) {
        setConversations(prev => {
            let hasNewMessage;
            const filtered = prev.filter(conversation => {
                if (conversation.id !== conversationId) {
                    return true;
                } else {
                    hasNewMessage = {
                        ...conversation,
                        messages: [message]
                    }
                    return false;
                }
            });
            return [hasNewMessage, ...filtered]
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.chatlist}>
                <ChatList conversations={conversations} />
            </div>
            <div className={styles.chat}>
                <Outlet context={{onNewMessage: handleNewMessage, conversations}}/>
            </div>
        </div>
    )
}

export default Messages;