// 1. Fonction openPDF déplacée en haut du fichier
function openPDF(pdfName) {
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
    const pdfPath = 'pdf/' + pdfName;

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
        document.querySelector('.welcome-page').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        appContainer.innerHTML = '';
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

    // Vérifier les limites des pages
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

// 3. Fonction pour aller à une page spécifique
function goToPage(pageNum) {
    renderPage(pageNum);
}

// 4. Utilisation de DOMContentLoaded pour garantir que le DOM est prêt
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cover-img').addEventListener('click', function() {
        document.querySelector('.welcome-page').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
        populateMenu();
    });

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
        imgContainer.innerHTML = ''; // Clear previous content

        imgList.forEach(item => {
            // Create the image container
            let imgDiv = document.createElement('div');
            imgDiv.classList.add('image-container');
            
            // Create the image element
            let imgElement = document.createElement('img');
            imgElement.src = 'img/' + item.image;
            imgElement.alt = item.name;
            imgElement.classList.add('image-item');
            
            // Create the title below the image
            let title = document.createElement('p');
            title.textContent = item.name;
            
            // Append the image and title to the div
            imgDiv.appendChild(imgElement);
            imgDiv.appendChild(title);

            // Make the entire div clickable to open the PDF
            imgDiv.addEventListener('click', () => openPDF(item.pdf));
            
            // Append the image div to the container
            imgContainer.appendChild(imgDiv);
        });
    }
});
