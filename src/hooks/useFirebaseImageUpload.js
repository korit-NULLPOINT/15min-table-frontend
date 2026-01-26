import { useCallback, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';

const DEFAULT_ALLOW_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useFirebaseImageUpload(storage, options = {}) {
    const maxMB = options.maxMB ?? 2;
    const allowTypes = options.allowTypes ?? DEFAULT_ALLOW_TYPES;

    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const resetProgress = useCallback(() => setProgress(0), []);

    const upload = useCallback(
        async (file, { dir, filename } = {}) => {
            if (!file) throw new Error('NO_FILE');
            if (!dir) throw new Error('NO_DIR');

            if (!allowTypes.includes(file.type)) {
                const err = new Error(
                    '지원하지 않는 이미지 형식입니다. JPG/PNG/WEBP만 업로드할 수 있어요.',
                );
                err.code = 'INVALID_FILE_TYPE';
                throw err;
            }

            if (file.size > maxMB * 1024 * 1024) {
                const err = new Error(
                    `이미지 용량이 너무 큽니다. ${maxMB}MB 이하로 업로드해주세요.`,
                );
                err.code = 'FILE_TOO_LARGE';
                throw err;
            }

            const ext =
                file.name.split('.').pop()?.toLowerCase() ||
                (file.type === 'image/png'
                    ? 'png'
                    : file.type === 'image/webp'
                      ? 'webp'
                      : 'jpg');

            const safeFilename = filename ?? `${uuid()}.${ext}`;
            const path = `${dir}/${safeFilename}`;

            setIsUploading(true);
            setProgress(0);

            try {
                const imageRef = ref(storage, path);
                const uploadTask = uploadBytesResumable(imageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const p = Math.round(
                                (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                    100,
                            );
                            setProgress(p);
                        },
                        reject,
                        resolve,
                    );
                });

                const downloadUrl = await getDownloadURL(
                    uploadTask.snapshot.ref,
                );
                return downloadUrl;
            } catch (e) {
                const err = new Error(
                    '이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.',
                );
                err.code = 'UPLOAD_FAILED';
                throw err;
            } finally {
                setIsUploading(false);
            }
        },
        [allowTypes, maxMB, storage],
    );

    return { upload, isUploading, progress, resetProgress };
}
