customElements.define('text-input', class extends HTMLElement {
    static formAssociated = true;

    _internals;
    $input;
    _defaultValue = "";
    _type;
    _attrs = {}

    static get observedAttributes() {
        return ["type", "value", "placeholder", "error", "required"]
    }

    constructor() {
        super();
        this._internals = this.attachInternals()
        this._internals.role = "textbox";
        this.tabindex = 0;

        this.attachShadow({
            mode: 'open',
            delegatesFocus: true
        }).innerHTML = `
            <style>
                .wrapper {
                    position: relative;
                    margin-bottom: 1rem;
                }

                input {
                    position: relative;
                    height: 1rem;
                    width: calc(100% - 0.875rem);
                    padding: 18px 0px 10px 0.75rem;
                    outline: 1.5px solid rgba(107, 107, 107, 0.4);
                    border: 1px solid #09090b;
                    border-radius: 3px;
                    color: white;
                    background-color: #030712;
                }

                input.success {
                    border: 1px solid green;
                    outline: none;
                }

                input:hover {
                    border: 1px solid #0284c7;
                    outline: 1.5px solid rgba(2, 132, 199, 0.4);
                }

                input:focus+span, input:not(:placeholder-shown)+span {
                    width: calc(100% - 60%);
                    top: 28px;
                    left: 0;
                    color: #fde047;
                    -webkit-transform: scale(0.7) translateY(-10%) translateX(-8.5px);
                    transform: scale(0.7) translateY(-10%) translateX(-20px);
                }

                span {
                    position: absolute;
                    left: 10px;
                    top: calc(1rem + 30px);
                    color: #ffffff;
                    font-size: 0.8rem;
                    pointer-events: none;
                    opacity: 0.5;
                    -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
                    cursor: text;
                }

                input, span {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    -webkit-transition: all 0.2s;
                    transition: all 0.2s;
                    -webkit-transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
                    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
                }

                label {
                    font-size: 0.875rem;
                    opacity: 0.5;
                    margin-bottom: 0.5rem !important;
                }
                
                input.error {
                    border: 1px solid #9f1239 !important;
                    outline: 1.5px solid #e11d48 !important;
                }
            </style>
            <div class="wrapper">
                <label for="first_name">Email</label>
                <input role="none" tabindex="-1" value="" placeholder=" " autofill/>
                <span></span>
            </div>
        `
    }

    connectedCallback() {
        this.$input = this.shadowRoot.querySelector('input')
        this.setProps()

        this._defaultValue = this.value
        this._internals.setFormValue(this.value)
        this.$input.addEventListener('input', () => this.handleInput())
        this.$input.addEventListener('blur', () => this.handleValidation())
    }

    attributeChangedCallback(attr, prev, next) {
        this._attrs[attr] = next
        this.setProps()
    }

    handleValidation() {
        this.type == 'email' && this.validateEmail()
        this.type == 'text' && this.validateText()
    }

    validateEmail = () => {
        const pattern = /[-a-zA-Z0-9~!$%^&amp;*_=+}{'?]+(\.[-a-zA-Z0-9~!$%^&amp;*_=+}{'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.([cC][oO][mM]))(:[0-9]{1,5})?/
        const valid = pattern.test(this.$input.value)
        
        (this.$input.value && !valid) ? this.showError() : this.hideError()
    }

    validateText = () => {
        const isValid = (this.getAttribute('required') && !this.$input.value)
        isValid ? this.showError : this.hideError
    }

    showError = () => {
        this.$input.classList.add('error')
    }

    hideError = () => {
        this.$input.classList.remove('error')
        this.$input.value && this.$input.classList.add('success')
    }

    handleInput = () => {
        this.setAttribute('error', false)
        this.handleValidation()
        this._internals.setFormValue(this.$input.value)
    }

    get type() {
        return this._type
    }

    set type(val) {
        this._type = val
    }

    set placeholder(val) {
        this.shadowRoot.querySelector('span').innerText = val
    }

    setProps = () => {
        if (!this.$input) return

        for (let prop in this._attrs) {
            switch (prop) {
                case "type":
                    this.type = this._attrs[prop]
                    this.shadowRoot.querySelector('span').innerText = this.type == 'email' ? 'example@domain.com' : 'username'
                    break;
                case "value":
                    this.$input.value = this._attrs[prop]
                    break;
                case "placeholder":
                    this.placeholder = this._attrs[prop]
                    break;
                case "error":
                    this.showError(this._attrs[prop])
                    break;
                case "required":
                    this.$input.toggleAttribute("required", prop === 'true' || prop === "")
                    break;
            }
        }

        this._attrs = {}
    }
})
