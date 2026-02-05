import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    FormControl,
    FormLabel,
    CircularProgress,
} from '@mui/material';
import { Upload, X } from 'lucide-react';
import {
    useGetPostDetail,
    useModifyPost,
} from '../../apis/generated/post-controller/post-controller';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CommunityHeader } from './CommunityHeader';
import { ScrollIndicatorWrapper } from '../common/ScrollIndicatorWrapper';

export function CommunityEdit({ postId, boardId, onNavigate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

    // API Hooks
    const { data: postDetail, isLoading } = useGetPostDetail(boardId, postId, {
        query: {
            enabled: !!postId && !!boardId,
            refetchOnWindowFocus: false,
        },
    });

    const { mutateAsync: modifyPost } = useModifyPost();

    // Populate data when loaded
    useEffect(() => {
        if (postDetail?.data?.data) {
            const post = postDetail.data.data;
            setTitle(post.title || '');
            setContent(post.content || '');
            if (post.imgUrls && post.imgUrls.length > 0) {
                setImagePreview(post.imgUrls[0]);
            }
        }
    }, [postDetail]);

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

        try {
            // Firebase API 키 미설정으로 인해 Picsum URL 사용
            // 기존 이미지가 있고 새로 선택하지 않았다면 기존 이미지 사용 (또는 랜덤)
            let finalImageUrl = imagePreview;

            // 만약 새로 파일을 선택했다면 (DataURL 형태라면) 랜덤 이미지로 대체 (키 문제)
            if (imagePreview.startsWith('data:')) {
                finalImageUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/800/600`;
            }

            const reqDto = {
                title,
                content,
                imgUrls: finalImageUrl ? [finalImageUrl] : [],
            };

            await modifyPost({
                boardId,
                postId,
                data: reqDto,
            });

            alert('게시글이 수정되었습니다!');
            onNavigate('detail', postId);
        } catch (error) {
            console.error('Post modification failed:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress color="inherit" sx={{ color: '#3d3226' }} />
            </Box>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 2,
                border: '2px solid #e5dfd5',
                overflow: 'hidden',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
            }}
        >
            {/* Header */}
            <CommunityHeader
                title="커뮤니티 글 수정"
                description="내용을 수정하고 저장 버튼을 눌러주세요."
            />

            {/* Scrollable Form Content */}
            <ScrollIndicatorWrapper>
                <Box
                    sx={{
                        p: 4,
                        flexGrow: 1,
                        bgcolor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
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
                            이미지
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
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                bgcolor: '#3d3226',
                                '&:hover': { bgcolor: '#5d4a36' },
                                py: 1,
                                px: 3,
                                color: '#f5f1eb',
                            }}
                        >
                            이미지 변경
                        </Button>

                        {imagePreview && (
                            <Box
                                sx={{
                                    mt: 2,
                                    position: 'relative',
                                    width: 'fit-content',
                                }}
                            >
                                <ImageWithFallback
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
                                        bgcolor: 'rgba(239, 68, 68, 0.9)',
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
                            py: 1.5,
                            mt: 1.5,
                            bgcolor: '#3d3226',
                            fontSize: '1.1rem',
                            '&:hover': { bgcolor: '#5d4a36' },
                            color: '#f5f1eb',
                            fontWeight: 'bold',
                        }}
                    >
                        게시글 수정하기
                    </Button>
                </Box>
            </ScrollIndicatorWrapper>
        </Paper>
    );
}
