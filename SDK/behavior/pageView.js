import { lazyReportBatch } from '../report';
import { generateUniqueId } from '../utils';

export default function pageView() {
    const reportData = {
        type: 'behavior',
        subType: 'pageView',
        startTime: performance.now(),
        pageUrl: window.location.href,
        referror: document.referrer,
        uuid: generateUniqueId(),
    }
    lazyReportBatch(reportData)
}