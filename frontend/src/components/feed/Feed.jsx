import {useState} from 'react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router';
import Post from '../post/Post';
import NewPost from '../newpost/NewPost';
import styles from './Feed.module.css';

export default function Feed() {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
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
                return;
            }
            const postsArr = await res.json();
            setPosts(postsArr);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {fetchPosts()},[]);

    return (
        <div className={`${styles.container} ${styles.hideScrollbar}`}>    
            {loading && <p className={styles.loading}>Loading…</p>}
            {!loading && posts && (
                <ul className={styles.list}>
                    <NewPost setPosts={setPosts} />
                    {posts.length === 0 ? (
                        <li className={styles.empty}>No posts yet. Follow some people, or write the first one!</li>
                    ) : (
                        posts.map(post => <li key={post.id}><Post post={post} /></li>)
                    )}
                </ul>
            )}
        </div>
    )
}