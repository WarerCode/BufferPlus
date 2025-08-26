const noteDelButtonHTML = `
    <button class="delete-cell-button">
        <img class="half" src="static/icons/Close-Half-Red.svg" alt="Delete item">
        <img class="red" src="static/icons/Close-Red.svg" alt="Delete item">
    </button>
`;

class Note {

    constructor(){
        this.element = null;
    }

    bindEvents() {
        this.element.querySelector(".delete-cell-button").addEventListener('click', () => {
            this.destroy();
        });
    }

    destroy() {
        const el_container = this.element.parentNode;
        this.element.remove();

        const tempBuffer = new Buffer()
        tempBuffer.checkHintTag(el_container, el_container.querySelectorAll(".content-row").length);
    }

}

export class ImageNote extends Note {

    constructor(file){
        super();
        this.file = file;
        this.init();
    }

    init() {
        const innerHTML = `
            <div class="content-row">
                <div class="image-placeholder">
                    <img/>
                </div>
                ${noteDelButtonHTML}
            </div>
        `;

        this.element = createTagByHTML(innerHTML);

        // Создаем превью изображения
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = this.element.querySelector("img");
            img.src = e.target.result;
            img.className = 'dropped-image';
            img.alt = this.file.name;
        };
        reader.readAsDataURL(this.file);
        
        this.bindEvents();
    }

    bindEvents() {
        super.bindEvents();
    }

}

export class TextNote extends Note {

    constructor(text) {
        super();
        this.text = text;
        this.init();
    }

    init() {
        const innerHTML = `
            <div class="content-row">
                <textarea class="content-text">${this.text}</textarea>
                ${noteDelButtonHTML}
            </div>
        `;

        this.element = createTagByHTML(innerHTML);
        
        this.bindEvents();
    }

    bindEvents() {
        super.bindEvents();
        this.element.querySelector('textarea').addEventListener('input', function () {  
            this.style.height = 'auto';  
            this.style.height = `${this.scrollHeight}px`;  
        });  
    }

}

export class FileNote extends Note {

    constructor(file) {
        super();
        this.file = file;
        this.fileURL = URL.createObjectURL(file);
        this.textContent = `📄 ${this.file.name}<br>Размер: ${this.formatFileSize(file.size)}`;
        this.init();
    }

    init() {
        const innerHTML = `
            <div class="content-row">
                <a href="${this.fileURL}" class="content-link" target="_blank">${this.textContent}</a>
                ${noteDelButtonHTML}
            </div>
        `;

        this.element = createTagByHTML(innerHTML);
        
        this.bindEvents();
    }

    bindEvents() {
        super.bindEvents();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export {TextNote, ImageNote, FileNote};
