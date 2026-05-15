const photoInput = document.getElementById('fenderPhoto');
const photoPreview = document.getElementById('photoPreview');
const photoDrop = document.querySelector('.photo-upload__drop');
const form = document.getElementById('customFenderForm');
const statusText = document.getElementById('customFenderStatus');

if (photoInput && photoPreview && photoDrop) {
  photoInput.addEventListener('change', () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;

    photoPreview.src = URL.createObjectURL(file);
    photoDrop.classList.add('has-preview');
  });
}

if (form && statusText) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    statusText.textContent = 'Demande prête avec les informations et la photo sélectionnée.';
  });
}
