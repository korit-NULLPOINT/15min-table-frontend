/**
 * Community 컴포넌트에서 사용하는 공통 MUI sx 스타일 정의
 */

/**
 * 마크다운 콘텐츠를 렌더링할 때 사용하는 스타일
 * CommunityDetail에서 react-markdown과 함께 사용
 */
export const markdownContentStyles = {
    lineHeight: 1.8,
    '& p': { margin: '0.5em 0', fontSize: '1.0rem' },
    '& h1': {
        fontSize: '2.0rem',
        margin: '1em 0 0.5em',
        fontWeight: 'bold',
        color: '#3d3226',
        borderBottom: '2px solid #d4cbbf',
        paddingBottom: '0.3em',
    },
    '& h2': {
        fontSize: '1.7rem',
        margin: '1em 0 0.5em',
        fontWeight: 'bold',
        color: '#3d3226',
        borderBottom: '1px solid #d4cbbf',
        paddingBottom: '0.2em',
    },
    '& h3': {
        fontSize: '1.4rem',
        margin: '1em 0 0.5em',
        fontWeight: 'bold',
        color: '#3d3226',
    },
    '& h4, & h5, & h6': {
        fontSize: '1.25rem',
        margin: '1em 0 0.5em',
        fontWeight: 'bold',
        color: '#5d4a36',
    },
    '& ul, & ol': {
        fontSize: '1.0rem',
        paddingLeft: '1.5em',
        margin: '0.5em 0',
    },
    '& li': { margin: '0.25em 0' },
    '& code': {
        backgroundColor: '#e5dfd5',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        fontFamily: 'monospace',
    },
    '& pre': {
        backgroundColor: '#3d3226',
        color: '#f5f1eb',
        padding: '0.3em 1.0em',
        borderRadius: '4px',
        overflow: 'auto',
    },
    '& pre code': {
        backgroundColor: 'transparent',
        padding: 0,
    },
    '& blockquote': {
        borderLeft: '4px solid #d4cbbf',
        paddingLeft: '1em',
        margin: '0.5em 0',
        color: '#5d4a36',
    },
    '& a': {
        color: '#5d4a36',
        textDecoration: 'underline',
    },
    '& hr': {
        border: 'none',
        borderTop: '1px solid #d4cbbf',
        margin: '1em 0',
    },
    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '1em 0',
    },
    '& th, & td': {
        border: '1px solid #d4cbbf',
        padding: '0.5em 0.75em',
        textAlign: 'left',
    },
    '& th': {
        backgroundColor: '#e5dfd5',
        fontWeight: 'bold',
        color: '#3d3226',
    },
    '& tr:nth-of-type(even)': {
        backgroundColor: '#f5f1eb',
    },
};

/**
 * MDEditor 래퍼 Box에 적용하는 스타일
 * CommunityWrite, CommunityEdit에서 사용
 */
export const mdEditorWrapperStyles = {
    '& .w-md-editor': {
        border: '2px solid #d4cbbf',
        borderRadius: '4px',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#3d3226',
        },
    },
    '& .w-md-editor-toolbar': {
        borderBottom: '2px solid #d4cbbf',
        backgroundColor: '#faf8f5',
    },
    '& .w-md-editor-content': {
        backgroundColor: '#fff',
    },
    '& .wmde-markdown': {
        backgroundColor: '#fff',
    },
};

/**
 * 공통 FormLabel 스타일
 */
export const formLabelStyles = {
    mb: 1,
    color: '#3d3226',
    fontWeight: 'bold',
};

/**
 * 이미지 업로드 라벨 스타일 (Block Display)
 */
export const imageLabelStyles = {
    ...formLabelStyles,
    display: 'block',
};

/**
 * 공통 TextField 스타일 (제목 입력 등)
 */
export const textFieldStyles = {
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
};

/**
 * 공통 Paper 컨테이너 스타일
 */
export const paperContainerStyles = {
    borderRadius: 2,
    border: '2px solid #e5dfd5',
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
};

/**
 * 공통 버튼 스타일 (Primary)
 */
export const primaryButtonStyles = {
    bgcolor: '#3d3226',
    '&:hover': { bgcolor: '#5d4a36' },
    color: '#f5f1eb',
};

/**
 * Submit 버튼 스타일
 */
export const submitButtonStyles = {
    py: 1.5,
    mt: 1.5,
    bgcolor: '#3d3226',
    fontSize: '1.1rem',
    '&:hover': { bgcolor: '#5d4a36' },
    color: '#f5f1eb',
    fontWeight: 'bold',
};
