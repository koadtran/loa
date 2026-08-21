import {useState} from 'react';
import styles from './CommentSection.module.css';
import formatTimeAgo from '../../utils/formatTimeAgo';

function CommentSection({post}) {
    const [commentArr, setCommentArr] = useState(comments || []);
    const [commentContent, setCommentContent] = useState("");
    const [showComments, setShowComments] = useState(false);

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
        <>
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
        </>
    )
}

