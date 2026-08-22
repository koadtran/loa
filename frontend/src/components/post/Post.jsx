import {useState} from 'react';
import {useNavigate} from 'react-router';
import styles from './Post.module.css';
import formatTimeAgo from '../../utils/formatTimeAgo';

function Post(props) {
    const navigate = useNavigate();
    const {post} = props;
    const {author, createdAt, content, _count, comments, liked: likedByMe} = post;

    const [liked, setLiked] = useState(likedByMe);
    const [likeCount, setLikeCount] = useState(_count.likes);
    const [commentArr, setCommentArr] = useState(comments || []);
    const [commentContent, setCommentContent] = useState("");
    const [showComments, setShowComments] = useState(false);

    const timeAgo = formatTimeAgo(createdAt);

    async function handleLike() {
        try {
            const res = await fetch(`/api/posts/${post.id}/like`, {
                method: liked? 'DELETE' : 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                return;
            }
            setLiked(prev => !prev);
            setLikeCount(prev => liked? prev - 1 : prev + 1);
        } catch (err) {
            console.log(err);
        }
    } 

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({content: commentContent})
            })
            if (!res.ok) {
                return;
            }
            const newComment = await res.json();
            setCommentArr(prev => [...prev, newComment]);
            setCommentContent('');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p className={styles.author} onClick={() => navigate(`/user/${author.username}`)}>{author.username}</p>
                <p className={styles.timestamp}>{timeAgo}</p>
            </div>
            <p className={styles.content}>{content}</p>
            <div className={styles.interaction}>
                <div className={styles.action} onClick={handleLike}>
                    <svg className={`${styles.icon} ${liked ? styles.liked : ''}`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" /></svg>
                    <p>{likeCount}</p>
                </div>
                <div className={styles.action} onClick={() => setShowComments(prev => !prev)}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" /></svg>
                    <p>{commentArr.length}</p>
                </div>
            </div>
            {!showComments &&
                <ul className={styles.commentList}>
                    {commentArr.slice(-2).map(comment => (
                        <li key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <p className={styles.commentAuthor}>{comment.author.username}</p>
                                <p className={styles.commentTimestamp}>{formatTimeAgo(comment.createdAt)}</p>
                            </div>
                            <p className={styles.commentContentText}>{comment.content}</p>
                        </li>
                    ))}
                </ul>
            }

            {showComments &&
                <ul className={styles.commentList}>
                    {commentArr.map(comment => (
                        <li key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <p className={styles.commentAuthor}>{comment.author.username}</p>
                                <p className={styles.commentTimestamp}>{formatTimeAgo(comment.createdAt)}</p>
                            </div>
                            <p className={styles.commentContentText}>{comment.content}</p>
                        </li>
                    ))}
                </ul>
            }

            {(
                <form className={styles.commentForm} onSubmit={handleSubmit}>
                    <textarea
                        name="content"
                        className={styles.commentInput}
                        placeholder="Write a comment…"
                        value={commentContent}
                        onChange={e => setCommentContent(e.target.value)}
                    ></textarea>
                    <button type="submit" className={styles.sendButton} disabled={commentContent.trim() === ""}>
                        Reply
                    </button>
                </form>
            )}
        </div>
    );
}

export default Post;