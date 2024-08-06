import { lazyReportBatch } from '../report';
import { generateUniqueId } from '../utils';

export default function pageChange() {
    // hash
    let oldUrl1 = '';
    window.addEventListener(
        'hashchange',
        function (event) {
            console.warn('hashchange', event);
            const newUrl = event.newURL;
            const reportData = {
                form: oldUrl1,
                to: newUrl,
                type: 'behavior',
                subType: 'hashchange',
                startTime: performance.now(),
                uuid: generateUniqueId(),
            };
            lazyReportBatch(reportData);
            oldUrl1 = newUrl;
        },
        true
    );
    // history
    let oldUrl2 = '';
    window.addEventListener(
        'popstate',
        function (event) {
            console.warn('popstate', event);
            const to = window.location.href;
            const reportData = {
                form: oldUrl2,
                to: to,
                type: 'behavior',
                subType: 'popstate',
                startTime: performance.now(),
                uuid: generateUniqueId(),
            };
            lazyReportBatch(reportData);
            oldUrl2 = to;
        },
        true
    );

}