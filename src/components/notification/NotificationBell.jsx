import { Bell } from 'lucide-react';

export function NotificationBell({ onClick, count }) {
    return (
        <button
            onClick={onClick}
            className={[
                'relative',
                'cursor-pointer',
                'p-2 -m-2',
                'rounded-full',
                'transition-all duration-150',
                'hover:bg-[#ebe5db]',
                'active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-[#3d3226]/30',
            ].join(' ')}
            aria-label="알림"
        >
            <Bell size={25} className="text-[#3d3226]" />
            {count > 0 && (
                <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {count}
                </div>
            )}
        </button>
    );
}
