import { BatchElement } from "../../utils/BatchElement.js";
import { SelectedMixin } from "../../utils/SelectedMixin.js";

const template = document.createElement('template');

template.innerHTML = `
    <style>
        :host {
            display: block;
        }

        :host .group {
            display: flex;
            align-items: flex-start;
        }
    </style>
    <div part="group" role="radiogroup" class="group">
    tets
        <slot></slot>
    </div>
`

export class CustomRadio extends SelectedMixin(BatchElement) {
    static is = 'custom-radio'

    static get config() {
        return {
            selectors: {
                radios: {
                    selector: el => el.querySelectorAll('*')
                }
            }
        }
    }

    static get observedAttributes() {
        return [...super.observedAttributes]
    }

    attributeChangedCallback(name, old, val) {
        super.attributeChangedCallback(name, old, val)
    }

    connectedCallback() {
        super.connectedCallback()
        this.shadowRoot.querySelector('.group')
        .setAttribute('aria-label', this.getAttribute('label') || 'radiogroup')
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}