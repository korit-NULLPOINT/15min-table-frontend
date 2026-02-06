import { useState, useRef, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { toast } from 'react-toastify';
import {
    Box,
    Button,
    TextField,
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
import {
    paperContainerStyles,
    formLabelStyles,
    textFieldStyles,
    mdEditorWrapperStyles,
    primaryButtonStyles,
    submitButtonStyles,
    imageLabelStyles,
} from './CommunityStyles';

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
            toast.error('제목과 내용을 입력해주세요.');
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

            toast.success('게시글이 수정되었습니다!');
            onNavigate('detail', postId);
        } catch (error) {
            console.error('Post modification failed:', error);
            toast.error('게시글 수정에 실패했습니다.');
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
        <Paper elevation={3} sx={paperContainerStyles}>
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
                        <FormLabel sx={formLabelStyles}>제목</FormLabel>
                        <TextField
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            variant="outlined"
                            sx={textFieldStyles}
                        />
                    </FormControl>

                    {/* Content */}
                    <FormControl fullWidth>
                        <FormLabel sx={formLabelStyles}>내용</FormLabel>
                        <Box data-color-mode="light" sx={mdEditorWrapperStyles}>
                            <MDEditor
                                value={content}
                                onChange={(val) => setContent(val || '')}
                                height={275}
                                preview="live"
                                textareaProps={{
                                    placeholder: '내용을 입력하세요...',
                                }}
                            />
                        </Box>
                    </FormControl>

                    {/* Image Upload */}
                    <Box>
                        <FormLabel sx={imageLabelStyles}>이미지</FormLabel>
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
                                ...primaryButtonStyles,
                                py: 1,
                                px: 3,
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
                        sx={submitButtonStyles}
                    >
                        게시글 수정하기
                    </Button>
                </Box>
            </ScrollIndicatorWrapper>
        </Paper>
    );
}
