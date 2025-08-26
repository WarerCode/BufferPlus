function createTagByHTML(innerHTML) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = innerHTML;
    return tempDiv.firstElementChild.cloneNode(true);
}

const generator = document.getElementById('add-buffer-button');
const buffers_group_container = document.getElementById('buffers_group_container');
const del_all_buffers_button = document.getElementById('delete-all-button');

console.log("start");

generator.addEventListener('click', () => {
    const buffer = new Buffer();
    buffers_group_container.appendChild(buffer.element); 
});
del_all_buffers_button.addEventListener('click', () => {
    buffers_group_container.innerHTML = "";
});
