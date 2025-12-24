// js/ui.js


function updateTanggal() {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date();
    document.getElementById("info-tanggal").innerText = today.toLocaleDateString('id-ID', options);
}

function buatSalju() {
    const salju = document.createElement('div');
    salju.classList.add('snowflake');
    salju.style.left = Math.random() * 100 + 'vw';
    
    const ukuran = Math.random() * 3 + 2; 
    salju.style.width = ukuran + 'px';
    salju.style.height = ukuran + 'px';
    
    const durasi = Math.random() * 7 + 8; 
    salju.style.animationDuration = durasi + 's';
    salju.style.opacity = Math.random() * 0.5 + 0.3;
    
    document.body.appendChild(salju);
    
    setTimeout(() => {
        salju.remove();
    }, durasi * 1000);
}