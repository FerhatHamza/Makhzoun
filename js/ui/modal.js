const modal = document.getElementById('globalModel');
const title = document.getElementById('modelTitle');
const body = document.getElementById('modelBody');
const saveBtn = document.getElementById('saveModel');
const cancelBtn = document.getElementById('closeModel');



let onSave = null;



export function openModal({ modalTitle, content, onConfirm }) {
  title.textContent = modalTitle;
  body.innerHTML = '';
  body.appendChild(content);
//   body.innerHTML = content;

  onSave = onConfirm;

  modal.classList.remove('hidden');
}

export function closeModal() {
  modal.classList.add('hidden');
}

saveBtn.onclick = () => {
  if (onSave) onSave();
  closeModal();
};


cancelBtn.onclick = closeModal;