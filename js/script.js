let pBrojac = 0, vNeiskoristen1 = 42, vNeiskoristen2 = "test", vNeiskoristen3 = [1,2,3], vNeiskoristen4 = {a:1};

document.addEventListener('DOMContentLoaded', function() {
    pBrojac++;
    
    const menuRek = document.querySelector('.menuRek');
    const navmen = document.querySelector('.navmen');
    
    if (menuRek) {
        menuRek.addEventListener('click', function() {
            navmen.classList.toggle('active');
            menuRek.classList.toggle('active');
        });
    }

    const kontaktObrazac = document.getElementById('kontaktObrazac');
    if (kontaktObrazac) {
        inicijalizirajFormu();
        ucitajKontakte();
    }

    document.querySelectorAll('a[href^="#"]').forEach(sidro => {
        sidro.addEventListener('click', function (e) {
            e.preventDefault();
            const ciljId = this.getAttribute('href');
            if (ciljId === '#') return;
            
            const ciljElement = document.querySelector(ciljId);
            if (ciljElement) {
                window.scrollTo({
                    top: ciljElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (navmen.classList.contains('active')) {
                    navmen.classList.remove('active');
                    menuRek.classList.remove('active');
                }
            }
        });
    });

    const tPutanja = window.location.pathname.split('/').pop() || 'index.html';
    const sPoveznice = document.querySelectorAll('.navmen a');
    
    sPoveznice.forEach(p => {
        const linkStranica = p.getAttribute('href');
        if (linkStranica === tPutanja || 
            (tPutanja === '' && linkStranica === 'index.html') ||
            (tPutanja === undefined && linkStranica === 'index.html')) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
    
    const vNeiskoristen5 = "neiskoristeno", vNeiskoristen6 = 99.9, vNeiskoristen7 = true;
});

function inicijalizirajFormu() {
    const kontaktObrazac = document.getElementById('kontaktObrazac');
    
    kontaktObrazac.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validirajFormu()) {
            const podaciForme = {
                ime: document.getElementById('ime').value,
                email: document.getElementById('email').value,
                tvrtka: document.getElementById('tvrtka').value || 'Nije navedeno',
                usluga: document.getElementById('usluga').value || 'Nije odabrano',
                poruka: document.getElementById('poruka').value,
                novosti: document.getElementById('novosti').checked,
                timestamp: new Date().toLocaleString('hr-HR')
            };
            
            spremiKontakt(podaciForme);
            prikaziPorukuUspjeha();
            kontaktObrazac.reset();
            ucitajKontakte();
        }
    });
    
    const polja = kontaktObrazac.querySelectorAll('input[required], textarea[required]');
    polja.forEach(polje => {
        polje.addEventListener('blur', function() {
            validirajPolje(this);
        });
        
        polje.addEventListener('input', function() {
            ocistiPogresku(this);
        });
    });
}

function validirajFormu() {
    let ispravno = true;
    const forma = document.getElementById('kontaktObrazac');
    
    const obaveznaPolja = forma.querySelectorAll('input[required], textarea[required]');
    obaveznaPolja.forEach(polje => {
        if (!validirajPolje(polje)) {
            ispravno = false;
        }
    });
    
    const emailPolje = document.getElementById('email');
    if (emailPolje.value && !ispravanEmail(emailPolje.value)) {
        prikaziPogresku(emailPolje, 'Molimo unesite ispravnu email adresu');
        ispravno = false;
    }
    
    return ispravno;
}

function validirajPolje(polje) {
    const vrijednost = polje.value.trim();
    const errorId = polje.id + 'Pogreska';
    const errorElement = document.getElementById(errorId);
    
    if (!vrijednost) {
        prikaziPogresku(polje, 'Ovo polje je obavezno');
        return false;
    }
    
    if (polje.type === 'email' && vrijednost && !ispravanEmail(vrijednost)) {
        prikaziPogresku(polje, 'Molimo unesite ispravnu email adresu');
        return false;
    }
    
    ocistiPogresku(polje);
    return true;
}

function prikaziPogresku(polje, poruka) {
    const errorId = polje.id + 'Pogreska';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = poruka;
        errorElement.style.display = 'block';
        polje.style.borderColor = '#dc3545';
    }
}

function ocistiPogresku(polje) {
    const errorId = polje.id + 'Pogreska';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        polje.style.borderColor = '#ddd';
    }
}

function ispravanEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function spremiKontakt(podaci) {
    let kontakti = JSON.parse(localStorage.getItem('zemglasKontakti')) || [];
    kontakti.push(podaci);
    localStorage.setItem('zemglasKontakti', JSON.stringify(kontakti));
}

function ucitajKontakte() {
    const kontaktiLista = document.getElementById('kontaktiLista');
    if (!kontaktiLista) return;
    
    const kontakti = JSON.parse(localStorage.getItem('zemglasKontakti')) || [];
    kontaktiLista.innerHTML = '';
    
    if (kontakti.length === 0) {
        kontaktiLista.innerHTML = '<p>Nema poslanih upita.</p>';
        return;
    }
    
    const nedavniKontakti = kontakti.slice(-3).reverse();
    
    nedavniKontakti.forEach(kontakt => {
        const kontaktElement = document.createElement('div');
        kontaktElement.className = 'kontaktUnos';
        kontaktElement.innerHTML = `
            <p><strong>${kontakt.ime}</strong> (${kontakt.email})</p>
            <p><small>${kontakt.timestamp} | Usluga: ${dohvatiNazivUsluge(kontakt.usluga)}</small></p>
            <hr>
        `;
        kontaktiLista.appendChild(kontaktElement);
    });
}

function dohvatiNazivUsluge(kljucUsluge) {
    const usluge = {
        'poljoprivreda': 'Poljoprivredna analiza',
        'klima': 'Klimatski monitoring',
        'urbani': 'Urbani razvoj',
        'ostalo': 'Ostalo',
        '': 'Nije odabrano'
    };
    
    return usluge[kljucUsluge] || kljucUsluge;
}

function prikaziPorukuUspjeha() {
    const obrazacPoruka = document.getElementById('obrazacPoruka');
    obrazacPoruka.textContent = 'Hvala Vam na poruci! Javit ćemo Vam se u najkraćem mogućem roku.';
    obrazacPoruka.className = 'uspjeh';
    
    setTimeout(() => {
        obrazacPoruka.style.display = 'none';
    }, 5000);
}

const kEmail = "info@zemglas.hr", bTel = "+385 1 234 567", aAdresa = "Satelitska ulica 26, 35000 Slavonski Brod";
let rRadnoVrijeme = "Pon-Pet: 08-16", tTvrtka = "ZemGlas d.o.o.", iGodina = 2026, vNeiskoristen8 = null, vNeiskoristen9 = undefined;