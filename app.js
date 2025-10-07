let currentPage = 1;  // Page actuelle
let pdfDoc = null;    // Référence au document PDF

// 1. Déclaration de la fonction openPDF (avec `export` pour pouvoir l'utiliser ailleurs)
export function openPDF(pdfPath) {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
        console.error("Le conteneur avec l'ID 'app' n'a pas été trouvé.");
        return; // Stop the function if 'app' is not found
    }

    // Effacer le contenu existant
    appContainer.innerHTML = "";

    // Créer un div pour le PDF avec une barre de défilement
    const pdfViewer = document.createElement("div");
    pdfViewer.id = "pdfViewer";
    appContainer.appendChild(pdfViewer);

    // Modifier l'URL pour refléter l'ouverture du PDF
    const pdfName = pdfPath.split("/").pop().split(".")[0]; // Exemple : "antibiorein" pour antibiotique rénal
    history.pushState(null, '', `#/${pdfName}`);
    console.log('Current URL:', window.location.href);

    // Créer les boutons de navigation pour le PDF
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
    backButton.textContent = "Retour";
    backButton.classList.add("btn");
    backButton.addEventListener("click", () => {
        window.location.hash = "#/";  // Redirige vers le menu principal
    });
    appContainer.appendChild(backButton);

    // Charger le PDF avec PDF.js
    pdfjsLib.getDocument(pdfPath).promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        renderPage(currentPage);
    });
}

// 2. Fonction pour afficher une page spécifique
function renderPage(pageNum) {
    const viewer = document.getElementById('pdfViewer');
    if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

    pdfDoc.getPage(pageNum).then(page => {
        const canvas = document.createElement('canvas');
        viewer.innerHTML = ''; // Réinitialiser la vue avant d'ajouter une nouvelle page
        viewer.appendChild(canvas);

        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });  // Ajuster le zoom si nécessaire
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
            currentPage = pageNum;
        });
    });
}

// 3. Fonction pour aller à une page spécifique
function goToPage(pageNum) {
    renderPage(pageNum);
}

// 4. Gestion du changement de route en fonction de l'URL (hash)
const routes = {
    "#/": renderHome, // Route pour la page d'accueil
    "#/table-des-matieres": () => openPDF('./pdf/tablematiere.pdf'),
    "#/table-des-abreviations": () => openPDF('./pdf/tableabrev.pdf'),
    "#/echographie": () => openPDF('./pdf/echographie.pdf'),
    "#/ventilation": () => openPDF('./pdf/ventilation.pdf'),
    "#/bacterio": () => openPDF('./pdf/bacterio.pdf'),
    "#/dialyse": () => openPDF('./pdf/dialyse.pdf'),
    "#/eeg": () => openPDF('./pdf/eeg.pdf'),
    "#/systeme": () => openPDF('./pdf/systeme.pdf'),
    "#/medicaments": () => openPDF('./pdf/medicaments.pdf')
};

// 5. Fonction de monté de contenu (équivalent de `mount` dans ton autre code)
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
