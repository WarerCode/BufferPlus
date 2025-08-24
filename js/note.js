
class Note {

    constructor(){
        this.element = document.createElement('div');
        this.element.className = 'note';

        this.terminator = document.createElement('button');
        this.terminator
        this.terminator.textContent = 'X';
        this.terminator.addEventListener('click', () => {
            this.destroy();
        });

        this.element.appendChild(this.terminator);
    }

    destroy() {
        this.element.remove();
        this.terminator.remove();
    }

}

export class ImageNote extends Note {

    constructor(imageUrl){
        super();
        this.imageUrl = imageUrl;
        this.renderImg();
    }

    renderImg() {
        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.style.maxWidth = '100%';

        this.element.appendChild(img);
    }

}

export class TextNote extends Note {

    constructor(text) {
        super();
        this.text = text;
        this.renderText();
    }

    renderText() {
        const textedit = document.createElement('textarea');
        textedit.textContent = this.text;
        textedit.style.maxWidth = '100%';

        this.element.appendChild(textedit);
    }

}

export class FileNote extends Note {

    constructor(file) {
        super();
        this.file = file;
        this.renderFileInfo();
    }

    renderFileInfo() {
        const info = document.createElement('div');
        info.style.fontFamily = 'monospace';
        info.style.whiteSpace = 'pre-wrap';

        const fileSizeKb = (this.file.size / 1024).toFixed(2);
        
        info.textContent = `📄 ${this.file.name}\nТип: ${this.file.type || 'неизвестен'}\nРазмер: ${fileSizeKb} KB`;

        this.element.appendChild(info);
    }
}

export {TextNote, ImageNote, FileNote};
