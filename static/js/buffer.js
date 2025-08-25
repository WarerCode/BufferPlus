class Buffer {
    pk = 1;

    constructor() {
        this.element = null; // Будет DOM-элементом
        this.init();
    }

    init() {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
            <article class="buffer-item">
                <header class="buffer-header">
                    <div class="buffer-title-group">
                        <img class="closed" src="static/icons/Arrows-Down.svg" alt="Collapse">
                        <img class="opened" src="static/icons/Arrows-Up.svg" alt="Collapse">
                        <h4 class="buffer-title">Буфер 1</h4>
                    </div>
                    <button class="del-button">
                        <img class="closed" src="static/icons/Trash-Red.svg" alt="Delete">
                        <img class="opened" src="static/icons/Trash-White.svg" alt="Delete">
                    </button>
                </header>
                <div class="buffer-content">
                    <div class="content-row">
                    <p class="content-text">Какой-то скопированный текст Какой-то скопированный текст Какой-то скопированный
                        текст Какой-то скопированный текст Какой-то скопированный текст</p>
                    <button class="delete-cell-button">
                        <img src="static/icons/Close-Half-Red.svg" alt="Delete item">
                    </button>
                    </div>
                    <div class="separator"></div>
                    <div class="content-row">
                    <a href="#" class="content-link">Ссылка на файл (или что-то другое), который поместили сюда</a>
                    <button class="delete-cell-button">
                        <img src="static/icons/Close-Half-Red.svg" alt="Delete item">
                    </button>
                    </div>
                    <div class="separator"></div>
                    <div class="content-row">
                    <div class="image-placeholder">
                        <span class="image-placeholder-text">Изображение</span>
                    </div>
                    <button class="delete-cell-button delete-cell-button-danger">
                        <img src="static/icons/Close-Half-Red.svg" alt="Delete item">
                    </button>
                    </div>
                </div>
                </article>
        `;

        // Клонируем и добавляем элемент
        this.element = tempDiv.firstElementChild.cloneNode(true);
        
        this.bindEvents();
        this.bindDragDropEvents();
    }

    bindEvents() {
        const del_btn = this.element.querySelector(".del-button");
        if (del_btn) {
            del_btn.addEventListener('click', () => this.element.remove());
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
            
            switch (fileType) {
                case 'image':
                    this.handleImageFile(file);
                    break;
                case 'text':
                    this.handleTextFile(file);
                    break;
                default:
                    this.handleOtherFile(file);
            }
        });
    }

    handleText(text) {
        console.log('Обнаружен текст:', text);
        
        const note = TextNote(text);
        
        this.addToContent(textElement);
    }

    handleImageFile(file) {
        console.log('Обнаружено изображение:', file.name);
        
        // Создаем превью изображения
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'dropped-image';
            img.alt = file.name;
            
            this.addToContent(img);
        };
        reader.readAsDataURL(file);
    }

    handleTextFile(file) {
        console.log('Обнаружен текстовый файл:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const pre = document.createElement('pre');
            pre.className = 'text-file-content';
            pre.textContent = e.target.result;
            
            this.addToContent(pre);
        };
        reader.readAsText(file);
    }

    handleOtherFile(file) {
        console.log('Обнаружен файл другого типа:', file.name);
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `
            <span class="file-icon">📁</span>
            <span class="file-name">${file.name}</span>
            <span class="file-size">(${this.formatFileSize(file.size)})</span>
        `;
        
        this.addToContent(fileInfo);
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

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    addToContent(element) {
        const notesContainer = this.element.parentElement();
        const dropHint = notesContainer.querySelector('.drop-hint');
        
        // Убираем подсказку при первом добавлении контента
        if (dropHint) {
            dropHint.remove();
        }
        
        notesContainer.appendChild(element);
    }

    swapActive() {
        this.element.classList.toggle('active');
    }

}