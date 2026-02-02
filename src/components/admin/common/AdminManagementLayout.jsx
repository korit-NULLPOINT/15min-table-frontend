import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

/**
 * @param {string} title - Page Title
 * @param {string} description - Page Description
 * @param {string} searchQuery - Search Input Value
 * @param {Function} setSearchQuery - Search Input Setter
 * @param {string} searchPlaceholder - Placeholder for Search Input
 * @param {React.ReactNode} tableHead - Table Head Component (<TableRow>...</TableRow>)
 * @param {React.ReactNode} tableBody - Table Body Component ({items.map(...)})
 * @param {boolean} isLoading - Loading State
 * @param {Error} error - Error State
 * @param {boolean} isEmpty - Empty State
 * @param {React.RefObject} observerRef - Intersection Observer Ref for Infinite Scroll
 * @param {boolean} isFetchingNextPage - Fetching Next Page State
 */
export function AdminManagementLayout({
    title,
    description,
    searchQuery,
    setSearchQuery,
    searchPlaceholder = '검색',
    tableHead,
    tableBody,
    isLoading,
    error,
    isEmpty,
    observerRef,
    isFetchingNextPage,
    children,
}) {
    return (
        <Box sx={{ p: 3, maxWidth: 1440, margin: '0 auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontFamily: 'serif',
                        color: '#3d3226',
                        mb: 1,
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b5d4f' }}>
                    {description}
                </Typography>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 4, maxWidth: 480 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#6b5d4f' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d4cbbf',
                                borderWidth: 2,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3d3226',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3d3226',
                            },
                        },
                    }}
                />
            </Box>

            {/* Table */}
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    border: '2px solid #d4cbbf',
                    boxShadow: 'none',
                }}
            >
                <TableContainer
                    sx={{
                        maxHeight: 600,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#d4cbbf',
                            borderRadius: '4px',
                        },
                    }}
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>{tableHead}</TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <CircularProgress
                                            sx={{ color: '#3d3226' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        align="center"
                                        sx={{ py: 4, color: 'error.main' }}
                                    >
                                        에러가 발생했습니다: {error.message}
                                    </TableCell>
                                </TableRow>
                            ) : isEmpty ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        align="center"
                                        sx={{ py: 8, color: '#6b5d4f' }}
                                    >
                                        데이터가 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tableBody
                            )}

                            {/* Sentinel Row */}
                            {observerRef && (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        padding="none"
                                        sx={{ borderBottom: 'none' }}
                                    >
                                        <Box
                                            ref={observerRef}
                                            sx={{
                                                height: 40,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {isFetchingNextPage && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    더 불러오는 중...
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Footer / Children (e.g. Pagination) */}
            {children && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}
