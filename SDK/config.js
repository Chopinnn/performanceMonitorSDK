const config = {
    url: '',
    projectName: 'SDK',
    appId: '123456',
    userId: '123456',
    isImageUpload: false,   // 是否使用图片上报
    batchSize: 5,
};

export function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key];
        }
    }
}

export default config;