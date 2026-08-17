import {useState} from 'react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router';

import Post from '../post/Post';

export default function Feed() {
    const [posts, setPosts] = useState(null);
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
            setPosts(postsArr);
            
        } catch (err) {
            console.log('Network error');
        }
    }

    useEffect(() => {fetchPosts()},[]);

    async function handleLogout(e) {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            });
            if (!res.ok) {
                console.log((await res.json()).status);
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.log('Network error');
        }
    }

    return (
        <>    
            {posts && <ul>{posts.map(post => <li key={post.id}><Post post={post}/></li>)}</ul>}
            <button onClick={handleLogout}>Log out</button>
        </>
    )
}