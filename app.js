
document.getElementById('access-btn').addEventListener('click', function() {
    document.querySelector('.welcome-page').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    populateMenu();
});

function populateMenu() {
    const imgList = [
        { name: 'Echographie pratique', pdf: 'echographie.pdf' },
        { name: 'Ventilation mécanique', pdf: 'ventilation.pdf' },
        { name: 'Bactériologie clinique', pdf: 'bacterio.pdf' },
        { name: 'Epuration extra-rénale', pdf: 'dialyse.pdf' },
        { name: 'EEG continu', pdf: 'eeg.pdf' },
        { name: 'Maladies de système', pdf: 'systeme.pdf' },
        { name: 'Médicaments et posologies', pdf: 'medicaments.pdf' }
    ];

    const imgContainer = document.getElementById('image-list');
    imgList.forEach(item => {
        let btn = document.createElement('button');
        btn.textContent = item.name;
        btn.addEventListener('click', () => openPDF(item.pdf));
        imgContainer.appendChild(btn);
    });
}

function openPDF(pdfName) {
    window.location.href = 'pdf/' + pdfName;
}
