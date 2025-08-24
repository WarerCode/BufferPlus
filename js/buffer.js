const STATES = {
    opened: 1,
    closed: 0,
}

export class Buffer {
    constructor(state = STATES.closed){
        this.element;
        this.state = state;

        this.init();
    }

    init() {
        if (this.state == 1) {
            active_class = "active";
        } else {
            active_class = "";
        }
        this.element = `
            <div class="buffer_container ${active_class}">
                <div class="meta">
                    <h4>Buffer</h4>
                    <button class="del_buffer">X</button>
                </div>
                <div class="notes_container">
                </div>
            </div>
        `;

        bindEvents();
    }

    bindEvents() {
        const del_btn = this.element.querySelector(".del_buffer");
        if (del_btn) {
            del_btn.addEventListener('click', () => this.element.remove());
        }

        const meta_area = this.element.querySelector(".meta");
        if (meta_area) {
            meta_area.addEventListener('click', () => this.swapActive());
        }
    }

    swapActive(this) {
        this.element.classList.toggle('active');
        if (this.element.classList.contains('active')) {
            this.state = 1;
        } else {
            this.state = 0;
        }
    }

}