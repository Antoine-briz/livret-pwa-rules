document.getElementById('access-btn').addEventListener('click', function() {
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

function openPDF(pdfName) {
    window.location.href = 'pdf/' + pdfName;
}
