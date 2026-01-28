// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// value: 감시할 값 (검색어), delay: 기다릴 시간 (밀리초)
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 1. delay 시간이 지나면 값을 업데이트하도록 타이머 설정
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 2. 만약 delay 시간이 지나기 전에 value가 또 바뀌면?
        //    기존 타이머를 취소(clear)해버림! -> 리셋 효과
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
