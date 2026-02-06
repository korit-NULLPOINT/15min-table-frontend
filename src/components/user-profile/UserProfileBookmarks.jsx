import { Bookmark } from 'lucide-react';
import { Box } from '@mui/material';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function UserProfileBookmarks({
    myBookmarkList,
    onRecipeClick,
    recipeList,
}) {
    return (
        <div className="px-8 py-4">
            <div className="h-12 flex items-center mb-4 gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                    <Bookmark size={20} />
                </div>
                <h3 className="text-xl text-[#3d3226]">저장한 게시물</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {myBookmarkList.length > 0 ? (
                    myBookmarkList.map((bookmark) => (
                        <div
                            key={bookmark.recipeId}
                            onClick={() => onRecipeClick?.(bookmark.recipeId)}
                            className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    aspectRatio: '4 / 3',
                                    overflow: 'hidden',
                                    backgroundColor: 'white',
                                }}
                            >
                                <ImageWithFallback
                                    src={
                                        recipeList?.find(
                                            (recipe) =>
                                                recipe.recipeId ==
                                                bookmark.recipeId,
                                        )?.thumbnailImgUrl ||
                                        `https://picsum.photos/seed/${
                                            recipeList?.find(
                                                (recipe) =>
                                                    recipe.recipeId ==
                                                    bookmark.recipeId,
                                            )?.recipeId
                                        }/800/600/`
                                    }
                                    alt={
                                        recipeList?.find(
                                            (recipe) =>
                                                recipe.recipeId ==
                                                bookmark.recipeId,
                                        )?.title
                                    }
                                    className="w-full h-full object-contain"
                                />
                            </Box>
                            <div className="p-4">
                                <h4 className="text-lg text-[#3d3226]">
                                    {
                                        recipeList?.find(
                                            (recipe) =>
                                                recipe.recipeId ==
                                                bookmark.recipeId,
                                        )?.title
                                    }
                                </h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-2 text-center text-[#6b5d4f] py-8">
                        저장한 게시물이 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
}
