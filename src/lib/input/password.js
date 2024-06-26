customElements.define('password-input', class extends HTMLElement {
    static formAssociated = true;

    _internals;
    $input;
    _attrs = {};

    static get observedAttributes() {
        return ["value", "rules", "placeholder", "error"]
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
                    height: 2.75rem;
                    margin-bottom: 2.5rem;
                }

                input {
                    width: calc(100% - 0.875rem);
                    padding: 18px 0px 10px 0.75rem;
                    margin-top: 6px;
                    outline: 1.5px solid rgba(107, 107, 107, 0.4);
                    border: 1px solid #09090b;
                    border-radius: 3px;
                    color: white;
                    background-color: #030712;
                }

                input:focus {
                    border: 1.8px solid #facc15;
                    outline: none;
                }

                input:focus+span, input:not(:placeholder-shown)+span {
                    top: 35px;
                    left: 12px;
                    color: #fde047;
                    -webkit-transform: scale(0.7) translateY(-10%) translateX(-8.5px);
                    transform: scale(0.7) translateY(-10%) translateX(-20px);
                }
                span {
                    position: absolute;
                    left: 10px;
                    top: calc(100% + 8px);
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

                input.error {
                    border: 1px solid #9f1239 !important;
                    outline: 1.5px solid #e11d48 !important;
                }

                label {
                    font-size: 0.875rem;
                    opacity: 0.5;
                    margin-bottom: 0.5rem !important;
                }

                #toggle {
                    position: absolute;
                    right: 1rem;
                    top: 2.8rem;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    pointer-events: all;
                    z-index: 999999;
                }

                .eye-open {
                   cursor: pointer;
                }

                .eye-closed {
                    cursor: pointer;
                 }
                
                .hide {
                    display: none;
                }

                #rules {
                    display: none;
                    flex-wrap: wrap;
                    gap: 0.5rem 1rem;
                    margin: 0 !important;
                    padding: 0.5rem 0 !important;
                    list-style-type: none;

                    > li {
                        font-size: 0.75rem;
                        opacity: 0.5;
                    }
                }

                .is-valid {
                    color: green !important;
                }

                .is-error {
                    color: red;
                }
            </style>
            <div class="wrapper">
                <div id="toggle">
                    <svg class="eye-open" width="22" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 0c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.82 9C5.609 18 1.123 14.12.182 9 1.12 3.88 5.608 0 11 0zm0 16a9.005 9.005 0 0 0 8.777-7A9.005 9.005 0 0 0 2.223 9 9.005 9.005 0 0 0 11 16zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="#64707D"/>
                    </svg>
                    <svg class="eye-closed hide" width="22" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.882 18.297A10.95 10.95 0 0 1 11 20C5.608 20 1.122 16.12.18 11a10.982 10.982 0 0 1 3.34-6.066L.393 1.808 1.807.393l19.799 19.8-1.415 1.414-3.31-3.31zM4.935 6.35A8.965 8.965 0 0 0 2.223 11a9.006 9.006 0 0 0 13.2 5.838l-2.027-2.028A4.5 4.5 0 0 1 7.19 8.604L4.935 6.35zm6.979 6.978-3.242-3.242a2.5 2.5 0 0 0 3.24 3.241l.002.001zm7.893 2.264-1.431-1.43a8.936 8.936 0 0 0 1.4-3.162A9.006 9.006 0 0 0 8.553 4.338L6.974 2.76C8.22 2.27 9.58 2 11 2c5.392 0 9.878 3.88 10.819 9a10.95 10.95 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.77l-4.77-4.77z" fill="#64707D"/>
                    </svg>
                </div>
                <label for="password">Password</label>
                <input type="password" name="password" role="none" tabindex="-1" placeholder=" "/>
                <span data-placeholder>Enter password</span>

                <ul id="rules">
                    <li data-rule="Uppercase">At least one lowercase letter</li>
                    <li data-rule="MinChars">Minimum 8 characters</li>
                    <li data-rule="SpecialChar">One special character</li>
                    <li data-rule="OneDigit">At least one number</li>
                </ul>
            </div>
        `
    }

    connectedCallback() {
        this.$input = this.shadowRoot.querySelector('input')
        this.$toggle = this.shadowRoot.querySelector('#toggle')
  
        this.setProps()
        this._internals.setFormValue(this.value)
        this.$input.addEventListener('input', () => this.handleInput())
        this.$input.addEventListener('blur', () => this.handleValidationOnBlur())
        this.$toggle.addEventListener('click', () => this.handleTogglePasswordMask())

        this._rules = {
            Uppercase: {
                rule: (v) => /[A-Z]/.test(v),
                valid: false,
                element: this.shadowRoot.querySelector('[data-rule="Uppercase"]')
            },
            MinChars: {
                rule: (v) => v.length >= 8,
                valid: false,
                element: this.shadowRoot.querySelector('[data-rule="MinChars"]')
            },
            specialChar: {
                rule: (v) => /[*@!#%&()^~{}]+/.test(v),
                valid: false,
                element: this.shadowRoot.querySelector('[data-rule="SpecialChar"]')
            },
            oneDigit: {
                rule: (v) => /\d/.test(v),
                valid: false,
                element: this.shadowRoot.querySelector('[data-rule="OneDigit"]')
            }
        }
    }

    handleTogglePasswordMask = () => {
        const eyeOpen = this.$toggle.querySelector('#toggle .eye-open')
        const eyeClosed = this.$toggle.querySelector('#toggle .eye-closed')
        
        eyeOpen.classList.toggle('hide')
        eyeClosed.classList.toggle('hide')

        this.$input.type = this.$input.type == 'password' ? 'text' : 'password'
    }

    showError = (status) => {
        if (status) {
            this.$input.classList.add('error')
        } else {
            this.$input.classList.remove('error')
        }
    }

    handleInput = () => {
        this.setAttribute('error', false)
        this.handleValidation()

        this._internals.setFormValue(this.$input.value)
    }

    handleValidation = () => {   
        Object.keys(this._rules).map((k) => {
            const el = this._rules[k].element
            this._rules[k].valid = this._rules[k].rule(this.$input.value)

            const valid = this._rules[k].valid

            if (valid) {
                el.style.opacity = '1'
                el.classList.add('is-valid')
            } else {
                el.classList.remove('is-valid')
                el.style.opacity = '0.5'
            }
        })
    }

    handleValidationOnBlur = () => {
        Object.keys(this._rules).map((k) => { 
            const valid = this._rules[k].valid

            if (!valid) this._rules[k].element.classList.add('is-error')
        })
    }

    attributeChangedCallback(attr, prev, next) {
        this._attrs[attr] = next
        this.setProps()
    }

    setProps = () => {
        if (!this.$input) return;

        for (let prop in this._attrs) {
            switch (prop) {
                case "value":
                    this.$input.value = this._attrs[prop]
                    break;
                case "rules":
                    this.shadowRoot.getElementById('rules').style.display = "flex";
                    break;
                case "placeholder":
                    this.shadowRoot.querySelector('[data-placeholder]').innerText = this._attrs[prop]
                    break;
                case "error":
                    this.showError(this._attrs[prop])
                    break;
            }
        }

        this._attrs = {}
    }
})