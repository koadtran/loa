import {useState} from 'react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import Post from '../post/Post';
import NewPost from '../newpost/NewPost';
import styles from './Feed.module.css';

export default function Feed() {
    const [posts, setPosts] = useState(null);
    const [newPost, setNewPost] = useState(false);
    const navigate = useNavigate();

    async function fetchPosts() {
        try {
            const res = await fetch('/api/posts', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            })
            if (res.status === 401) {
                navigate('/login');
                return
            }
            const postsArr = await res.json();
            setNewPost(false);
            setPosts(postsArr);
            
        } catch (err) {
            console.log('Network error');
        }
    }

    useEffect(() => {fetchPosts()},[newPost]);

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>    
            {posts && <ul className={styles.list}>
                <NewPost postNew={setNewPost} />
                {posts.map(post => <li key={post.id}><Post post={post}/></li>)}
            </ul>}
        </div>
    )
}