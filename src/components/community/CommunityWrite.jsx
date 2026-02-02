import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    FormControl,
    FormLabel,
    Container,
} from '@mui/material';
import { ArrowLeft, Upload, LoaderCircle, X } from 'lucide-react';
import { useGetBoardList } from '../../apis/generated/board-controller/board-controller';
import { useAddPost } from '../../apis/generated/post-controller/post-controller';
import { usePrincipalState } from '../../store/usePrincipalState';

export function CommunityWrite({ onNavigate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [freeBoardId, setFreeBoardId] = useState(null);
    const fileInputRef = useRef(null);
    const principal = usePrincipalState((s) => s.principal);

    // API Hooks
    const { mutateAsync: addPost } = useAddPost();
    const { data: boardListData } = useGetBoardList({
        query: { refetchOnWindowFocus: false },
    });

    console.log(boardListData?.data);

    // Find Free Board ID
    useEffect(() => {
        if (boardListData?.data?.data) {
            const boards = boardListData.data.data;
            const freeBoard = boards.find(
                (b) =>
                    b.boardType?.boardTypeName === 'POST' ||
                    b.boardType?.boardTypeName === 'FREE' ||
                    b.boardType?.boardTypeNameKor === '자유게시판' ||
                    b.title.includes('자유') ||
                    b.boardTypeId === 2,
            );
            if (freeBoard) {
                setFreeBoardId(freeBoard.boardId);
            }
        }
    }, [boardListData]);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        if (!freeBoardId) {
            alert('게시판 정보를 불러오지 못했습니다.');
            return;
        }

        if (!principal) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            // Firebase API 키 미설정으로 인해 Picsum URL 사용
            // 실제 이미지 파일이 있어도 업로드가 실패할 것이므로 Picsum random URL로 대체
            // 또는 이미지가 없을 때도 Random URL 사용
            let finalImageUrl = '';

            if (imagePreview) {
                // 이미지를 선택했더라도 키 문제로 업로드 불가 -> 랜덤 이미지로 대체
                // 시드값을 난수로 주어 매번 다른 이미지처럼 보이게 함
                finalImageUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/800/600`;
            } else {
                // 이미지가 없으면 굳이 넣지 않음 (또는 요청대로 무조건 넣을 수도 있음)
                finalImageUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/800/600`;
            }

            const reqDto = {
                title,
                content,
                imgUrls: finalImageUrl ? [finalImageUrl] : [],
            };

            await addPost({
                boardId: freeBoardId,
                data: reqDto,
            });

            alert('게시글이 등록되었습니다!');
            onNavigate('community');
        } catch (error) {
            console.error('Post creation failed:', error);
            alert('게시글 등록에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f1eb] pt-16 p-6">
            <div className="max-w-4xl mx-auto">
                <Box sx={{ maxWidth: 896, mx: 'auto', py: 6, px: 3 }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => onNavigate('community')}
                        sx={{
                            mb: 3,
                            color: '#6b5d4f',
                            borderColor: '#6b5d4f',
                            '&:hover': {
                                bgcolor: 'rgba(107, 93, 79, 0.08)',
                                borderColor: '#3d3226',
                                color: '#3d3226',
                            },
                        }}
                        variant="outlined"
                    >
                        돌아가기
                    </Button>

                    <Paper
                        elevation={3}
                        sx={{
                            borderRadius: 2,
                            border: '2px solid #e5dfd5',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                bgcolor: '#3d3226',
                                color: '#f5f1eb',
                                px: 4,
                                py: 3,
                            }}
                        >
                            <Typography
                                variant="h5"
                                component="h1"
                                sx={{ mb: 1 }}
                            >
                                커뮤니티 글쓰기
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                자유롭게 이야기를 나눠보세요
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box
                            sx={{
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            {/* Title */}
                            <FormControl fullWidth>
                                <FormLabel
                                    sx={{
                                        mb: 1,
                                        color: '#3d3226',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    제목
                                </FormLabel>
                                <TextField
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력하세요"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d4cbbf',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3d3226',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3d3226',
                                            },
                                        },
                                    }}
                                />
                            </FormControl>

                            {/* Content */}
                            <FormControl fullWidth>
                                <FormLabel
                                    sx={{
                                        mb: 1,
                                        color: '#3d3226',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    내용
                                </FormLabel>
                                <TextField
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="내용을 입력하세요..."
                                    multiline
                                    rows={10}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#d4cbbf',
                                                borderWidth: 2,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#3d3226',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#3d3226',
                                            },
                                        },
                                    }}
                                />
                            </FormControl>

                            {/* Image Upload */}
                            <Box>
                                <FormLabel
                                    sx={{
                                        mb: 1,
                                        display: 'block',
                                        color: '#3d3226',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    이미지 (API 미설정으로 랜덤 이미지가
                                    등록됩니다)
                                </FormLabel>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<Upload size={20} />}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    sx={{
                                        bgcolor: '#3d3226',
                                        '&:hover': { bgcolor: '#5d4a36' },
                                        py: 1.5,
                                        px: 3,
                                        color: '#f5f1eb',
                                    }}
                                >
                                    이미지 선택
                                </Button>

                                {imagePreview && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            position: 'relative',
                                            width: 'fit-content',
                                        }}
                                    >
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                height: 200,
                                                borderRadius: 8,
                                                border: '2px solid #d4cbbf',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <Button
                                            onClick={removeImage}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                minWidth: 'auto',
                                                p: 0.5,
                                                bgcolor:
                                                    'rgba(239, 68, 68, 0.9)',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#dc2626',
                                                },
                                                borderRadius: '50%',
                                            }}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 2,
                                    mt: 2,
                                    bgcolor: '#3d3226',
                                    fontSize: '1.1rem',
                                    '&:hover': { bgcolor: '#5d4a36' },
                                    color: '#f5f1eb',
                                    fontWeight: 'bold',
                                }}
                            >
                                게시글 등록하기
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </div>
        </div>
    );
}
