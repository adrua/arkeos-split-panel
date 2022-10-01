import { ArkeosSplitPanel } from './arkeos-split-panel.xtag';

declare var XTagElement: any;

export class ArkeosPanel extends XTagElement  {
    static version = "2022.1001.713";
    private promise = new Promise<void>((resolve) => resolve());

    private _parent: ArkeosSplitPanel;
    public host: HTMLElement;

    get 'master::attr'() {
        return this._parent;
    }

    set 'master::attr'(value: ArkeosSplitPanel) {
        this._parent = value;
        this.promise.then(() => this.update());
    }

    private _caption = "";
    get 'caption::attr'() {
        return this._caption;
    }

    set 'caption::attr'(value) {
        this._caption = value;
    }

    private _location = "fill";
    get 'location::attr'() {
        return this._location.toLowerCase();
    }

    set 'location::attr'(value) {
        this._location = value;
    }

    private _ratio = 1; //== 100%

    get 'ratio::attr'(): string | number  {
        return this._ratio * 100.0;
    }

    set 'ratio::attr'(value: string | number) {
        this._ratio = parseFloat(value.toString()) / 100.0;
        
        this.promise.then(() => this.update());
    }

    constructor() {
        super(); 

        this.host = this as unknown as HTMLElement;

        let host_style = document.createAttribute("style");
        host_style.value = "overflow: auto; position: absolute; borderWidth: 1px; borderStyle: solid; borderColor: green; zIndex: 1; ";
        this.host.setAttributeNode(host_style);

        if(this.host.getAttribute("ratio")) {
            let host_ratio = document.createAttribute("ratio");
            host_ratio.value = "100";
            this.host.setAttributeNode(host_ratio);
        }

        if(this.host.getAttribute("location")) {
            let host_location = document.createAttribute("location");
            host_location.value = "fill";
            this.host.setAttributeNode(host_location);
        }

        if(this.host.getAttribute("caption")) {
            let host_caption = document.createAttribute("caption");
            host_caption.value = "";
            this.host.setAttributeNode(host_caption);
        }

        if(this.host.getAttribute("master")) {
            let host_master = document.createAttribute("master");
            host_master.value = null;
            this.host.setAttributeNode(host_master);
        }
    }

    update() {
        if(this._parent) {
            if(this._parent["orientation"] == "vertical") {
                this.host.style.width = `${this._parent.host.clientWidth * this._ratio - this._parent.adjustWidth}px`; 
                this.host.style.height = "100%";
            } else {
                this.host.style.width = "100%";
                this.host.style.height = `${this._parent.host.clientHeight * this._ratio - this._parent.adjustHeight}px`; 
            }
        }
    }
}