import { ArkeosPanel } from "./arkeos-panel.xtag";

declare var XTagElement: any;

export class ArkeosSplitPanel extends XTagElement {
    static version = "2022.1001.713";
    public host: HTMLElement;
    private promise = new Promise<void>((resolve) => resolve());

    private resizeObserver = new ResizeObserver(entries => entries.forEach((entry) => this.resize(entry)));

    private _orientation: string;
    private currentElements: number;
    private _select: string;
    private _panels: Array<ArkeosPanel>;
    private _splits: Array<HTMLDivElement>;

    currentSplit: HTMLDivElement;
    currentSplitX: number;
    currentSplitY: number;

    currentPanel1X: number;
    currentPanel1Y: number;
    currentPanel1W: number;
    currentPanel1H: number;
    currentPanel1R: number;

    currentPanel2X: number;
    currentPanel2Y: number;
    currentPanel2W: number;
    currentPanel2H: number;
    currentPanel2R: number;

    private readonly splitWidth = 5;
    private readonly splitHeight = 4;

    private initPanelMethod = this.initPanelVertical;
    private setPanelMethod = this.setPanelVertical;
    private initSplitMethod = this.initSplitVertical;
    private setSplitMethod = this.setSplitVertical;
    private dragMethod = this.dragVertical;

    //Attributes
    set 'select::attr'(val) {
        this._select = val;
    }

    get 'select::attr'() {
        return this._select;
    }

    get adjustHeight() {
        return (this._panels.length - 1) * this.splitHeight / this._panels.length;
    }

    get adjustWidth() {
        return (this._panels.length - 1) * this.splitWidth / this._panels.length;
    }

    get 'orientation::attr'() {
        return this._orientation;
    }

    set 'orientation::attr'(value) {
        this._orientation = value?.toLowerCase() || 'vertical';
        let bVertical = this._orientation === "vertical";
        this.dragMethod = bVertical ? this.dragVertical : this.dragHorizontal;
        this.initPanelMethod = bVertical ? this.initPanelVertical : this.initPanelHorizontal;
        this.setPanelMethod = bVertical ? this.setPanelVertical : this.setPanelHorizontal;
        this.initSplitMethod = bVertical ? this.initSplitVertical : this.initSplitHorizontal;
        this.setSplitMethod = bVertical ? this.setSplitVertical : this.setSplitHorizontal;
        
    }

    //Events
    resize(event: ResizeObserverEntry) {
        this.currentElements = this._panels.length || 0;
        this.promise.then(() => {
            this.updatePanels(this.initPanelMethod, this.initSplitMethod);
        });
    }

    //Methods
    updatePanels(setPanel: (panel: ArkeosPanel, displacement: number) => number, 
                 setSplit: (split: HTMLDivElement, displacement: number) => number) {
        let displacement = 0;

        this._panels.forEach((panel, inx) => {
            if(inx) {
                displacement += setSplit.call(this, this._splits[inx], displacement)
            }

            displacement += setPanel.call(this, panel, displacement);
        });
    }

    initPanelVertical(panel: ArkeosPanel, displacement: number): number {        
        panel.master = this;
        panel.style.left = `${displacement}px`;
        panel.style.top = "0px";
        panel.update();

        return parseFloat(panel.style.width);
    }

    setPanelVertical(panel: ArkeosPanel, displacement: number): number {        
        panel.style.left = `${displacement}px`;

        return parseFloat(panel.style.width);
    }

    initSplitVertical(split: HTMLDivElement, displacement: number): number {        
        split.style.left = `${displacement}px`;
        split.style.top = "0px",
        split.style.width = `${this.splitWidth}px`,
        split.style.height = "100%"

        split.style.cursor = "ew-resize";

        return this.splitWidth;
    }

    setSplitVertical(split: HTMLDivElement, displacement: number): number {        
        split.style.left = `${displacement}px`;

        return this.splitWidth;
    }

    initPanelHorizontal(panel: ArkeosPanel, displacement: number): number {
        panel.master = this;
        panel.style.left = "0px";
        panel.style.top = `${displacement}px`;
        panel.update();

        return parseInt(panel.style.height);
    }

    setPanelHorizontal(panel: ArkeosPanel, displacement: number): number {
        panel.style.top = `${displacement}px`;

        return parseInt(panel.style.height);
    }

    initSplitHorizontal(split: HTMLDivElement, displacement: number): number {
        split.style.left = "0px";
        split.style.top = `${displacement}px`;
        split.style.width = "100%";
        split.style.height = `${this.splitHeight}px`;

        split.style.cursor = "ns-resize";

        return this.splitHeight;
    }

    setSplitHorizontal(split: HTMLDivElement, displacement: number): number {
        split.style.top = `${displacement}px`;

        return this.splitHeight;
    }

    initSplit(split: HTMLDivElement, inx: number) {
        split.draggable = true; 

        let attr = document.createAttribute("index");
        attr.value = inx.toString();
        split.setAttributeNode(attr);

        attr = document.createAttribute("style");
        attr.value = "position: absolute; color: black; background-color: black; border-width: 1px; border-style: solid; borderColor: black; z-index: 2; transform: none !important";

        split.setAttributeNode(attr);

        split.classList.add("arkeos-split");
    }

    'dragstart::event:delegate(.arkeos-split)'(ev:DragEvent) {     
        let _host =  ev.currentTarget as unknown as ArkeosSplitPanel;
   
        if((ev.target as any).classList.contains("arkeos-split")) {
            let _split = ev.target as HTMLDivElement
            _host.currentSplit = _split;

            _host.currentSplitX = parseFloat(_split.style.left);
            _host.currentSplitY = parseFloat(_split.style.top);
    
            let index = parseInt(_split.getAttribute("index"));
            let panel = _host._panels[index - 1];
            _host.currentPanel1X = parseFloat(panel.host.style.left);
            _host.currentPanel1Y = parseFloat(panel.host.style.top);
            _host.currentPanel1W = parseFloat(panel.host.style.width);
            _host.currentPanel1H = parseFloat(panel.host.style.height);
            _host.currentPanel1R = panel.ratio;
    
            panel = _host._panels[index];
            _host.currentPanel2X = parseFloat(panel.host.style.left);
            _host.currentPanel2Y = parseFloat(panel.host.style.top);
            _host.currentPanel2W = parseFloat(panel.host.style.width);
            _host.currentPanel2H = parseFloat(panel.host.style.height);
            _host.currentPanel2R = panel.ratio;
        } 
    }

    'dragover::event:delegate(.arkeos-split-target)'(ev: DragEvent) {
        let _host =  ev.currentTarget as unknown as ArkeosSplitPanel;
        if(_host.currentSplit) {
            let _split = _host.currentSplit;
            let _splitHost = _split?.parentElement?.parentElement as unknown as ArkeosSplitPanel;
            if(_splitHost === _host) {        
                var inx = parseInt(_split.getAttribute("index"));
                _host.dragMethod(ev, inx);
            }
        }
    }

    'dragend::event'(ev: DragEvent) {
        let _host =  ev.currentTarget as unknown as ArkeosSplitPanel;
        if(_host.currentSplit) {
            _host.currentSplit = null;
        }
    }

    'resfresh::event'(ev: Event) {
        let _host =  ev.currentTarget as unknown as ArkeosSplitPanel;
        _host.currentSplit = null;
    }

    dragVertical(e: DragEvent, inx: number) {
        let x = this.currentSplitX - e.x;

        let ratio = (this.currentPanel1R + this.currentPanel2R);

        //Izquierda
        let width1 = this.currentPanel1W - x;
        let width2 = this.currentPanel2W + x;

        //Derecha
        let panel = this._panels[inx];
        panel.host.style.left = `${this.currentPanel2X - x}px`;
        panel["ratio"] = (width2 * ratio / (width1 + width2)).toString();
        this._panels[inx - 1]["ratio"] = (width1 * ratio / (width1 + width2)).toString();
        this.currentSplit.style.left = `${e.x}px`;
        this.currentSplit.style.top = `${this.currentSplitY}px`;    
    }

    dragHorizontal(e: DragEvent, inx: number) {
        let y = this.currentSplitY - e.y;

        let ratio = (this.currentPanel1R + this.currentPanel2R) ;
        //Arriba
        let height1 = this.currentPanel1H - y;

        //Abajo
        let panel = this._panels[inx];
        panel.host.style.top = `${this.currentPanel2Y - y}px`;
        let height2 = this.currentPanel2H + y;

        this._panels[inx - 1]["ratio"] = (height1 * ratio / (height1 + height2)).toString();
        panel["ratio"] = (height2 * ratio / (height1 + height2)).toString();

        this.currentSplit.style.left = `${this.currentSplitX}px`;
        this.currentSplit.style.top = `${e.y}px`;
    }

    //View

    preRender() {
        this._panels = Array.from(this.host.children || []).filter((child) => child.localName === 'arkeos-panel') as unknown as Array<ArkeosPanel>;

        let container = document.createElement("div");
        let container_style = document.createAttribute("style");
        container_style.value = "width: 100%; height: 100%; display: block; overflow: none;";
        container.setAttributeNode(container_style);
        
        this._panels.map((panel) => {
            container.appendChild(panel as unknown as HTMLElement);
        });

        this.host.replaceChildren(container);

        this.promise.then(() => {
            let displacement = 0;

            this._splits = this._panels.map((panel, inx) => {
                let split: HTMLDivElement;
    
                if(inx) {
                    split = document.createElement("div");
    
                    this.initSplit(split, inx);
                    displacement += this.initSplitMethod(split, displacement);
    
                    container.appendChild(split)    
                }
       
                displacement += this.initPanelMethod(panel, displacement);
    
                return split;    
            });
    
        }).then(() => this.updatePanels(this.setPanelMethod, this.setSplitMethod) );        

    }

    constructor() {
        super();

        this.host = this as unknown as HTMLElement;

        let host_style = document.createAttribute("style");
        host_style.value = "left: 0px; top = 0px; width: calc(100% - 2px); height: calc(100% - 2px); display: block; overflow: none; position: absolute";
        this.host.setAttributeNode(host_style);

        this.preRender();

        this.resizeObserver.observe(this.host);
    }
}