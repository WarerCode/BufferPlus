
const generator = document.getElementById('add-buffer');
const container = document.getElementById('container');

console.log("start");

generator.addEventListener('click', () => {
    const note = new TextNote("mikadono.png");             
    container.appendChild(note.element); 
});
