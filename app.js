
let currentPage = 1;  // Page actuelle
let pdfDoc = null;    // Référence au document PDF

// Gestion du clic sur l'image "couverture" pour afficher le menu
document.getElementById('cover-img').addEventListener('click', function() {
    document.querySelector('.welcome-page').style.display = 'none';  // Cacher la page d'accueil
    document.getElementById('menu').style.display = 'block';  // Afficher le menu
    document.getElementById('livret-title-menu').style.display = 'block';  // Afficher le titre sur la page du menu
    populateMenu();  // Remplir le menu avec les liens des PDF
});

const routes = {
    "#/": renderHome, // La route pour la page d'accueil
    "#/menu": renderMenu, // La route pour le menu
    "#/echographie": () => openPDF("echographie.pdf"), // Ouvre le PDF de l'échographie
    "#/ventilation": () => openPDF("ventilation.pdf"), // Ouvre le PDF de la ventilation
    "#/bacterio": () => openPDF("bacterio.pdf") // Ouvre le PDF de la bactériologie clinique
};

// 1. Définir la fonction renderHome pour afficher la page d'accueil
function renderHome() {
    const appContainer = document.getElementById("app");

    // Effacer le contenu existant
    appContainer.innerHTML = "";

    // Créer le contenu de la page d'accueil
    const welcomeMessage = document.createElement("h2");
    welcomeMessage.textContent = "Bienvenue dans le livret PWA !";

 const menuImage = document.createElement("img");
    menuImage.src = "img/titre.png";  // Chemin de l'image
    menuImage.alt = "Livret de réanimation clinique";  // Texte alternatif
    menuImage.style.width = "100%";  // Ajuster la largeur de l'image

    const description = document.createElement("p");
    description.textContent = "Cliquez sur l'image pour continuer.";

    // Ajouter le contenu dans le conteneur #app
    appContainer.appendChild(welcomeMessage);
    appContainer.appendChild(description);
    appContainer.appendChild(menuImage);
}

// 2. Déclaration de la fonction openPDF
export function openPDF(pdfPath) {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("Le conteneur avec l'ID 'app' n'a pas été trouvé.");
        return;
    }

    // Vider l'élément #app avant de charger le PDF
    appContainer.innerHTML = "";

    // Créer un conteneur pour afficher le PDF
    const pdfViewer = document.createElement("div");
    pdfViewer.id = "pdfViewer";
    appContainer.appendChild(pdfViewer);

    // Ajouter un log pour vérifier l'URL du PDF
    console.log("Tentative de chargement du PDF : ", pdfPath);

    // Modifier l'URL pour refléter l'ouverture du PDF
    const pdfName = pdfPath.split("/").pop().split(".")[0];  // Exemple : "antibiorein" pour antibiotique rénal
    history.pushState(null, '', `#/${pdfName}`);

    console.log('Current URL:', window.location.href);

    // Créer les boutons de navigation pour les PDF
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

    // Créer un bouton "Retour" pour revenir au menu principal
    const backButton = document.createElement("button");
backButton.type = "button";  // Définir le type du bouton
backButton.classList.add("btn", "ghost");  // Ajouter les classes "btn" et "ghost"
backButton.textContent = "← Retour";  // Ajouter le texte et la flèche
backButton.onclick = function() {
    // Changer le hash pour revenir à la page principale
    window.location.hash = "#/";  // Redirige vers la page principale
    mount(); // Forcer le rendu de la page d'accueil
};

appContainer.appendChild(backButton);

    // Cacher le menu et les autres éléments, afficher uniquement le PDF
    document.getElementById('menu').style.display = 'none';  // Masquer le menu
    document.querySelector('.welcome-page').style.display = 'none';  // Masquer la page d'accueil

    // Charger le PDF avec PDF.js
    const pdfUrl = './pdf/' + pdfPath;
    console.log("URL complète du PDF : ", pdfUrl);

    // Charger le document PDF avec pdf.js et récupérer la première page
    pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        renderPage(currentPage);  // Appeler la fonction renderPage pour afficher la première page
    }).catch((error) => {
        console.error("Erreur lors du chargement du PDF :", error);
    });
}

// Fonction pour rendre la page actuelle
function renderPage(pageNum) {
    const viewer = document.getElementById('pdfViewer');

    // Vérifier les limites des pages
    if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

    pdfDoc.getPage(pageNum).then(page => {
        const canvas = document.createElement('canvas');
        viewer.innerHTML = '';  // Réinitialiser la vue avant d'ajouter une nouvelle page
        viewer.appendChild(canvas);

        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 0.75 });  // Appliquer un zoom pour le PDF
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Rendu de la page sur le canvas
        page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
            currentPage = pageNum;
        });
    });
}

// Fonction pour aller à une page spécifique
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

        // Ajouter l'image et le titre à l'élément div
        imgDiv.appendChild(imgElement);

        // Ajouter un événement pour ouvrir le PDF lorsque l'image est cliquée
        imgDiv.addEventListener('click', () => openPDF(item.pdf));

        // Ajouter l'élément div au conteneur du menu
        imgContainer.appendChild(imgDiv);
    });
  
    // Attacher les gestionnaires d'événements aux boutons "Table des matières" et "Table des abréviations"
    document.getElementById("table-of-contents").addEventListener("click", function() {
        openPDF("tablemetiere.pdf");  // Ouvrir le PDF des tables des matières
    });

    document.getElementById("abbreviations").addEventListener("click", function() {
        openPDF("tableabrev.pdf");  // Ouvrir le PDF des tables des abréviations
    });
}

// 6. Fonction pour monter le contenu en fonction du hash dans l'URL
function mount() {
    const route = routes[location.hash] || renderHome; // fallback si hash non défini
    route(); // affiche la page correspondante
}

// Routes de l'application


// 7. Ajout des écouteurs d'événements pour détecter les changements dans l'URL et charger la bonne page
window.addEventListener("hashchange", mount); // Met à jour la page quand le hash change
window.addEventListener("load", mount);  // Met à jour la page au chargement de la page

