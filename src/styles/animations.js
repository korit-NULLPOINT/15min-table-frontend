import { keyframes } from '@mui/material';

export const shake = keyframes`
    0%, 100% { transform: rotate(0deg) scale(1); }
    20% { transform: rotate(-10deg) scale(1.13); }
    40% { transform: rotate(10deg) scale(1.1); }
    60% { transform: rotate(-5deg) scale(1.06); }
    80% { transform: rotate(5deg) scale(1.03); }
`;
