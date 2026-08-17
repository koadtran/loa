function Post (props) {
    const {post} = props;
    const {author, createdAt, content, _count} = post;
    return (
        <div>
            <p>{author.username}</p>
            <p>{createdAt}</p>
            <p>{content}</p>
            <p>Likes: {_count.likes}, comments: {_count.comments} </p>
        </div>
    )
}

export default Post;