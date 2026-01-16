// orval.config.js
module.exports = {
    'board-study-api': {
        input: {
            // 백엔드 Swagger 주소
            target: 'http://localhost:8080/v3/api-docs',
        },
        output: {
            mode: 'tags-split',
            target: 'src/apis/generated',
            client: 'react-query', // 또는 'axios'
            override: {
                mutator: {
                    // 중요: 위에서 만든 js 파일 경로로 지정
                    path: './src/apis/custom-instance.js',
                    name: 'customInstance',
                },
            },
        },
    },
};