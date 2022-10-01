import { ArkeosPanel } from './arkeos-panel.xtag';
import { ArkeosSplitPanel } from './arkeos-split-panel.xtag';

export { ArkeosPanel } from './arkeos-panel.xtag';
export { ArkeosSplitPanel } from './arkeos-split-panel.xtag';

import './index.scss';

declare var xtag: any;

function registerComponent(webComponent: string, newComponent: any) {
    let component: any = customElements.get(webComponent);
    if(component) {
        if(component.version < newComponent.version) {
            xtag.create(webComponent, newComponent);
        }
    } else {
        xtag.create(webComponent, newComponent);
    }   
}

registerComponent('arkeos-split-panel', ArkeosSplitPanel);

registerComponent('arkeos-panel', ArkeosPanel);
