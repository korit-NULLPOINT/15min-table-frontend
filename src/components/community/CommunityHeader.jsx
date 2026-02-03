import { Box, Typography } from '@mui/material';

/**
 * CommunityHeader Component
 *
 * Reusable header for community features (List, Detail, Write, Edit).
 *
 * @param {Object} props
 * @param {string} props.title - Main header title
 * @param {string} [props.description] - Description text below the title
 * @param {React.ReactNode} [props.children] - Additional elements (meta info, etc.)
 */
export function CommunityHeader({ title, description, children }) {
    return (
        <Box
            sx={{
                bgcolor: '#3d3226',
                color: '#f5f1eb',
                px: 4,
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            {title && (
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: description || children ? 1 : 0,
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </Typography>
            )}
            {description && (
                <Typography
                    variant="body2"
                    sx={{ color: 'rgba(229, 223, 213, 0.8)' }}
                >
                    {description}
                </Typography>
            )}
            {children}
        </Box>
    );
}
