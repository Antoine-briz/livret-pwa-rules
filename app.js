let currentPage = 1;  // Page actuelle
let pdfDoc = null;    // Référence au document PDF

// Gestion du clic sur l'image "couverture" pour afficher le menu
document.getElementById('cover-img').addEventListener('click', function() {
    document.querySelector('.welcome-page').style.display = 'none';  // Cacher la page d'accueil
    document.getElementById('menu').style.display = 'block';  // Afficher le menu
    populateMenu();  // Remplir le menu avec les liens des PDF
});

// 1. Définir la fonction renderHome pour afficher la page d'accueil
function renderHome() {
    const appContainer = document.getElementById("app");

    // Effacer le contenu existant
    appContainer.innerHTML = "";

    // Créer le contenu de la page d'accueil
    const welcomeMessage = document.createElement("h2");
    welcomeMessage.textContent = "Bienvenue dans le livret PWA !";

    const description = document.createElement("p");
    description.textContent = "Cliquez sur l'image pour continuer.";

    // Ajouter le contenu dans le conteneur #app
    appContainer.appendChild(welcomeMessage);
    appContainer.appendChild(description);
}

// 2. Déclaration de la fonction openPDF (avec `export` pour pouvoir l'utiliser ailleurs)
export function openPDF(pdfPath) {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("Le conteneur avec l'ID 'app' n'a pas été trouvé.");
        return;
    }

    appContainer.innerHTML = "";

    const pdfViewer = document.createElement("div");
    pdfViewer.id = "pdfViewer";
    appContainer.appendChild(pdfViewer);

    // Assure-toi que le chemin complet vers le PDF est correct
    const pdfUrl = './pdf/' + pdfPath;  // Ajoute le répertoire 'pdf/' devant le chemin

    const pdfName = pdfPath.split("/").pop().split(".")[0];
    history.pushState(null, '', `#/${pdfName}`);
    console.log('Current URL:', window.location.href);

    const navContainer = document.createElement("div");
    navContainer.classList.add("pdf-nav");

    const prevButton = document.createElement("button");
    prevButton.textContent = "Précédent";
    prevButton.addEventListener("click", () => goToPage(currentPage - 1));

    const nextButton = document.createElement("button");
    nextButton.textContent = "Suivant";
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);
    appContainer.appendChild(navContainer);

    const backButton = document.createElement("button");
    backButton.textContent = "Retour";
    backButton.classList.add("btn");
    backButton.addEventListener("click", () => {
        window.location.hash = "#/";  // Redirige vers la page d'accueil
    });
    appContainer.appendChild(backButton);

    // Utilise le chemin corrigé pour ouvrir le PDF
    pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        renderPage(currentPage);
    }).catch((error) => {
        console.error("Erreur lors du chargement du PDF :", error);
    });
}


// 3. Fonction pour afficher une page spécifique
function renderPage(pageNum) {
    const viewer = document.getElementById('pdfViewer');
    if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

    pdfDoc.getPage(pageNum).then(page => {
        const canvas = document.createElement('canvas');
        viewer.innerHTML = ''; // Réinitialiser la vue avant d'ajouter une nouvelle page
        viewer.appendChild(canvas);

        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
            currentPage = pageNum;
        });
    });
}

// 4. Fonction pour aller à une page spécifique
function goToPage(pageNum) {
    renderPage(pageNum);
}

// 5. Fonction pour remplir le menu avec les liens vers les PDFs
function populateMenu() {
    const imgList = [
        { name: 'Echographie pratique', pdf: 'echographie.pdf', image: 'echographie.png' },
        { name: 'Ventilation mécanique', pdf: 'ventilation.pdf', image: 'ventilation.png' },
        { name: 'Bactériologie clinique', pdf: 'bacterio.pdf', image: 'bacterio.png' },
        { name: 'Epuration extra-rénale', pdf: 'dialyse.pdf', image: 'dialyse.png' },
        { name: 'EEG continu', pdf: 'eeg.pdf', image: 'eeg.png' },
        { name: 'Maladies de système', pdf: 'systeme.pdf', image: 'systeme.png' },
        { name: 'Médicaments et posologies', pdf: 'medicaments.pdf', image: 'medicaments.png' }
    ];

    const imgContainer = document.getElementById('image-list');
    imgContainer.innerHTML = '';  // Effacer tout le contenu précédent

    imgList.forEach(item => {
        // Créer un élément div pour chaque image et son titre
        let imgDiv = document.createElement('div');
        imgDiv.classList.add('image-container');

        // Créer l'élément image
        let imgElement = document.createElement('img');
        imgElement.src = 'img/' + item.image;
        imgElement.alt = item.name;
        imgElement.classList.add('image-item');

        // Créer le titre en dessous de l'image
        let title = document.createElement('p');
        title.textContent = item.name;

        // Ajouter l'image et le titre à l'élément div
        imgDiv.appendChild(imgElement);
        imgDiv.appendChild(title);

        // Ajouter un événement pour ouvrir le PDF lorsque l'image est cliquée
        imgDiv.addEventListener('click', () => openPDF(item.pdf));

        // Ajouter l'élément div au conteneur du menu
        imgContainer.appendChild(imgDiv);
    });
}

// 6. Fonction de monté de contenu (équivalent de `mount` dans ton autre code)
window.addEventListener("hashchange", () => {
    console.log("Hash changed:", location.hash);
    mount();
});

window.addEventListener("load", () => {
    if (!location.hash) {
        location.hash = "#/"; // Redirige vers la page d'accueil si aucun hash
    }
    console.log("Page loaded, current hash:", location.hash);
    mount();
});

// Fonction pour afficher le contenu en fonction du hash actuel
function mount() {
    const route = routes[location.hash];
    const appContainer = document.getElementById("app");

    if (route) {
        route();
    } else {
        console.error("No route found for", location.hash);
        appContainer.innerHTML = "<h2>Page Non Trouvée</h2>"; // Affiche une erreur si la route n'est pas trouvée
    }
}

// Fonction utilitaire pour encapsuler du HTML (si nécessaire)
function h(cls, html) {
    return `<div class="${cls}">${html}</div>`;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration);
      })
      .catch((error) => {
        console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
      });
  });
}

