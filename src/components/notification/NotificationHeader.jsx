import { CheckCheck } from 'lucide-react';

export function NotificationHeader({ tab, setTab, onMarkAll, hasUnread }) {
    return (
        <div className="p-4 border-b-2 border-[#d4cbbf] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <h3 className="text-xl font-serif text-[#3d3226] shrink-0">
                    알림
                </h3>

                {/* Tabs */}
                <div className="flex items-center bg-white border-2 border-[#d4cbbf] rounded-md overflow-hidden shrink-0">
                    <button
                        type="button"
                        onClick={() => setTab('UNREAD')}
                        className={[
                            'px-3 py-1.5 text-xs font-medium transition-colors',
                            tab === 'UNREAD'
                                ? 'bg-[#3d3226] text-[#f5f1eb]'
                                : 'bg-white text-[#3d3226] hover:bg-[#ebe5db]',
                        ].join(' ')}
                    >
                        미읽음
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('READ')}
                        className={[
                            'px-3 py-1.5 text-xs font-medium transition-colors border-l-2 border-[#d4cbbf]',
                            tab === 'READ'
                                ? 'bg-[#3d3226] text-[#f5f1eb]'
                                : 'bg-white text-[#3d3226] hover:bg-[#ebe5db]',
                        ].join(' ')}
                    >
                        읽음
                    </button>
                </div>

                {tab === 'READ' && (
                    <span className="text-[11px] text-[#6b5d4f] shrink-0">
                        최근 14일
                    </span>
                )}
            </div>

            {/* Mark all (UNREAD only) */}
            {tab === 'UNREAD' && hasUnread && (
                <button
                    onClick={onMarkAll}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md text-xs font-medium shadow-sm"
                >
                    <CheckCheck size={14} />
                    <span>모두 읽기</span>
                </button>
            )}
        </div>
    );
}
