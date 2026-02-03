import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Fade } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * ScrollIndicatorWrapper Component
 *
 * Wraps a scrollable container and overlays semi-transparent Up/Down arrows
 * based on the scroll position.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The scrollable content
 * @param {Object} [props.sx] - Additional styles for the container Box
 */
export function ScrollIndicatorWrapper({ children, sx = {} }) {
    const containerRef = useRef(null);
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(false);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        // Tolerance for floating point precision issues
        const tolerance = 2;

        setShowUp(scrollTop > tolerance);
        setShowDown(scrollTop + clientHeight < scrollHeight - tolerance);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Check initially
        handleScroll();

        container.addEventListener('scroll', handleScroll);

        // ResizeObserver to handle content changes or window resizing
        const resizeObserver = new ResizeObserver(() => {
            handleScroll();
        });
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [handleScroll]);

    const handleScrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleScrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                ...sx,
            }}
        >
            {/* Scrollable Container */}
            <Box
                ref={containerRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    position: 'relative',
                    // Default scrollbar styling matching project theme
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f5f1eb',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#d4cbbf',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#3d3226',
                    },
                }}
            >
                {children}
            </Box>

            {/* Up Arrow Overlay */}
            <Fade in={showUp}>
                <Box
                    onClick={handleScrollToTop}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        cursor: 'pointer',
                        color: '#3d3226',
                        bgcolor: 'rgba(245, 241, 235, 0.7)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: 'rgba(245, 241, 235, 0.9)',
                            transform: 'translateX(-50%) scale(1.1)',
                        },
                        '&:active': {
                            transform: 'translateX(-50%) scale(0.95)',
                        },
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Box>
            </Fade>

            {/* Down Arrow Overlay */}
            <Fade in={showDown}>
                <Box
                    onClick={handleScrollToBottom}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        cursor: 'pointer',
                        color: '#3d3226',
                        bgcolor: 'rgba(245, 241, 235, 0.7)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: 'rgba(245, 241, 235, 0.9)',
                            transform: 'translateX(-50%) scale(1.1)',
                        },
                        '&:active': {
                            transform: 'translateX(-50%) scale(0.95)',
                        },
                    }}
                >
                    <KeyboardArrowDownIcon />
                </Box>
            </Fade>
        </Box>
    );
}
