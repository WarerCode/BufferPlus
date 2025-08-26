class Buffer {
    constructor() {
        this.element = null;
        this.notesContainer = null;
        this.init();
    }

    init() {
        const innerHTML = `
            <article class="buffer-item">
                <header class="buffer-header">
                    <div class="buffer-title-group">
                        <img class="closed" src="static/icons/Arrows-Down.svg" alt="Collapse">
                        <img class="opened" src="static/icons/Arrows-Up.svg" alt="Collapse">
                        <h4 class="buffer-title">Буфер</h4>
                    </div>
                    <button class="del-button">
                        <img class="closed" src="static/icons/Trash-Red.svg" alt="Delete">
                        <img class="opened" src="static/icons/Trash-White.svg" alt="Delete">
                    </button>
                </header>
                <div class="buffer-content">
                    <p class="placeholder-text">Вставьте текст или перетащите файл</p>
                </div>
            </article>
        `;

        this.element = createTagByHTML(innerHTML);
        this.notesContainer = this.element.querySelector(".buffer-content");
        
        this.bindEvents();
        this.bindDragDropEvents();
    }

    bindEvents() {
        const del_btn = this.element.querySelector(".del-button");
        if (del_btn) {
            del_btn.addEventListener('click', () => {
                this.element.remove();
            });
        }

        const buffer_header = this.element.querySelector(".buffer-header");
        if (buffer_header) {
            buffer_header.addEventListener('click', () => this.swapActive());
        }
    }

    bindDragDropEvents() {
        const dropZone = this.element;
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropZone.addEventListener('drop', (e) => {
            this.handleDrop(e);
        });
    }

    handleDrop(event) {
        const dataTransfer = event.dataTransfer;
        console.log("dropped");
        console.log(dataTransfer);
        console.log(dataTransfer.files);
        
        if (dataTransfer.files && dataTransfer.files.length > 0) {
            this.handleFiles(dataTransfer.files);
        } 
        else if (dataTransfer.getData('text')) {
            this.handleText(dataTransfer.getData('text'));
        }
        else {
            console.log('Неизвестный тип данных');
        }
    }

    handleFiles(files) {
        console.log('Обнаружены файлы:', files);
        
        // Обрабатываем каждый файл
        Array.from(files).forEach(file => {
            const fileType = this.getFileType(file);
            console.log(fileType);
            
            switch (fileType) {
                case 'image':
                    this.handleImageFile(file);
                    break;
                default:
                    this.handleOtherFile(file);
            }
        });
    }

    handleText(text) {
        const note = new TextNote(text);
        this.addToContent(note.element);
    }

    handleImageFile(file) {
        const note = new ImageNote(file);
        this.addToContent(note.element);
    }

    handleOtherFile(file) {
        console.log('Обнаружен файл другого типа:', file.name);

        const note = new FileNote(file);
        this.addToContent(note.element);
    }

    getFileType(file) {
        const type = file.type.split('/')[0];
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (type === 'image') return 'image';
        if (type === 'text') return 'text';
        if (file.type === 'application/pdf') return 'pdf';
        if (type === 'audio') return 'audio';
        if (type === 'video') return 'video';
        if (['txt', 'md', 'html', 'css', 'js'].includes(extension)) return 'text';
        
        return 'other';
    }

    checkHintTag(notesContainer, content_rows_count) {
        const hintTag = notesContainer.querySelector(".placeholder-text");
        if (content_rows_count > 0) {
            hintTag.classList.add("d_none");
        } else {
            hintTag.classList.remove("d_none");
        }
    }

    addToContent(element) {
        this.notesContainer.appendChild(element);
        this.checkHintTag(this.notesContainer, 1);
    }

    swapActive() {
        this.element.classList.toggle('active');
    }

}