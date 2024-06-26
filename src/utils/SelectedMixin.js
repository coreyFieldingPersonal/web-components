export const SelectedMixin = superclass => class SelectedMixin extends superclass {
        constructor() {
            super();
            this.__onClick = this.__onClick.bind(this)
        }

        connectedCallback() {
            if (super.connectedCallback) {
                super.connectedCallback()
            }

            if (this.hasAttribute('selected')) {
                this.__index = Number(this.getAttribute('selected'))
            } else {
                this.__index = 0;
                this.requestUpdate(false)
            }

            this.shadowRoot.addEventListener('click', this.__onClick);
            this.shadowRoot.addEventListener('keydown', this.__onKeyDown)

            this.shadowRoot.addEventListener('slotchange', async () => {
                this.requestUpdate(false)
            })
        }

        static get observedAttributes() {
            return ['selected']
        }

        attributeChangedCallback(name, oldVal, newVal) {
            if (name === 'selected') {
                if (newVal !== oldVal) {
                    this.__index = Number(this.getAttribute('selected'))
                    this.requestUpdate(true)
                }
            }
        }
    
        __onClick(e) {}
        
        get selected() {
            return this.__index;
        }

        set selected(val) {
            this.__index = val
            if (val !== null) {
                this.requestUpdate(true)
            }
        }
    }