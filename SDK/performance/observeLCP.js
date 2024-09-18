import { lazyReportBatch } from '../report';

export default function observerLCP() {
    const entryHandler = (list) => {
        if (observer) {
            observer.disconnect();
        } 
        for (const entry of list.getEntries()) {
            const json = entry.toJSON();
            console.log(json);
            const reportData = {
                ...json,
                type: 'performance',
                subType: entry.name,
                pageUrl: window.location.href,
            }
            lazyReportBatch(reportData);
        }
    }
    // 统计和计算lcp的时间
    const observer = new PerformanceObserver(entryHandler);
    // buffered: true 确保观察到所有paint事件
    observer.observe({type: 'largest-contentful-paint', buffered: true}); // LCP是独立的性能条目，不需要像FP和FCP一样先通过通用类型paint再通过name来判断，直接使用type即可
}