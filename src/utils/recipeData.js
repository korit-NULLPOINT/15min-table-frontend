// Mock recipe data for detail pages
export const recipeDetailsMap = {
    1: {
        id: 1,
        title: '초간단 김치볶음밥',
        author: '요리초보',
        authorId: 3,
        views: '15.2K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVjaXBlfGVufDF8fHx8MTc2Nzc2MjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description:
            '남은 김치로 간단하게 만드는 자취생 필수 메뉴! 밥만 있으면 5분 만에 뚝딱 완성되는 초간단 김치볶음밥입니다.',
        ingredients: [
            '밥 1공기',
            '김치 1/2컵',
            '식용유 1큰술',
            '참기름 1작은술',
            '김 약간',
            '계란 1개 (선택)',
        ],
        steps: [
            '팬에 식용유를 두르고 중불로 달궈주세요.',
            '잘게 썬 김치를 넣고 볶아주세요. 김치에서 수분이 날아가고 향이 올라올 때까지 약 2-3분 정도 볶아주세요.',
            '밥을 넣고 김치와 함께 골고루 섞어가며 볶아주세요.',
            '참기름을 넣고 마지막으로 한 번 더 볶아주세요.',
            '접시에 담고 김을 뿌려 완성! 취향에 따라 계란 프라이를 올려도 좋습니다.',
        ],
        hashtags: ['15분요리', '김치볶음밥', '자취생필수', '초간단레시피'],
    },
    2: {
        id: 2,
        title: '로제 파스타',
        author: '파스타킹',
        authorId: 3,
        views: '12.8K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3NjkzODg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description:
            '레스토랑 못지않은 크리미한 로제 파스타를 집에서 간단하게! 생크림과 토마토소스의 환상적인 조합을 즐겨보세요.',
        ingredients: [
            '스파게티 면 100g',
            '베이컨 3줄',
            '양파 1/4개',
            '마늘 2쪽',
            '토마토 소스 3큰술',
            '생크림 100ml',
            '파마산 치즈 약간',
            '올리브유 2큰술',
            '소금, 후추 약간',
        ],
        steps: [
            '끓는 물에 소금을 넉넉히 넣고 스파게티 면을 삶아주세요. 포장지에 표시된 시간보다 1분 덜 삶아주세요.',
            '팬에 올리브유를 두르고 다진 마늘과 베이컨을 볶아주세요.',
            '베이컨이 노릇해지면 양파를 넣고 투명해질 때까지 볶아주세요.',
            '토마토 소스를 넣고 중불에서 2-3분간 졸여주세요.',
            '생크림을 넣고 잘 섞어준 다음, 삶은 면과 면수 약간을 넣고 버무려주세요.',
            '파마산 치즈를 뿌리고 소금, 후추로 간을 맞춰 완성!',
        ],
    },
    3: {
        id: 3,
        title: '참치 마요 덮밥',
        author: '덮밥마스터',
        authorId: 3,
        rating: 4.9,
        views: '10.5K',
        cookTime: '5분',
        image: 'https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYm93bHxlbnwxfHx8fDE3Njc3NDA1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description:
            '참치캔만 있으면 5분 안에 완성되는 간편하고 맛있는 한 그릇 요리! 바쁜 아침이나 야식으로 제격입니다.',
        ingredients: [
            '밥 1공기',
            '참치캔 1개',
            '마요네즈 2큰술',
            '간장 1작은술',
            '김 약간',
            '참깨 약간',
            '파 약간 (선택)',
        ],
        steps: [
            '참치캔의 기름을 빼고 마요네즈와 간장을 넣어 잘 섞어주세요.',
            '따뜻한 밥을 그릇에 담아주세요.',
            '밥 위에 참치마요를 올려주세요.',
            '김을 잘게 부숴 뿌리고 참깨를 뿌려주세요.',
            '취향에 따라 파를 송송 썰어 올려 완성!',
        ],
    },
    4: {
        id: 4,
        title: '라면 업그레이드',
        author: '라면장인',
        authorId: 3,
        rating: 4.8,
        views: '9.2K',
        cookTime: '10분',
        image: 'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwcmFtZW58ZW58MXx8fHwxNzY3NzYyNjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description:
            '평범한 라면을 특별하게! 간단한 재료 추가로 훨씬 더 맛있고 영양가 있는 라면을 만들어보세요.',
        ingredients: [
            '라면 1개',
            '계란 1개',
            '대파 약간',
            '치즈 1장',
            '물 550ml',
        ],
        steps: [
            '냄비에 물을 넣고 끓여주세요.',
            '물이 끓으면 라면과 스프를 넣고 4분간 끓여주세요.',
            '대파를 송송 썰어 넣고 계란을 풀어 넣어주세요.',
            '불을 끄고 치즈를 올려주세요.',
            '치즈가 녹으면 완성! 뜨거울 때 드세요.',
        ],
    },
    5: {
        id: 5,
        title: '뚝배기 된장찌개',
        author: '집밥요리사',
        authorId: 3,
        rating: 5.0,
        views: '8.7K',
        cookTime: '20분',
        image: 'https://images.unsplash.com/photo-1560684352-8497838a2229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VwJTIwc3Rld3xlbnwxfHx8fDE3Njc3NjI2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description:
            '엄마가 끓여주시던 그 맛! 따뜻하고 구수한 된장찌개로 한 끼 든든하게 해결하세요.',
        ingredients: [
            '된장 2큰술',
            '두부 1/2모',
            '감자 1개',
            '양파 1/4개',
            '애호박 1/4개',
            '대파 약간',
            '청양고추 1개 (선택)',
            '물 2컵',
            '다시다 약간',
        ],
        steps: [
            '감자와 양파, 애호박을 먹기 좋은 크기로 썰어주세요.',
            '뚝배기에 물을 넣고 감자를 먼저 넣어 끓여주세요.',
            '감자가 반쯤 익으면 된장을 풀어주세요.',
            '양파, 애호박, 두부를 넣고 5분간 더 끓여주세요.',
            '대파와 청양고추를 넣고 1분간 더 끓인 후 완성!',
        ],
    },
    6: {
        id: 6,
        title: '에그 토스트',
        author: '아침요리',
        authorId: 3,
        rating: 4.9,
        views: '7.9K',
        cookTime: '8분',
        image: 'https://images.unsplash.com/photo-1689020353604-8041221e1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0b2FzdHxlbnwxfHx8fDE3Njc3MDM4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description:
            '든든한 아침 식사로 완벽한 에그 토스트! 간단하지만 영양 만점인 한 끼를 만들어보세요.',
        ingredients: [
            '식빵 2장',
            '계란 2개',
            '햄 2장',
            '양배추 약간',
            '케첩, 마요네즈 약간',
            '버터 1큰술',
            '소금, 후추 약간',
        ],
        steps: [
            '양배추를 잘게 채썰어주세요.',
            '계란을 풀고 소금, 후추로 간을 해주세요.',
            '팬에 버터를 녹이고 햄을 구워주세요.',
            '햄을 꺼내고 계란을 부어 스크램블을 만들어주세요.',
            '식빵을 토스트하고 양배추, 계란, 햄을 올린 뒤 케첩과 마요네즈를 뿌려 완성!',
        ],
    },
};

export const topRecipes = [
    {
        id: 1,
        title: '초간단 김치볶음밥',
        author: '요리초보',
        views: '15.2K',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVjaXBlfGVufDF8fHx8MTc2Nzc2MjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rank: 1,
    },
    {
        id: 2,
        title: '크림 파스타 레시피',
        author: '파스타마스터',
        views: '12.8K',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3NjkzODg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rank: 2,
    },
    {
        id: 3,
        title: '5분만에 완성 덮밥',
        author: '자취왕',
        views: '10.5K',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1763844668895-6931b4e09458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW1wbGUlMjBtZWFsfGVufDF8fHx8MTc2Nzc2MjY5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rank: 3,
    },
    {
        id: 4,
        title: '건강한 샐러드 볼',
        author: '건강요리',
        views: '9.2K',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lbWFkZSUyMGZvb2R8ZW58MXx8fHwxNzY3NzYyNjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rank: 4,
    },
    {
        id: 5,
        title: '아침 토스트 모음',
        author: '브런치러버',
        views: '8.7K',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1689020353604-8041221e1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0b2FzdHxlbnwxfHx8fDE3Njc3MDM4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rank: 5,
    },
    {
        id: 6,
        title: '한그릇 비빔밥',
        author: '집밥요정',
        views: '7.9K',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYm93bHxlbnwxfHx8fDE3Njc3NDA1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        rank: 6,
    },
];

export const highRatedRecipes = [
    {
        id: 1,
        title: '얼큰한 김치찌개',
        author: '김치러버',
        rating: 5.0,
        reviews: 342,
        image: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwcmVjaXBlfGVufDF8fHx8MTc2Nzc2MjY5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '자취생 필수 메뉴! 간단하고 맛있는 김치찌개',
    },
    {
        id: 2,
        title: '로제 파스타',
        author: '파스타킹',
        rating: 4.9,
        reviews: 287,
        image: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmd8ZW58MXx8fHwxNzY3NjkzODg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '레스토랑 맛을 집에서! 초간단 로제 파스타',
    },
    {
        id: 3,
        title: '참치 마요 덮밥',
        author: '덮밥마스터',
        rating: 4.9,
        reviews: 421,
        image: 'https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwYm93bHxlbnwxfHx8fDE3Njc3NDA1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '5분이면 충분! 간편하고 맛있는 한끼',
    },
    {
        id: 4,
        title: '라면 업그레이드',
        author: '라면장인',
        rating: 4.8,
        reviews: 563,
        image: 'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwcmFtZW58ZW58MXx8fHwxNzY3NzYyNjk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '평범한 라면을 특별하게 만드는 비법',
    },
    {
        id: 5,
        title: '뚝배기 된장찌개',
        author: '집밥요리사',
        rating: 5.0,
        reviews: 298,
        image: 'https://images.unsplash.com/photo-1560684352-8497838a2229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VwJTIwc3Rld3xlbnwxfHx8fDE3Njc3NjI2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '엄마 손맛 그대로! 따뜻한 된장찌개',
    },
    {
        id: 6,
        title: '에그 토스트',
        author: '아침요리',
        rating: 4.9,
        reviews: 412,
        image: 'https://images.unsplash.com/photo-1689020353604-8041221e1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjB0b2FzdHxlbnwxfHx8fDE3Njc3MDM4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        description: '든든한 아침을 위한 에그 토스트',
    },
];

export const currentUserRecipePosts = [
    {
        id: 1,
        title: '초간단 김치볶음밥',
        date: '2026.01.10',
        thumbnail:
            'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?w=400',
    },
    {
        id: 2,
        title: '크림 파스타 레시피',
        date: '2026.01.08',
        thumbnail:
            'https://images.unsplash.com/photo-1587740907856-997a958a68ac?w=400',
    },
];

export const currentUserCommunityPosts = [
    {
        id: 101,
        title: '자취생 필수 조리도구 추천',
        date: '2026.01.12',
        views: 245,
        comments: 12,
    },
    {
        id: 102,
        title: '냉장고 파먹기 레시피 공유해요',
        date: '2026.01.09',
        views: 189,
        comments: 8,
    },
];

export const currentUserComments = [
    {
        id: 1,
        type: 'recipe',
        postTitle: '초간단 김치볶음밥',
        comment: '정말 맛있어 보이네요! 저도 만들어봐야겠어요',
        date: '2026.01.11',
        postId: 1,
    },
    {
        id: 2,
        type: 'recipe',
        postTitle: '로제 파스타',
        comment: '생크림 대신 우유 사용해도 되나요?',
        date: '2026.01.09',
        postId: 2,
    },
    {
        id: 3,
        type: 'community',
        postTitle: '자취생 필수 조리도구 추천',
        comment: '정말 유용한 정보네요! 감사합니다',
        date: '2026.01.10',
        postId: 101,
    },
    {
        id: 4,
        type: 'community',
        postTitle: '냉장고 파먹기 레시피 공유해요',
        comment: '저도 같은 고민 했는데 도움됐어요',
        date: '2026.01.08',
        postId: 102,
    },
];

export const currentUserFavorites = [
    {
        id: 3,
        title: '5분만에 완성 덮밥',
        thumbnail:
            'https://images.unsplash.com/photo-1763844668895-6931b4e09458?w=400',
    },
    {
        id: 4,
        title: '라면 업그레이드',
        thumbnail:
            'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?w=400',
    },
];

export const otherUserRecipePosts = [
    {
        id: 1,
        title: '초간단 김치볶음밥',
        date: '2026.01.10',
        thumbnail:
            'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?w=400',
    },
    {
        id: 2,
        title: '크림 파스타 레시피',
        date: '2026.01.08',
        thumbnail:
            'https://images.unsplash.com/photo-1587740907856-997a958a68ac?w=400',
    },
    {
        id: 3,
        title: '5분만에 완성 덮밥',
        date: '2026.01.05',
        thumbnail:
            'https://images.unsplash.com/photo-1763844668895-6931b4e09458?w=400',
    },
];

export const otherUserCommunityPosts = [
    {
        id: 101,
        title: '자취 꿀템 공유합니다',
        date: '2026.01.12',
        views: 245,
        comments: 12,
    },
    {
        id: 102,
        title: '요즘 뭐 해먹고 사나요?',
        date: '2026.01.09',
        views: 189,
        comments: 8,
    },
];

export const dummyNotifications = [
    {
        id: 1,
        type: 'follow',
        userName: '요리왕김치',
        userImage: '',
        timestamp: '5분 전',
        isRead: false,
    },
    {
        id: 2,
        type: 'post',
        userName: '자취생24',
        userImage: '',
        postTitle: '초간단 김치볶음밥',
        timestamp: '1시간 전',
        isRead: false,
    },
    {
        id: 3,
        type: 'post',
        userName: '혼밥러버',
        userImage: '',
        postTitle: '5분만에 완성하는 덮밥',
        timestamp: '2시간 전',
        isRead: false,
    },
    {
        id: 4,
        type: 'follow',
        userName: '파스타사랑',
        userImage: '',
        timestamp: '3시간 전',
        isRead: false,
    },
    {
        id: 5,
        type: 'post',
        userName: '라면킹',
        userImage: '',
        postTitle: '라면 맛있게 끓이는 법',
        timestamp: '5시간 전',
        isRead: false,
    },
    {
        id: 6,
        type: 'post',
        userName: '냉장고털이',
        userImage: '',
        postTitle: '냉장고 파먹기 레시피',
        timestamp: '6시간 전',
        isRead: true,
    },
    {
        id: 7,
        type: 'follow',
        userName: '자취요정',
        userImage: '',
        timestamp: '8시간 전',
        isRead: true,
    },
    {
        id: 8,
        type: 'post',
        userName: '간편식덕후',
        userImage: '',
        postTitle: '전자레인지로 5분 요리',
        timestamp: '10시간 전',
        isRead: true,
    },
    {
        id: 9,
        type: 'post',
        userName: '요리초보',
        userImage: '',
        postTitle: '불 없이 요리하기',
        timestamp: '12시간 전',
        isRead: true,
    },
    {
        id: 10,
        type: 'follow',
        userName: '혼자밥먹자',
        userImage: '',
        timestamp: '1일 전',
        isRead: true,
    },
    {
        id: 11,
        type: 'post',
        userName: '김치러버',
        userImage: '',
        postTitle: '김치찌개 황금 레시피',
        timestamp: '1일 전',
        isRead: true,
    },
    {
        id: 12,
        type: 'post',
        userName: '달걀마스터',
        userImage: '',
        postTitle: '달걀 요리 10가지',
        timestamp: '2일 전',
        isRead: true,
    },
];

export const communityPosts = {
    1: {
        id: 1,
        title: '자취 1년차 요리 초보입니다',
        author: '요리초보',
        date: '2026.01.12',
        content: `안녕하세요! 자취를 시작한 지 1년이 되었는데요, 아직도 요리가 너무 어렵네요 😅

특히 양념 비율을 맞추는 게 제일 어려운 것 같아요. 레시피대로 해도 왜인지 맛이 다르게 나오더라구요.

혹시 요리 초보 분들은 어떻게 연습하셨나요? 
추천하는 요리나 꿀팁 있으면 공유 부탁드립니다!`,
        comments: [
            {
                id: 1,
                author: '요리고수',
                date: '2026.01.12',
                content:
                    '처음엔 저도 그랬어요! 간단한 요리부터 시작하시는 게 좋아요. 김치볶음밥이나 라면같은 거 먼저 마스터하세요!',
            },
            {
                id: 2,
                author: '자취5년차',
                date: '2026.01.12',
                content:
                    '양념 비율은 계량스푼 필수입니다. 대충 넣으면 맛이 달라져요~',
            },
            {
                id: 3,
                author: '파스타킹',
                date: '2026.01.12',
                content:
                    '유튜브에서 백종원님 레시피 따라하면 실패 확률이 낮아요!',
            },
        ],
    },
    2: {
        id: 2,
        title: '마트 장보기 꿀팁 공유합니다',
        author: '알뜰자취생',
        date: '2026.01.11',
        content: `자취하면서 장보기 할 때 절약하는 꿀팁 공유할게요!

1. 주말 저녁 시간대에 가면 할인 많이 해요
2. 마트 앱 쿠폰 꼭 챙기세요
3. 냉동식품은 대용량으로 사서 소분하면 저렴해요
4. 제철 식재료 위주로 구매하면 신선하고 저렴합니다

다들 어떻게 장보기 하시나요?`,
        comments: [
            {
                id: 1,
                author: '절약왕',
                date: '2026.01.11',
                content:
                    '저는 장보기 전에 냉장고 정리부터 해요. 중복 구매 방지!',
            },
            {
                id: 2,
                author: '쿠폰러버',
                date: '2026.01.11',
                content:
                    '마트 앱 할인 쿠폰 진짜 중요하죠! 10% 할인도 쌓이면 큰돈이에요',
            },
        ],
    },
    3: {
        id: 3,
        title: '혼자 먹기 좋은 식당 추천해주세요',
        author: '혼밥러버',
        date: '2026.01.10',
        content: `요즘 혼자 밥 먹으러 다니는데 눈치 보이지 않는 식당 찾기가 어렵네요.

혼밥하기 좋은 식당이나 메뉴 추천 부탁드립니다!
서울 강남 쪽이면 더 좋구요~`,
        comments: [
            {
                id: 1,
                author: '혼밥고수',
                date: '2026.01.10',
                content:
                    '라면집이나 국밥집 추천드려요. 혼자 오는 사람 많아서 눈치 안 보여요!',
            },
            {
                id: 2,
                author: '맛집탐방',
                date: '2026.01.10',
                content:
                    '강남역 근처 덮밥집들 많아요. 카운터석도 있어서 편해요',
            },
        ],
    },
    4: {
        id: 4,
        title: '냉장고 정리 어떻게 하세요?',
        author: '정리왕',
        date: '2026.01.09',
        content: `자취하다 보니 냉장고가 금방 지저분해지더라구요.

음식물도 자꾸 상하고... 
다들 냉장고 정리 어떻게 하시나요? 보관 팁 있으면 알려주세요!`,
        comments: [
            {
                id: 1,
                author: '깔끔이',
                date: '2026.01.09',
                content:
                    '저는 밀폐용기에 날짜 스티커 붙여요. 언제 산 건지 확인하기 좋아요!',
            },
            {
                id: 2,
                author: '정리고수',
                date: '2026.01.09',
                content: '채소는 키친타올로 감싸서 보관하면 오래가요~',
            },
        ],
    },
    5: {
        id: 5,
        title: '자취생 필수 조리도구 추천',
        author: '주방고수',
        date: '2026.01.08',
        content: `자취 시작하시는 분들을 위해 필수 조리도구 정리해봤어요!

필수템:
- 프라이팬 (코팅 좋은 거 하나)
- 냄비 (라면 끓일 수 있는 사이즈)
- 칼, 도마
- 계량스푼
- 국자, 뒤집개

선택템:
- 전자레인지
- 에어프라이어
- 믹서기

이 정도면 웬만한 요리는 다 가능해요!`,
        comments: [
            {
                id: 1,
                author: '신입자취생',
                date: '2026.01.08',
                content:
                    '감사합니다! 이제 막 자취 시작하는데 딱 필요한 정보네요',
            },
            {
                id: 2,
                author: '요리러버',
                date: '2026.01.08',
                content:
                    '에어프라이어는 진짜 필수템이에요! 기름 안 써서 건강에도 좋아요',
            },
            {
                id: 3,
                author: '알뜰왕',
                date: '2026.01.08',
                content: '다이소에서 조리도구 사면 저렴해요~',
            },
        ],
    },
};

export const recipes = [
    {
        id: 1,
        title: '초간단 김치볶음밥',
        author: '요리초보',
        rating: 4.8,
        views: '15.2K',
        image: 'https://images.unsplash.com/photo-1626803774007-f92c2c32cbe7?w=400',
        mainCategory: '밥 / 면',
        subCategory: '5분 요리',
    },
    {
        id: 2,
        title: '크림 파스타 레시피',
        author: '파스타마스터',
        rating: 4.7,
        views: '12.8K',
        image: 'https://images.unsplash.com/photo-1587740907856-997a958a68ac?w=400',
        mainCategory: '밥 / 면',
        subCategory: '혼밥 / 한 그릇',
    },
    {
        id: 3,
        title: '5분만에 완성 덮밥',
        author: '자취왕',
        rating: 4.9,
        views: '10.5K',
        image: 'https://images.unsplash.com/photo-1763844668895-6931b4e09458?w=400',
        mainCategory: '밥 / 면',
        subCategory: '5분 요리',
    },
    {
        id: 4,
        title: '건강한 샐러드 볼',
        author: '건강요리',
        rating: 4.6,
        views: '9.2K',
        image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=400',
        mainCategory: '채소',
        subCategory: '불 없이 요리',
    },
    {
        id: 5,
        title: '아침 토스트 모음',
        author: '브런치러버',
        rating: 4.5,
        views: '8.7K',
        image: 'https://images.unsplash.com/photo-1689020353604-8041221e1273?w=400',
        mainCategory: '가공식품',
        subCategory: '5분 요리',
    },
    {
        id: 6,
        title: '한그릇 비빔밥',
        author: '집밥요정',
        rating: 4.7,
        views: '7.9K',
        image: 'https://images.unsplash.com/photo-1628521061262-19b5cdb7eee5?w=400',
        mainCategory: '밥 / 면',
        subCategory: '혼밥 / 한 그릇',
    },
    {
        id: 7,
        title: '라면 업그레이드',
        author: '라면장인',
        rating: 4.8,
        views: '13.5K',
        image: 'https://images.unsplash.com/photo-1627900440398-5db32dba8db1?w=400',
        mainCategory: '밥 / 면',
        subCategory: '전자레인지',
    },
    {
        id: 8,
        title: '뚝배기 된장찌개',
        author: '집밥요리사',
        rating: 5.0,
        views: '11.2K',
        image: 'https://images.unsplash.com/photo-1560684352-8497838a2229?w=400',
        mainCategory: '두부 / 콩류',
        subCategory: '혼밥 / 한 그릇',
    },
];
