const template = document.createElement('template')
template.innerHTML = `
    <style>
        fieldset {
            position: relative;
            padding: 0 !important;
            border: 0 !important;

            > svg {
                margin-bottom: 0.5rem;
            }
        }

        .next-step-wrapper, .register-submit-wrapper {
            position: relative;
            padding: 1rem 0;
        }

        #next-step {
            width: 50%;
            margin: 1rem auto 0 auto;
            padding: 0.8rem 0.5rem;
            font-size: 1rem;
            font-weight: bold;
            background-color: #facc15;
            border: 0;
            border-radius: 20px;
            cursor: pointer;

            &:hover {
                background-color: #eab308;
            }
        }

        #register-submit {
            margin-top: 2.5rem;
        }

        #prev {
            margin-bottom: 0.5rem;
            background: transparent !important;
            border: 0 !important;
        }
    </style>
    <slot name="step-0"></slot>
    <slot name="step-1"></slot>
`

customElements.define('multi-step-form', class extends HTMLElement {
    _activeStep = 0;

    _event = new CustomEvent('step-change', {
        bubbles: true
    })

    constructor() {
        super();
        this._errors = false;

        this.attachShadow({
            mode: 'open'
        }).append(template.content.cloneNode(true))

        this.handleToggleActiveStep()
    }

    connectedCallback() {
        const slots = this.shadowRoot.querySelectorAll('slot')

        slots.forEach((slot) => {
            const nextStep = slot.assignedNodes()[0].querySelector('#next-step') ?? null
            const prevStep = slot.assignedNodes()[0].querySelector('#prev-step') ?? null

            nextStep?.addEventListener('click', () => this.handleNextStep())
            prevStep?.addEventListener('click', () => this.handlePrevStep())
        })
    }

    get activeStep() {
        return this._activeStep;
    }

    set activeStep(step) {
        this._activeStep = step
        this.handleToggleActiveStep()
    }

    get errors() {
        return this._errors;
    }

    set errors(val) {
        this._errors = val;
    }

    handleNextStep = () => {
        this.dispatchEvent(this._event)
        !this.errors && this.activeStep++
    }

    handlePrevStep = () => {
        this.activeStep--;
    }

    handleToggleActiveStep = () => {
        const steps = [...this.shadowRoot.querySelectorAll('slot')]
        
        steps.forEach((step) => {
            const isActive = step.name == `step-${this.activeStep}`
            step.style.display = isActive ? "block" : "none"
        })
    }
})