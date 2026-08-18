import {useState} from "react";
import {useAuth} from "../../context/useAuth";
import styles from "./NewPost.module.css";

function NewPost({postNew}) {
    const [content, setContent] = useState('');
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setPosting(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({content}),
            });
            if (!res.ok) {
                setError((await res.json()).error);
            } else {
                postNew(true);
            }
        } catch {
            setError('Network error');
        } finally {
            setContent('');
            setPosting(false);
        }
    } 

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <textarea name="content" id={styles.content} placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)}></textarea>
                {/* <button type="submit" className={`${styles.button} ${content.length === 0? styles.disabled : ""}`} disabled={content.length === 0}>{!posting? 'Post' : 'Posting'}</button> */}
                <button type="submit" className={`${styles.button} ${content.length === 0? styles.disabled : ""}`} disabled={content.length === 0}><svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
            </form>
        </div>
    )
} 

export default NewPost;