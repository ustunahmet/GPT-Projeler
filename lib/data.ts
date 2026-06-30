export const safetyNotice = 'Hesaplayıcılar eğitim amaçlı ön boyutlandırma aracıdır; resmi mühendislik onayı, uçuş izni veya güvenlik garantisi yerine geçmez.';
export const calculators = [
 { code:'CALC-THRUST', slug:'itki', title:'İtki ve Thrust-to-Weight', desc:'AUW, motor sayısı ve güvenlik katsayısı ile motor başına itki hedefini hesaplayın.'},
 { code:'CALC-BATTERY', slug:'batarya', title:'Batarya Enerji ve Uçuş Süresi', desc:'Wh, kullanılabilir enerji ve yaklaşık uçuş süresi tahmini.'},
 { code:'CALC-CURRENT', slug:'akim', title:'Akım Tahmini', desc:'Güç ve voltajdan toplam akım ve sürekli akım marjı.'},
 { code:'CALC-DISK', slug:'disk-yuklemesi', title:'Pervane Disk Yüklemesi', desc:'Toplam disk alanı, N/m² ve kg/m² değerleri.'},
 { code:'CALC-PAYLOAD', slug:'payload', title:'Payload ve MTOW Marjı', desc:'Boş ağırlık, batarya, aksesuar ve payload sonrası kalan marj.'}
];
export const modules = [
 { slug:'drone-101', title:'Drone 101', level:'Başlangıç', lessons:['Drone Sistemine Genel Bakış','Güvenlik ve Sorumluluk']},
 { slug:'parca-sistem', title:'Parça ve Sistem Mimarisi', level:'Başlangıç', lessons:['Frame ve Motor Sayısı Seçimi','Motor, ESC ve Pervane İlişkisi']},
 { slug:'temel-hesaplar', title:'Temel Hesaplar', level:'Başlangıç', lessons:['Ağırlık ve İtki Hesabı','Batarya ve Uçuş Süresi']},
 { slug:'kurulum', title:'Kurulum Yol Haritası', level:'Orta', lessons:['Mekanik Montaj Öncesi Kontrol']},
 { slug:'test', title:'Test ve İlk Uçuş Hazırlığı', level:'Başlangıç', lessons:['Pervanesiz İlk Sistem Testi']}
];
