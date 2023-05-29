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

    private _ratio = 100; //== 100%

    get 'ratio::attr'(): string | number  {
        return this._ratio;
    }

    set 'ratio::attr'(value: string | number) {
        this._ratio = parseFloat(value.toString());   
        this.update();     
    }

    constructor() {
        super(); 

        this.host = this as unknown as HTMLElement;

        this.host.style.overflow = "auto";
        this.host.style.zIndex = "1";

        this.host.classList.add("arkeos-split-target");
    }

    public setParent(_parent: ArkeosSplitPanel) {
        this._parent = _parent;
        this.update();
    }
    
    update() {        
        if(this._parent) {
            if(this._parent.orientation === "column") {
                this.host.style.width = "100%";
                this.host.style.height = `${this._ratio}%`; 
            } else {
                this.host.style.width = `${this._ratio}%`; 
                this.host.style.height = "100%";
            }
        }
    }
}