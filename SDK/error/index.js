
import { lazyReportBatch } from '../report';

export default function error() {
    // 捕获资源加载失败的错误：js css img
    window.addEventListener(
        'error',
        function (e) {
            const target = e.target;
            if (target.src || target.href) {
                const url = target.src || target.href;
                const reportData = {
                    type: 'error',
                    subType: 'resource',
                    url,
                    html: target.outerHTML,
                    pageUrl: window.location.href,
                    path: e.path,
                };
                lazyReportBatch(reportData);
            }
        },
        true
    );
    // 捕获js错误
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        const reportData = {
            type: 'error',
            subType: 'javascript',
            msg,
            url,
            lineNo,
            columnNo,
            stack: error.stack,
            pageUrl: window.location.href,
            startTime: performance.now(),
        };
        lazyReportBatch(reportData);
    };
    // 捕获promise错误
    window.addEventListener(
        'unhandledrejection',
        function (e) {
            const reportData = {
                type: 'error',
                subType: 'promise',
                reason: e.reason?.stack,
                pageUrl: window.location.href,
                startTime: e.timeStamp,
            };
            lazyReportBatch(reportData);
        },
        true
    );
}