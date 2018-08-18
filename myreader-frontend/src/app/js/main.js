import './app.module';
import registerServiceWorker from '../../registerServiceWorker';

import '../css/mobile.css';

// TODO replace with CSP
window.write = () => {};

registerServiceWorker();
