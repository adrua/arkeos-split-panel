import { ArkeosSplitPanel } from './arkeos-split-panel.xtag';

declare var XTagElement: any;

export class ArkeosPanel extends XTagElement  {
    static version = "2022.1001.713";
    private promise = new Promise<void>((resolve) => resolve());

    private _parent: ArkeosSplitPanel;
    public host: HTMLElement;

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

        this.host.style.overflow = "auto";
        this.host.style.position = "absolute";
        this.host.style.borderWidth = "1px";
        this.host.style.borderStyle = "solid";
        this.host.style.borderColor = "green";
        this.host.style.zIndex = "1";
        
        this.host.classList.add("arkeos-split-target");

        this.promise.then(() => {
            this.ratio = this.getAttribute("ratio");
            this.caption = this.getAttribute("caption");
            this.location = this.getAttribute("location");
        });
    }

    update(_parent?: ArkeosSplitPanel) {
        if(_parent) {
            this._parent = _parent;
        }

        this._ratio = parseFloat(this.getAttribute("ratio")) / 100.0;
        
        if(this._parent) {
            if(this._parent.getAttribute("orientation") === "vertical") {
                this.host.style.width = `${this._parent.host.clientWidth * this._ratio - this._parent.adjustWidth}px`; 
                this.host.style.height = "100%";
            } else {
                this.host.style.width = "100%";
                this.host.style.height = `${this._parent.host.clientHeight * this._ratio - this._parent.adjustHeight}px`; 
            }
        }
    }
}