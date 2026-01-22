export function LogoButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
            {/* Logo: Plate with 15 and utensils */}
            <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute w-12 h-12 border-4 border-[#3d3226] rounded-full" />
                <div className="absolute w-9 h-9 border-2 border-[#d4cbbf] rounded-full" />

                <span className="text-[#3d3226] font-bold text-sm relative z-10">
                    15
                </span>

                <div className="absolute -bottom-1 flex gap-0.5 items-end">
                    <div className="w-0.5 h-5 bg-[#3d3226] rounded-full" />
                    <div className="w-0.5 h-5 bg-[#3d3226] rounded-full" />
                    <div className="flex flex-col items-center ml-1">
                        <div className="w-2 h-2.5 bg-[#3d3226] rounded-full" />
                        <div className="w-1 h-3 bg-[#3d3226] rounded-full -mt-0.5" />
                    </div>
                </div>
            </div>

            <span className="text-2xl font-serif text-[#3d3226]">
                십오분:식탁
            </span>
        </button>
    );
}
