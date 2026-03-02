import type { Comment as CommentType } from '../types';
import './Comment.css';

interface CommentProps {
  comment: CommentType;
}

export function Comment({ comment }: CommentProps) {
  return (
    <div className="comment">
      <div className="comment-avatar">
        {comment.author.charAt(0)}
      </div>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-date">{comment.createdAt}</span>
        </div>
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
}
