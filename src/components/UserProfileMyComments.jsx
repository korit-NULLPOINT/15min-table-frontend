import { Trash2 } from 'lucide-react';

export default function UserProfileMyComments({
  myComments,
  onDeleteComment,
  onRecipeClick,
  onCommunityPostClick,
}) {
  return (
    <div className="p-8">
      <h3 className="text-xl mb-6 text-[#3d3226]">내가 작성한 댓글</h3>

      <div className="space-y-4">
        {myComments.length > 0 ? (
          myComments.map((comment) => (
            <div
              key={comment.id}
              className="relative p-4 bg-[#ebe5db] rounded-lg border-2 border-[#d4cbbf] hover:border-[#3d3226] transition-colors"
            >
              <div
                onClick={() => {
                  if (comment.type === 'recipe') onRecipeClick?.(comment.postId);
                  if (comment.type === 'community') onCommunityPostClick?.(comment.postId);
                }}
                className="cursor-pointer pr-10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      comment.type === 'recipe'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    }`}
                  >
                    {comment.type === 'recipe' ? '📋 레시피' : '💬 커뮤니티'}
                  </span>
                  <span className="text-sm text-[#6b5d4f]">
                    게시글:{' '}
                    <span className="text-[#3d3226] font-medium">
                      {comment.postTitle}
                    </span>
                  </span>
                </div>
                <p className="text-[#3d3226] mb-2">{comment.comment}</p>
                <p className="text-xs text-[#6b5d4f]">{comment.date}</p>
              </div>

              <button
                onClick={(e) => onDeleteComment(comment.id, e)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
                title="댓글 삭제"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-[#6b5d4f] py-8">
            작성한 댓글이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
