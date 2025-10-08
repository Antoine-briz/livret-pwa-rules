let currentPage = 1;  // Page actuelle
let pdfDoc = null;    // Référence au document PDF

// Routes de l'application
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
