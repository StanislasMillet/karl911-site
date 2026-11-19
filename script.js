// Récupère toutes les photos et vidéos cliquables dans l'ordre du HTML
const items = Array.from(document.querySelectorAll('.photos img, .photos video'));
let currentIndex = 0;

// Création de la lightbox avec support image, vidéo et flèches
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-arrow prev" aria-label="Précédent">‹</button>
  <div class="lightbox-inner">
    <img alt="">
    <video autoplay muted loop playsinline controls></video>
    <div class="lightbox-title"></div>
  </div>
  <button class="lightbox-arrow next" aria-label="Suivant">›</button>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const lightboxVid = lightbox.querySelector('video');
const lightboxTitle = lightbox.querySelector('.lightbox-title');

function showItem(index) {
  // Boucle infinie d'un bout à l'autre de la galerie
  currentIndex = (index + items.length) % items.length;
  const el = items[currentIndex];
  const isVideo = el.tagName === 'VIDEO';

  if (isVideo) {
    lightboxImg.style.display = 'none';
    lightboxVid.style.display = 'block';
    lightboxVid.src = el.currentSrc || el.src;
    lightboxVid.play();
  } else {
    lightboxVid.pause();
    lightboxVid.style.display = 'none';
    lightboxImg.style.display = 'block';
    lightboxImg.src = el.src;
    lightboxImg.alt = el.dataset.title || '';
  }

  lightboxTitle.textContent = el.dataset.title || '';
  lightbox.classList.add('on');
}

// Ouvrir au clic sur une photo ou la vidéo des colonnes
document.querySelector('.photos').addEventListener('click', e => {
  if (e.target.tagName !== 'IMG' && e.target.tagName !== 'VIDEO') return;
  const index = items.indexOf(e.target);
  if (index !== -1) showItem(index);
});

// Clic sur les flèches
lightbox.querySelector('.prev').addEventListener('click', e => {
  e.stopPropagation();
  showItem(currentIndex - 1);
});

lightbox.querySelector('.next').addEventListener('click', e => {
  e.stopPropagation();
  showItem(currentIndex + 1);
});

// Éviter de fermer la lightbox si on clique sur la vidéo elle-même
lightboxVid.addEventListener('click', e => e.stopPropagation());

// Fermer en cliquant sur le fond
lightbox.addEventListener('click', () => {
  lightboxVid.pause();
  lightbox.classList.remove('on');
});

// Navigation au clavier (Flèches gauche/droite + Échap)
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('on')) return;
  if (e.key === 'Escape') {
    lightboxVid.pause();
    lightbox.classList.remove('on');
  } else if (e.key === 'ArrowRight') {
    showItem(currentIndex + 1);
  } else if (e.key === 'ArrowLeft') {
    showItem(currentIndex - 1);
  }
});