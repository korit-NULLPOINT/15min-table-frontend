import { IconButton, Box, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

/**
 * @param {string|number} id - Target Item ID
 * @param {Function} onConfirm - Confirm Handler
 * @param {string|number|null} confirmingId - Currently confirming ID
 * @param {Function} setConfirmingId - Setter for confirming ID
 * @param {React.ReactNode} icon - Default Icon Component
 * @param {string} title - Tooltip Title
 * @param {string} message - Confirm Message
 * @param {'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning'} color - Button Color Theme
 */
export function ActionConfirmButton({
    id,
    onConfirm,
    confirmingId,
    setConfirmingId,
    icon,
    title,
    message,
    color = 'error',
}) {
    const isConfirming = confirmingId === id;

    const handleClickAction = (e) => {
        e.stopPropagation();
        if (isConfirming) {
            // Cancel
            setConfirmingId(null);
        } else {
            // Start Confirming
            setConfirmingId(id);
        }
    };

    const handleConfirm = (e) => {
        e.stopPropagation();
        onConfirm(id);
    };

    // Color Mapping
    const colorMap = {
        error: {
            main: '#d32f2f',
            light: '#ef9a9a',
            bg: '#ffebee',
            hover: '#ffcdd2',
        },
        success: {
            main: '#2e7d32',
            light: '#a5d6a7',
            bg: '#e8f5e9',
            hover: '#c8e6c9',
        },
        primary: {
            main: '#1976d2',
            light: '#90caf9',
            bg: '#e3f2fd',
            hover: '#bbdefb',
        },
        // Add more if needed
    };

    const theme = colorMap[color] || colorMap.error;

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-block',
                width: 40,
                height: 40,
            }}
        >
            <Box
                className="action-confirm-box"
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: isConfirming ? theme.bg : 'transparent',
                    borderRadius: '24px',
                    border: isConfirming
                        ? `1px solid ${theme.light}`
                        : '1px solid transparent',
                    transition: 'all 0.4s ease',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: isConfirming ? '260px' : '40px', // Enough width for dynamic messages
                    width: isConfirming ? 'auto' : '40px',
                    minWidth: isConfirming ? '260px' : '40px',
                    padding: isConfirming ? '0 4px 0 12px' : '0',
                    zIndex: isConfirming ? 10 : 1,
                    boxShadow: isConfirming
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : 'none',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: theme.main,
                        opacity: isConfirming ? 1 : 0,
                        transition: 'opacity 0.3s ease 0.1s',
                        mr: 1,
                        fontWeight: 'bold',
                        display: isConfirming ? 'flex' : 'none',
                        alignItems: 'center',
                    }}
                >
                    {message}
                    <IconButton
                        size="small"
                        onClick={handleConfirm}
                        sx={{
                            ml: 0.5,
                            color: '#2e7d32', // Check is always green
                            '&:hover': {
                                bgcolor: '#e8f5e9',
                            },
                        }}
                    >
                        <CheckIcon fontSize="small" />
                    </IconButton>
                </Typography>
                <IconButton
                    onClick={handleClickAction}
                    className={isConfirming ? 'animate-shake' : ''}
                    sx={{
                        color: theme.main,
                        border: isConfirming
                            ? 'none'
                            : `1px solid ${theme.light}`,
                        bgcolor: isConfirming ? 'transparent' : theme.bg,
                        '&:hover': {
                            bgcolor: theme.hover,
                        },
                        p: 1,
                        minWidth: '34px',
                    }}
                    size="small"
                    title={isConfirming ? '취소' : title}
                >
                    {/* Render Icon (If confirming, maybe show close icon? Or just click same icon to close) */}
                    {/* Design choice: Let's reuse the Passed Icon for the button, 
                        BUT if confirming, maybe rotate it or change it? 
                        Previous design used CloseIcon. Let's pass CloseIcon optionally or just use CloseIcon when confirming.
                    */}
                    {/* To keep it flexible, let's just toggle icon if needed, 
                        but for now, consistency with previous DeletedConfirmButton:
                        It swapped DeleteIcon with CloseIcon.
                    */}
                    {/* For general use, let's assume the Passed Icon is the "Action" icon. 
                        When confirming, the button becomes "Cancel". 
                        So showing an 'X' (CloseIcon) is appropriate. 
                    */}
                    {isConfirming ? (
                        // Import CloseIcon locally or pass it? Better import it
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        icon
                    )}
                </IconButton>
            </Box>
        </Box>
    );
}
