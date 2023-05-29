import { ArkeosPanel } from "./arkeos-panel.xtag";

declare var XTagElement: any;
type ArkeosSplitOrientation = 'column' | 'row';

export class ArkeosSplitPanel extends XTagElement {
    static version = "2023.527.1843";
    public host: HTMLElement;
    private promise = new Promise<void>((resolve) => resolve());

    private _container: HTMLElement;
    private _orientation: ArkeosSplitOrientation = 'column';
    private _select: string;
    private _panels: Array<ArkeosPanel>;
    private _splits: Array<HTMLDivElement>;

    currentSplit: HTMLDivElement;
    currentSplitX: number;
    currentSplitY: number;

    currentPanel1R: number;

    currentPanel2R: number;

    private dragMethod = this.dragHorizontal;

    private readonly _dragId = new Date().getTime();
    private readonly _dragType = `arkeos-split-${this._dragId}`;

    //Attributes
    set 'select::attr'(val) {
        this._select = val;
    }

    get 'select::attr'() {
        return this._select;
    }

    get 'orientation::attr'() : ArkeosSplitOrientation {
        return this._orientation;
    }

    set 'orientation::attr'(value: ArkeosSplitOrientation) {
        this._orientation = value || 'column';
        let bOrientation = this._orientation === "column";
        this.dragMethod = bOrientation ? this.dragHorizontal : this.dragVertical;
        this._container.style.flexDirection = this._orientation;
        this.update();
    }

    //Methods
    'dragstart::event:delegate(.arkeos-split)'(ev:DragEvent) {     
        let _split = ev.target as HTMLDivElement
        let _host = _split.closest<HTMLElement>('arkeos-split-panel') as unknown as ArkeosSplitPanel;
   
        _split.setAttribute("_dragType",  _host._dragType);
        _host.currentSplit = _split;

        ev.dataTransfer.dropEffect = "move";

        _host.currentSplitX = ev.screenX;
        _host.currentSplitY = ev.screenY;

        let index = parseInt(_split.getAttribute("index"));
        _host.currentPanel1R = _host._panels[index - 1].ratio;
        _host.currentPanel2R = _host._panels[index].ratio;
        
        _split.classList.add('arkeos-split-active');
    }

    'dragover::event:delegate(.arkeos-split-target)'(ev: DragEvent) {
        let _split = document.querySelector('.arkeos-split-active');
        let _host = _split.closest<HTMLElement>('arkeos-split-panel') as unknown as ArkeosSplitPanel;
        if(_split.getAttribute("_dragType") === _host?._dragType) {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
            _host.dragMethod(ev);
        }
    }

    'dragend::event:delegate(.arkeos-split)'(ev: DragEvent) {
        let _split = document.querySelector('.arkeos-split-active');
        _split?.classList.remove('arkeos-split-active');
    }

    'resfresh::event'(ev: Event) {
        let _host =  ev.currentTarget as unknown as ArkeosSplitPanel;
        _host.currentSplit = null;
    }

    dragVertical(e: DragEvent) {
        let x = this.currentSplitX - e.screenX;
        this.splitDrag((100.0 * x) / this.offsetWidth);
    }

    dragHorizontal(e: DragEvent) {
        let y = this.currentSplitY - e.screenY;
        this.splitDrag((100.0 * y)/ this.offsetHeight);
    }

    splitDrag(ratio: number) {
        var inx = parseInt(this.currentSplit.getAttribute("index"));
        this._panels[inx - 1].ratio = this.currentPanel1R - ratio;
        this._panels[inx].ratio = this.currentPanel2R + ratio;
    }

    update() {
        return this.promise?.then(() => {
            let bOrientation = this._orientation === 'column';
            this._panels.map((panel, inx) => {
                let split: HTMLDivElement;

                panel.update();

                if(this._panels.length - inx - 1) {
                    split = this._splits[inx];
                    split.style.cursor = `${bOrientation ? "ns" : "ew"}-resize`;   
                    split.style[bOrientation ? "height" : "width"] = `5px`;
                    split.style[!bOrientation ? "height" : "width"] = `100%`;
                    split.style[bOrientation ? "marginTop" : "marginLeft"] = `-5px`;            
                }
           
            });
    
        });        
    }

    preRender() {
        this._panels = Array.from(this.host.children || []).filter((child) => child.localName === 'arkeos-panel') as unknown as Array<ArkeosPanel>;

        this._container = document.createElement("div");
        this._container.style.width = "100%"; 
        this._container.style.height = "100%"; 
        this._container.style.display = "flex"; 
        this._container.style.flexDirection = this._orientation; 
        this._container.style.overflow ="none";
        
        this._panels.map((panel) => {
            this._container.appendChild(panel as unknown as HTMLElement);
        });

        this.host.replaceChildren(this._container);

        this.promise?.then(() => {
            let bOrientation = this._orientation === 'column';
            this._panels[0].style.flex = "1";
            this._splits = this._panels.map((panel, inx) => {
                let split: HTMLDivElement;

                panel.setParent(this);

                if(this._panels.length - inx - 1) {
                    split = document.createElement("div");
                    split.style.cursor = `${bOrientation ? "ns" : "ew"}-resize`;   
                    split.style[bOrientation ? "height" : "width"] = `5px`;
                    split.style[!bOrientation ? "height" : "width"] = `100%`;
                    split.style[bOrientation ? "marginTop" : "marginLeft"] = `-5px`;
                    split.style.zIndex = "2";           
                    split.style.color = "black";
                    split.style.backgroundColor = "black";
                    split.style.borderWidth = "1px";
                    split.style.borderStyle = "solid";
                    split.style.borderColor = "black";
                    split.style.transform = "none !important";

                    split.draggable = true; 
                    split.classList.add('arkeos-split');
                    split.setAttribute('index', (inx + 1).toString());

                    panel.insertAdjacentElement('afterend', split);   
                }
           
                return split;    
            });
    
        });    
    }

    constructor() {
        super();

        this.host = this as unknown as HTMLElement;
 
        this.host.style.width = "100%"; 
        this.host.style.height = "100%"; 
        this.host.style.overflow = "none"; 

        this.preRender();
    }
}