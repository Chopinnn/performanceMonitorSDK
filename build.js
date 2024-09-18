const path = require("path");
const json = require("@rollup/plugin-json");
const { babel } = require("@rollup/plugin-babel");
const resolveFile = function (filePath) {
    return path.join(__dirname, filePath);
};
const plugins = [
    json({
        compact: true,
    }),
    babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
        presets: [
            [
                "@babel/env",
                {
                    targets: {
                        browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
                    },
                },
            ],
        ],
    }),
];
module.exports = [
    {
        plugins,
        input: resolveFile("./SDK/webSDK.js"),
        output: {
            file: resolveFile("./dist/monitor.js"),
            format: "iife",
            name: "monitor",
            sourcemap: false,   // 可以根据错误定位源码。但因为没有接入sourceMap还原的代码，有暴露源码的风险，所以先暂时关闭。
        },
    },
    {
        plugins,
        input: resolveFile("./SDK/webSDK.js"),
        output: {
            file: resolveFile("./dist/monitor.esm.js"),
            format: "esm",
            name: "monitor",
            sourcemap: false,
        },
    },
    {
        plugins,
        input: resolveFile("./SDK/webSDK.js"),
        output: {
            file: resolveFile("./dist/monitor.cjs.js"),
            format: "cjs",
            name: "monitor",
            sourcemap: false,
        },
    },
];
