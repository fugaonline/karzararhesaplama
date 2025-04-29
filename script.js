document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elementleri ---
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const dashboardFilter = document.getElementById('dashboard-filter');
    const dashboardCustomDatesDiv = document.getElementById('dashboard-custom-dates');
    const dashboardStartDateInput = document.getElementById('dashboard-start-date');
    const dashboardEndDateInput = document.getElementById('dashboard-end-date');
    const dashboardFilterBtn = document.getElementById('dashboard-filter-btn');
    const raporFilter = document.getElementById('rapor-filter');
    const raporCustomDatesDiv = document.getElementById('rapor-custom-dates');
    const raporStartDateInput = document.getElementById('rapor-start-date');
    const raporEndDateInput = document.getElementById('rapor-end-date');
    const raporFilterBtn = document.getElementById('rapor-filter-btn');

    // Gelir Formu ve Tablosu
    const gelirForm = document.getElementById('gelir-form');
    const gelirKanalInput = document.getElementById('gelir-kanal');
    const gelirTarihInput = document.getElementById('gelir-tarih');
    const gelirCiroInput = document.getElementById('gelir-ciro');
    const gelirSiparisAdediInput = document.getElementById('gelir-siparis-adedi');
    const gelirUrunAdediInput = document.getElementById('gelir-urun-adedi');
    const gelirUrunTutariInput = document.getElementById('gelir-urun-tutari');
    const gelirTableBody = document.getElementById('gelir-table-body');

    // Gider Formu ve Tablosu
    const giderForm = document.getElementById('gider-form');
    const giderKanalInput = document.getElementById('gider-kanal');
    const giderTarihInput = document.getElementById('gider-tarih');
    const giderTurInput = document.getElementById('gider-tur');
    const giderTutarInput = document.getElementById('gider-tutar');
    const giderKdvInput = document.getElementById('gider-kdv');
    const giderAciklamaInput = document.getElementById('gider-aciklama');
    const giderTableBody = document.getElementById('gider-table-body');

    // Dashboard Spanları
    const globalRoasSpan = document.getElementById('global-roas');
    const webCiroSpan = document.getElementById('web-ciro');
    const webUrunTutariSpan = document.getElementById('web-urun-tutari');
    const webKargoGeliriSpan = document.getElementById('web-kargo-geliri');
    const webUrunMaliyetiSpan = document.getElementById('web-urun-maliyeti');
    const webKargoGideriSpan = document.getElementById('web-kargo-gideri');
    const webReklamGideriSpan = document.getElementById('web-reklam-gideri');
    const webKarZararSpan = document.getElementById('web-kar-zarar');
    const webRoasSpan = document.getElementById('web-roas');
    const trendyolCiroSpan = document.getElementById('trendyol-ciro');
    const trendyolUrunTutariSpan = document.getElementById('trendyol-urun-tutari');
    const trendyolKargoGeliriSpan = document.getElementById('trendyol-kargo-geliri');
    const trendyolUrunMaliyetiSpan = document.getElementById('trendyol-urun-maliyeti');
    const trendyolKargoGideriSpan = document.getElementById('trendyol-kargo-gideri');
    const trendyolReklamGideriSpan = document.getElementById('trendyol-reklam-gideri');
    const trendyolKomisyonGideriSpan = document.getElementById('trendyol-komisyon-gideri');
    const trendyolKarZararSpan = document.getElementById('trendyol-kar-zarar');
    const toplamCiroSpan = document.getElementById('toplam-ciro');
    const toplamUrunTutariSpan = document.getElementById('toplam-urun-tutari');
    const toplamKargoGeliriSpan = document.getElementById('toplam-kargo-geliri');
    const toplamUrunMaliyetiSpan = document.getElementById('toplam-urun-maliyeti');
    const toplamKargoGideriSpan = document.getElementById('toplam-kargo-gideri');
    const toplamReklamGideriSpan = document.getElementById('toplam-reklam-gideri');
    const toplamKomisyonGideriSpan = document.getElementById('toplam-komisyon-gideri');
    const toplamDigerGiderlerSpan = document.getElementById('toplam-diger-giderler');
    const toplamKarZararSpan = document.getElementById('toplam-kar-zarar');

    // Raporlar Spanları
    const raporOrtGunlukCiroSpan = document.getElementById('rapor-ort-gunluk-ciro');
    const raporOrtGunlukSiparisSpan = document.getElementById('rapor-ort-gunluk-siparis');
    const raporOrtGunlukUrunSpan = document.getElementById('rapor-ort-gunluk-urun');
    const raporKargoGeliriSpan = document.getElementById('rapor-kargo-geliri');
    const raporKargoGideriSpan = document.getElementById('rapor-kargo-gideri');
    const raporKargoPozisyonuSpan = document.getElementById('rapor-kargo-pozisyonu');
    const raporHesaplananKdvSpan = document.getElementById('rapor-hesaplanan-kdv');
    const raporIndirilecekKdvSpan = document.getElementById('rapor-indirilecek-kdv');
    const raporKdvPozisyonuSpan = document.getElementById('rapor-kdv-pozisyonu');


    // --- Veri Depolama (localStorage) ---
    let gelirKayitlari = JSON.parse(localStorage.getItem('gelirKayitlari')) || [];
    let giderKayitlari = JSON.parse(localStorage.getItem('giderKayitlari')) || [];

    // --- Yardımcı Fonksiyonlar ---

    // Sayıyı formatlama (1.000,50 formatı)
    function formatNumber(num) {
        if (isNaN(num) || num === null) return '0,00';
        return num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Formatlı sayıyı parse etme (1.000,50 -> 1000.50)
    function parseFormattedNumber(str) {
        if (!str) return 0;
        // Binlik ayıracı (.) kaldır, ondalık ayıracı (,) noktaya (.) çevir
        const cleanedStr = String(str).replace(/\./g, '').replace(/,/g, '.');
        const number = parseFloat(cleanedStr);
        return isNaN(number) ? 0 : number;
    }

    // Tarih string'ini Date objesine çevirme (YYYY-MM-DD)
    function parseDate(dateString) {
        if (!dateString) return null;
        return new Date(dateString + 'T00:00:00'); // Saat bilgisini ekleyerek zaman dilimi sorunlarını azalt
    }

    // Bugünün tarihini YYYY-MM-DD formatında alma
    function getTodayDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // İki tarih arasındaki gün sayısını alma
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffDays = Math.round(Math.abs((date1 - date2) / oneDay)) + 1; // +1 dahil etmek için
        return diffDays > 0 ? diffDays : 1; // En az 1 gün
    }

    // Kar/Zarar için renk sınıfı uygulama
    function applyProfitClass(element, value) {
        element.classList.remove('profit-positive', 'profit-negative');
        if (value > 0) {
            element.classList.add('profit-positive');
        } else if (value < 0) {
            element.classList.add('profit-negative');
        }
    }

    // --- Sekme Yönetimi ---
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Aktif tab ve içerik sınıfını kaldır
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Tıklanan taba aktif sınıfını ekle
            tab.classList.add('active');
            // İlgili içeriği göster
            const targetContent = document.getElementById(tab.dataset.tab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            // Dashboard veya Raporlar açıldığında verileri güncelle
            if (tab.dataset.tab === 'dashboard') {
                updateDashboard();
            } else if (tab.dataset.tab === 'raporlar') {
                updateReports();
            }
        });
    });

    // --- Filtre Yönetimi ---
    function toggleCustomDates(filterSelect, customDatesDiv) {
        if (filterSelect.value === 'custom') {
            customDatesDiv.style.display = 'flex'; // Veya 'block'
        } else {
            customDatesDiv.style.display = 'none';
        }
    }

    dashboardFilter.addEventListener('change', () => {
        toggleCustomDates(dashboardFilter, dashboardCustomDatesDiv);
        if (dashboardFilter.value !== 'custom') {
           updateDashboard(); // Ön tanımlı filtre seçildiğinde hemen güncelle
        }
    });
    dashboardFilterBtn.addEventListener('click', updateDashboard);


    raporFilter.addEventListener('change', () => {
       toggleCustomDates(raporFilter, raporCustomDatesDiv);
        if (raporFilter.value !== 'custom') {
           updateReports(); // Ön tanımlı filtre seçildiğinde hemen güncelle
        }
    });
    raporFilterBtn.addEventListener('click', updateReports);


    // Tarih aralığını belirleme (Dashboard ve Raporlar için)
    function getDateRange(filterSelect, startDateInput, endDateInput) {
        const filterValue = filterSelect.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Sadece tarih kısmını karşılaştır
        let startDate, endDate;

        switch (filterValue) {
            case 'today':
                startDate = new Date(today);
                endDate = new Date(today);
                break;
            case 'this-week':
                const firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); // Pazartesi başlangıç
                startDate = new Date(today.setDate(firstDayOfWeek));
                 endDate = new Date(startDate);
                 endDate.setDate(startDate.getDate() + 6);
                 // Reset today's date as setDate modifies it
                 today.setDate(new Date().getDate());
                break;
             case 'this-month':
                 startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                 //endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Ayın son günü
                 endDate = new Date(); // Güncel tarihe kadar
                 endDate.setHours(23, 59, 59, 999); // Gün sonu dahil
                break;
            case 'this-year':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
                break;
            case 'last-7-days':
                endDate = new Date(today);
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 6);
                break;
             case 'last-14-days':
                endDate = new Date(today);
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 13);
                break;
            case 'last-30-days':
                endDate = new Date(today);
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 29);
                 break;
            case 'last-month':
                 const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                 startDate = new Date(lastMonth);
                 endDate = new Date(today.getFullYear(), today.getMonth(), 0); // Geçen ayın son günü
                break;
            case 'custom':
                startDate = parseDate(startDateInput.value);
                endDate = parseDate(endDateInput.value);
                 if (endDate) endDate.setHours(23, 59, 59, 999); // Bitiş gününü tam olarak dahil et
                break;
            default: // Varsayılan: Bu Ay (Dashboard), Son 30 Gün (Raporlar)
                if (filterSelect.id === 'dashboard-filter') {
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    endDate = new Date(); // Güncel tarih
                    endDate.setHours(23, 59, 59, 999);
                } else { // rapor-filter
                    endDate = new Date(today);
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 29);
                }
        }

        // Başlangıç tarihi bitişten sonra ise null döndür
        if (startDate && endDate && startDate > endDate) {
            return { startDate: null, endDate: null };
        }

        return { startDate, endDate };
    }

     // --- Gelir Yönetimi ---
    function renderGelirTable() {
        gelirTableBody.innerHTML = ''; // Tabloyu temizle
        gelirKayitlari.sort((a, b) => parseDate(b.tarih) - parseDate(a.tarih)); // Tarihe göre sırala (en yeni üstte)
        gelirKayitlari.forEach((kayit, index) => {
            const row = gelirTableBody.insertRow();
            row.innerHTML = `
                <td>${kayit.kanal}</td>
                <td>${kayit.tarih}</td>
                <td>${formatNumber(kayit.ciro)}</td>
                <td>${kayit.siparisAdedi}</td>
                <td>${kayit.urunAdedi}</td>
                <td>${formatNumber(kayit.urunTutari)}</td>
                <td><button class="delete-btn" data-index="${index}" data-type="gelir"><i class="fas fa-trash-alt"></i></button></td>
            `;
        });
        addDeleteEventListeners(); // Silme butonlarına olay dinleyici ekle
    }

    gelirForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ciro = parseFormattedNumber(gelirCiroInput.value);
        const urunTutari = parseFormattedNumber(gelirUrunTutariInput.value);

        if(ciro < urunTutari) {
            alert("Ciro, Ürün Tutarından küçük olamaz!");
            return;
        }

        const yeniGelir = {
            id: Date.now(), // Basit unique ID
            kanal: gelirKanalInput.value,
            tarih: gelirTarihInput.value,
            ciro: ciro,
            siparisAdedi: parseInt(gelirSiparisAdediInput.value) || 0,
            urunAdedi: parseInt(gelirUrunAdediInput.value) || 0,
            urunTutari: urunTutari
        };

        gelirKayitlari.push(yeniGelir);
        localStorage.setItem('gelirKayitlari', JSON.stringify(gelirKayitlari));
        renderGelirTable();
        gelirForm.reset(); // Formu temizle
        setDefaultDate(gelirTarihInput); // Tarihi bugüne ayarla
        updateDashboard(); // Dashboard'u güncelle
        updateReports(); // Raporları güncelle
    });

    // --- Gider Yönetimi ---
    function renderGiderTable() {
        giderTableBody.innerHTML = ''; // Tabloyu temizle
        giderKayitlari.sort((a, b) => parseDate(b.tarih) - parseDate(a.tarih)); // Tarihe göre sırala
        giderKayitlari.forEach((kayit, index) => {
            const row = giderTableBody.insertRow();
            row.innerHTML = `
                <td>${kayit.kanal}</td>
                <td>${kayit.tarih}</td>
                <td>${kayit.tur}</td>
                <td>${formatNumber(kayit.tutar)}</td>
                <td>${kayit.kdv}%</td>
                <td>${kayit.aciklama || '-'}</td>
                 <td><button class="delete-btn" data-index="${index}" data-type="gider"><i class="fas fa-trash-alt"></i></button></td>
            `;
        });
        addDeleteEventListeners(); // Silme butonlarına olay dinleyici ekle
    }

     giderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Trendyol kanalında Komisyon dışında bir gider türü seçilirse uyar
        const kanal = giderKanalInput.value;
        const tur = giderTurInput.value;
        if (kanal === 'Trendyol' && tur === 'Komisyon' && giderTurInput.selectedOptions[0].text !== 'Komisyon (Sadece Trendyol için)') {
           // Bu kontrol biraz zayıf kalabilir, gider türlerini kanala göre dinamik yapmak daha iyi olurdu.
           // Şimdilik sadece bilgi amaçlı bırakıldı. Komisyon türü seçilebilir olmalı.
        }
        // Web sitesi veya Trendyol için Operasyon veya Vergi türü seçilirse uyar (mantıksal hata olabilir)
        if ((kanal === 'Web Sitesi' || kanal === 'Trendyol') && (tur === 'Operasyon' || tur === 'Vergi Odeme')) {
            console.warn(`Uyarı: ${kanal} kanalı için ${tur} türü seçildi. Bu genellikle 'Operasyonel Giderler' veya 'Vergi' kanalı altında olmalı.`);
        }
         // Operasyonel veya Vergi kanalı için alakasız tür seçilirse uyar
         if ((kanal === 'Operasyonel Giderler' && tur !== 'Operasyon' && tur !== 'Diger') || (kanal === 'Vergi' && tur !== 'Vergi Odeme' && tur !== 'Diger')) {
              console.warn(`Uyarı: ${kanal} kanalı için ${tur} türü seçildi. Beklenen türler farklı olabilir.`);
         }


        const yeniGider = {
             id: Date.now(), // Basit unique ID
             kanal: kanal,
             tarih: giderTarihInput.value,
             tur: tur,
             tutar: parseFormattedNumber(giderTutarInput.value),
             kdv: parseInt(giderKdvInput.value) || 0,
             aciklama: giderAciklamaInput.value.trim()
         };

        giderKayitlari.push(yeniGider);
        localStorage.setItem('giderKayitlari', JSON.stringify(giderKayitlari));
        renderGiderTable();
        giderForm.reset(); // Formu temizle
        setDefaultDate(giderTarihInput); // Tarihi bugüne ayarla
        updateDashboard(); // Dashboard'u güncelle
        updateReports(); // Raporları güncelle
    });


    // --- Kayıt Silme ---
    function addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            // Eski listenerları kaldırıp yenisini ekle (çift eklemeyi önlemek için)
            button.removeEventListener('click', handleDelete);
            button.addEventListener('click', handleDelete);
        });
    }

    function handleDelete(event) {
        const button = event.currentTarget; // Olayın tetiklendiği buton
        const index = parseInt(button.dataset.index);
        const type = button.dataset.type;

        if (isNaN(index)) return; // Geçersiz index

        if (confirm(`${type === 'gelir' ? 'Gelir' : 'Gider'} kaydını silmek istediğinizden emin misiniz?`)) {
            if (type === 'gelir') {
                gelirKayitlari.splice(index, 1);
                localStorage.setItem('gelirKayitlari', JSON.stringify(gelirKayitlari));
                renderGelirTable();
            } else if (type === 'gider') {
                giderKayitlari.splice(index, 1);
                localStorage.setItem('giderKayitlari', JSON.stringify(giderKayitlari));
                renderGiderTable();
            }
            updateDashboard(); // Veri değişti, güncelle
            updateReports(); // Veri değişti, güncelle
        }
    }


    // --- Hesaplamalar ve Güncellemeler ---

    // Dashboard verilerini hesapla ve güncelle
    function updateDashboard() {
        const { startDate, endDate } = getDateRange(dashboardFilter, dashboardStartDateInput, dashboardEndDateInput);

        if (!startDate || !endDate) {
             console.error("Geçersiz tarih aralığı.");
             // TODO: Kullanıcıya bildirim gösterilebilir
             return;
        }

        // Filtrelenmiş veriler
        const filteredGelirler = gelirKayitlari.filter(k => {
            const kayitDate = parseDate(k.tarih);
            return kayitDate && kayitDate >= startDate && kayitDate <= endDate;
        });
        const filteredGiderler = giderKayitlari.filter(k => {
             const kayitDate = parseDate(k.tarih);
             return kayitDate && kayitDate >= startDate && kayitDate <= endDate;
        });

        // Kanal Bazlı Hesaplamalar
        let webCiro = 0, webUrunTutari = 0, webKargoGeliri = 0;
        let webUrunMaliyeti = 0, webKargoGideri = 0, webReklamGideri = 0;
        let trendyolCiro = 0, trendyolUrunTutari = 0, trendyolKargoGeliri = 0;
        let trendyolUrunMaliyeti = 0, trendyolKargoGideri = 0, trendyolReklamGideri = 0, trendyolKomisyonGideri = 0;
        let operasyonelGider = 0;
        let vergiGider = 0; // Vergi ödemeleri

        filteredGelirler.forEach(k => {
            const kargoGeliri = k.ciro - k.urunTutari; // Kargo geliri hesaplama
            if (k.kanal === 'Web Sitesi') {
                webCiro += k.ciro;
                webUrunTutari += k.urunTutari;
                webKargoGeliri += kargoGeliri;
            } else if (k.kanal === 'Trendyol') {
                trendyolCiro += k.ciro;
                trendyolUrunTutari += k.urunTutari;
                 trendyolKargoGeliri += kargoGeliri;
            }
        });

        filteredGiderler.forEach(k => {
            if (k.kanal === 'Web Sitesi') {
                if (k.tur === 'Ürün Maliyeti') webUrunMaliyeti += k.tutar;
                else if (k.tur === 'Kargo') webKargoGideri += k.tutar;
                else if (k.tur === 'Reklam') webReklamGideri += k.tutar;
            } else if (k.kanal === 'Trendyol') {
                if (k.tur === 'Ürün Maliyeti') trendyolUrunMaliyeti += k.tutar;
                else if (k.tur === 'Kargo') trendyolKargoGideri += k.tutar;
                else if (k.tur === 'Reklam') trendyolReklamGideri += k.tutar;
                else if (k.tur === 'Komisyon') trendyolKomisyonGideri += k.tutar;
            } else if (k.kanal === 'Operasyonel Giderler') {
                operasyonelGider += k.tutar;
            } else if (k.kanal === 'Vergi' && k.tur === 'Vergi Odeme') {
                 vergiGider += k.tutar; // Raporlama için değil ama genel giderde görülebilir
            }
             // Diğer gider türleri de ilgili kanallara eklenebilir veya genel toplama dahil edilebilir.
             // Şimdilik 'Operasyonel Giderler' ve 'Vergi Ödeme' ayrı toplandı.
        });

        // Kar/Zarar Hesaplamaları
        const webKarZarar = webCiro - webUrunMaliyeti - webKargoGideri - webReklamGideri;
        // Trendyol Kar/Zarar (Komisyon dahil)
        const trendyolKarZarar = trendyolCiro - trendyolUrunMaliyeti - trendyolKargoGideri - trendyolReklamGideri - trendyolKomisyonGideri;
        // Toplam Kar/Zarar (Operasyonel ve Vergi giderleri düşülerek)
        const toplamKarZarar = (webKarZarar + trendyolKarZarar) - operasyonelGider - vergiGider; // Tüm kanalların karından op. ve vergi düşülür


        // ROAS Hesaplamaları
        const webRoas = webReklamGideri > 0 ? (webCiro / webReklamGideri) : 0;
        const globalRoas = webRoas; // Global ROAS şimdilik sadece web sitesini baz alıyor

        // Dashboard Güncelleme
        webCiroSpan.textContent = formatNumber(webCiro);
        webUrunTutariSpan.textContent = formatNumber(webUrunTutari);
        webKargoGeliriSpan.textContent = formatNumber(webKargoGeliri);
        webUrunMaliyetiSpan.textContent = formatNumber(webUrunMaliyeti);
        webKargoGideriSpan.textContent = formatNumber(webKargoGideri);
        webReklamGideriSpan.textContent = formatNumber(webReklamGideri);
        webKarZararSpan.textContent = formatNumber(webKarZarar);
        applyProfitClass(webKarZararSpan, webKarZarar);
        webRoasSpan.textContent = webRoas.toFixed(2); // ROAS genellikle 2 ondalıkla gösterilir

        trendyolCiroSpan.textContent = formatNumber(trendyolCiro);
        trendyolUrunTutariSpan.textContent = formatNumber(trendyolUrunTutari);
        trendyolKargoGeliriSpan.textContent = formatNumber(trendyolKargoGeliri);
        trendyolUrunMaliyetiSpan.textContent = formatNumber(trendyolUrunMaliyeti);
        trendyolKargoGideriSpan.textContent = formatNumber(trendyolKargoGideri);
        trendyolReklamGideriSpan.textContent = formatNumber(trendyolReklamGideri);
        trendyolKomisyonGideriSpan.textContent = formatNumber(trendyolKomisyonGideri);
        trendyolKarZararSpan.textContent = formatNumber(trendyolKarZarar);
         applyProfitClass(trendyolKarZararSpan, trendyolKarZarar);

        toplamCiroSpan.textContent = formatNumber(webCiro + trendyolCiro);
        toplamUrunTutariSpan.textContent = formatNumber(webUrunTutari + trendyolUrunTutari);
        toplamKargoGeliriSpan.textContent = formatNumber(webKargoGeliri + trendyolKargoGeliri);
        toplamUrunMaliyetiSpan.textContent = formatNumber(webUrunMaliyeti + trendyolUrunMaliyeti);
        toplamKargoGideriSpan.textContent = formatNumber(webKargoGideri + trendyolKargoGideri);
        toplamReklamGideriSpan.textContent = formatNumber(webReklamGideri + trendyolReklamGideri);
        toplamKomisyonGideriSpan.textContent = formatNumber(trendyolKomisyonGideri);
        toplamDigerGiderlerSpan.textContent = formatNumber(operasyonelGider + vergiGider); // Op ve Vergi Toplamı
        toplamKarZararSpan.textContent = formatNumber(toplamKarZarar);
        applyProfitClass(toplamKarZararSpan, toplamKarZarar);

        globalRoasSpan.textContent = globalRoas.toFixed(2);
    }

    // Raporlar verilerini hesapla ve güncelle
    function updateReports() {
        const { startDate, endDate } = getDateRange(raporFilter, raporStartDateInput, raporEndDateInput);

         if (!startDate || !endDate) {
             console.error("Geçersiz tarih aralığı.");
             // TODO: Kullanıcıya bildirim gösterilebilir
             return;
         }

        const filteredGelirler = gelirKayitlari.filter(k => {
            const kayitDate = parseDate(k.tarih);
            return kayitDate && kayitDate >= startDate && kayitDate <= endDate;
        });
        const filteredGiderler = giderKayitlari.filter(k => {
            const kayitDate = parseDate(k.tarih);
             return kayitDate && kayitDate >= startDate && kayitDate <= endDate;
        });

        const numberOfDays = daysBetween(startDate, endDate);

        // Ortalama Değerler
        let toplamCiroRapor = 0;
        let toplamSiparisRapor = 0;
        let toplamUrunAdediRapor = 0;
        filteredGelirler.forEach(k => {
            toplamCiroRapor += k.ciro;
            toplamSiparisRapor += k.siparisAdedi;
            toplamUrunAdediRapor += k.urunAdedi;
        });

        const ortGunlukCiro = numberOfDays > 0 ? toplamCiroRapor / numberOfDays : 0;
        const ortGunlukSiparis = numberOfDays > 0 ? toplamSiparisRapor / numberOfDays : 0;
        const ortGunlukUrun = numberOfDays > 0 ? toplamUrunAdediRapor / numberOfDays : 0;

        // Kargo Durumu (Web Sitesi)
        let webKargoGeliriRapor = 0;
        filteredGelirler.forEach(k => {
            if (k.kanal === 'Web Sitesi') {
                webKargoGeliriRapor += (k.ciro - k.urunTutari);
            }
        });
        let webKargoGideriRapor = 0;
        filteredGiderler.forEach(k => {
            if (k.kanal === 'Web Sitesi' && k.tur === 'Kargo') {
                webKargoGideriRapor += k.tutar;
            }
        });
        const kargoPozisyonu = webKargoGeliriRapor - webKargoGideriRapor;

        // KDV Raporu
        let hesaplananKdv = 0;
        filteredGelirler.forEach(k => {
            if (k.kanal === 'Web Sitesi') {
                // Ürün Tutarı %10 KDV Dahil => KDV = Tutar * 10 / 110
                hesaplananKdv += k.urunTutari * 10 / 110;
                // Kargo Geliri %20 KDV Dahil => KDV = Tutar * 20 / 120
                const kargoGeliri = k.ciro - k.urunTutari;
                hesaplananKdv += kargoGeliri * 20 / 120;
            }
            // Not: Trendyol gelirleri için KDV hesaplaması genellikle komisyon faturasından yapılır,
            // bu yüzden buraya direkt dahil edilmedi. Gerekirse eklenebilir.
        });

        let indirilecekKdv = 0;
        filteredGiderler.forEach(k => {
            // Gider tutarı KDV HARİÇ girildiği varsayılırsa: KDV = Tutar * KDV Oranı / 100
            // Eğer Gider tutarı KDV DAHİL giriliyorsa: KDV = Tutar * KDV Oranı / (100 + KDV Oranı)
            // Şu anki yapıda KDV oranını ayrı aldığımız için, Tutar'ın KDV hariç olduğunu varsayıyoruz.
            // Eğer Tutar KDV dahil giriliyorsa bu hesaplama değişmeli!
            // Basitlik adına Tutar'ın KDV Hariç olduğunu varsayalım:
             // indirilecekKdv += k.tutar * k.kdv / 100;

             // Eğer Tutar KDV Dahil Giriliyorsa (Daha Olası Senaryo):
             if (k.kdv > 0) {
                 indirilecekKdv += k.tutar * k.kdv / (100 + k.kdv);
             }
        });
        const kdvPozisyonu = hesaplananKdv - indirilecekKdv;


        // Rapor Spanlarını Güncelleme
        raporOrtGunlukCiroSpan.textContent = formatNumber(ortGunlukCiro);
        raporOrtGunlukSiparisSpan.textContent = Math.round(ortGunlukSiparis).toLocaleString('tr-TR'); // Tam sayı göster
        raporOrtGunlukUrunSpan.textContent = Math.round(ortGunlukUrun).toLocaleString('tr-TR'); // Tam sayı göster

        raporKargoGeliriSpan.textContent = formatNumber(webKargoGeliriRapor);
        raporKargoGideriSpan.textContent = formatNumber(webKargoGideriRapor);
        raporKargoPozisyonuSpan.textContent = formatNumber(kargoPozisyonu);
        applyProfitClass(raporKargoPozisyonuSpan, kargoPozisyonu); // Pozisyona göre renk

        raporHesaplananKdvSpan.textContent = formatNumber(hesaplananKdv);
        raporIndirilecekKdvSpan.textContent = formatNumber(indirilecekKdv);
        raporKdvPozisyonuSpan.textContent = formatNumber(kdvPozisyonu);
        applyProfitClass(raporKdvPozisyonuSpan, kdvPozisyonu); // Pozisyona göre renk
    }


     // --- Başlangıç Ayarları ---
    function setDefaultDate(dateInput) {
         dateInput.value = getTodayDateString();
    }

    function initializeApp() {
        setDefaultDate(gelirTarihInput);
        setDefaultDate(giderTarihInput);
        // Varsayılan filtreleri ayarla
        dashboardFilter.value = 'this-month';
        raporFilter.value = 'last-30-days';
        toggleCustomDates(dashboardFilter, dashboardCustomDatesDiv); // Başlangıçta gizle
        toggleCustomDates(raporFilter, raporCustomDatesDiv); // Başlangıçta gizle

        renderGelirTable();
        renderGiderTable();
        updateDashboard(); // Sayfa yüklendiğinde dashboard'u güncelle
        updateReports(); // Sayfa yüklendiğinde raporları güncelle

        // Gider Kanalına göre Gider Türünü dinamik olarak kısıtlama (isteğe bağlı iyileştirme)
        giderKanalInput.addEventListener('change', () => {
            const selectedKanal = giderKanalInput.value;
            const komisyonOption = giderTurInput.querySelector('option[value="Komisyon"]');

            // Diğer türleri tekrar etkinleştir
            Array.from(giderTurInput.options).forEach(opt => opt.disabled = false);

            if (selectedKanal === 'Trendyol') {
                // Trendyol ise sadece komisyon ve diğer temel türler seçilebilir olmalı (örnek)
                 // Array.from(giderTurInput.options).forEach(opt => {
                 //    if (!['Ürün Maliyeti', 'Reklam', 'Kargo', 'Komisyon', 'Diger'].includes(opt.value)) {
                 //        opt.disabled = true;
                 //    }
                 // });
            } else if (selectedKanal === 'Web Sitesi') {
                // Web sitesi ise komisyon seçilemez
                if (komisyonOption) komisyonOption.disabled = true;
            } else if (selectedKanal === 'Operasyonel Giderler') {
                // Sadece Operasyon veya Diğer seçilebilir
                Array.from(giderTurInput.options).forEach(opt => {
                     if (!['Operasyon', 'Diger'].includes(opt.value)) opt.disabled = true;
                 });
            } else if (selectedKanal === 'Vergi') {
                 // Sadece Vergi Ödeme veya Diğer seçilebilir
                 Array.from(giderTurInput.options).forEach(opt => {
                     if (!['Vergi Odeme', 'Diger'].includes(opt.value)) opt.disabled = true;
                 });
            }

             // Seçili kanal değişince, eğer seçili tür devre dışı kaldıysa, türü sıfırla
            if (giderTurInput.selectedOptions.length > 0 && giderTurInput.selectedOptions[0].disabled) {
                giderTurInput.value = "";
            }
        });

    }

    initializeApp(); // Uygulamayı başlat
});
