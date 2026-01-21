export default function UserProfileBookmarks({ myFavorites, onRecipeClick }) {
    return (
        <div className="p-8">
            <h3 className="text-xl mb-6 text-[#3d3226]">저장한 게시물</h3>

            <div className="grid grid-cols-2 gap-4">
                {myFavorites.length > 0 ? (
                    myFavorites.map((favorite) => (
                        <div
                            key={favorite.id}
                            onClick={() => onRecipeClick?.(favorite.id)}
                            className="cursor-pointer bg-white rounded-lg overflow-hidden border-2 border-[#e5dfd5] hover:border-[#3d3226] transition-colors"
                        >
                            <img
                                src={favorite.thumbnail}
                                alt={favorite.title}
                                className="w-full aspect-video object-cover"
                            />
                            <div className="p-4">
                                <h4 className="text-lg text-[#3d3226]">
                                    {favorite.title}
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
