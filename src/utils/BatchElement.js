export class BatchElement extends HTMLElement {
    constructor() {
        super();
        this.updateComplete = this.__resolver()
        this.__uuid = BatchElement.uuid++;
    }

    update() { }
    
    async requestUpdate(dispatchEvent) {
        if (!this.__renderRequest) {
            this.__renderRequest = true
            await 0;
            this.update()

            if (dispatchEvent) {
                if (this.constructor.config.disabled && this.hasAttribute('disabled')) {
                    /** noop */
                } else {
                    this.__dispatch();
                }
            }

            this.__res()
            this.updateComplete = this.__resolver()
            this.__renderRequest = false
        }
    }

    __dispatch() { }
    
    __resolver() {
        return new Promise(res => {
            this.__res = res
        })
    }
}

BatchElement.uuid = 0;