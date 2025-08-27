window.onload = () => {
  const addBufferButton = document.getElementById('add-buffer-button');
  if (addBufferButton) {
    addBufferButton.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("page.html") });
      window.close();
    });
  }
};
