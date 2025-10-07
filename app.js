
document.getElementById('access-btn').addEventListener('click', function() {
    document.querySelector('.welcome-page').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    populateMenu();
});

function populateMenu() {
    const imgList = [
        { name: 'echographie', pdf: 'echographie.pdf' },
        { name: 'ventilation', pdf: 'ventilation.pdf' },
        { name: 'bacterio', pdf: 'bacterio.pdf' },
        { name: 'dialyse', pdf: 'dialyse.pdf' },
        { name: 'eeg', pdf: 'eeg.pdf' },
        { name: 'systeme', pdf: 'systeme.pdf' },
        { name: 'medicaments', pdf: 'medicaments.pdf' }
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
