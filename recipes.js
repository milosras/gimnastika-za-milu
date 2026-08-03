/* Kuvanje — sastojci, jela i recepti. Čist podatak, bez ijedne funkcije:
   `food.js` zna kako se crta, ovaj fajl zna šta se crta i šta se kuva. Isti
   odnos kao EX ↔ illustrations.js: zapis nosi ručku (`art`), a crtač zna ostalo.

   `id` je stabilna ručka i namerno je BEZ dijakritika (`sargarepa`, ne
   `šargarepa`) — ide u data-arg atribute i u localStorage, gde mora da preživi
   svaki izvoz i uvoz. Ime za prikaz (`n`) nosi pun srpski.

   Dve liste sastojaka po jelu i to je namerno: `req`/`opt` su ids za poklapanje
   sa ostavom, `sast` je tekst sa količinama za čitanje. Ista podela kao kod
   vežbi, gde `sec: 60` broji a `min: "1 min"` piše.

   Nema mreže. Ovo je ceo izvor recepata — aplikacija je offline i takva ostaje. */
(function (global) {
  "use strict";

  /* ═══ obroci ════════════════════════════════════════════════════════ */

  var OBROCI = [
    { k: "dor", n: "Doručak", s: "Nešto brzo pre škole",
      art: { v: "tanjir", t: ["bread:tost", "fried_egg"] } },
    { k: "ruc", n: "Ručak", s: "Glavno jelo dana",
      art: { v: "tanjir", t: ["noodles:testenina", "sauce:paradajz", "sprinkle:sir"] } },
    { k: "vec", n: "Večera", s: "Nešto lakše uveče",
      art: { v: "cinija", t: ["leaves:salata", "cubes:paradajz", "sprinkle:bela"] } },
    { k: "uzi", n: "Užina", s: "Mali zalogaj između",
      art: { v: "casa", t: ["liquid:jagoda", "swirl:pavlaka"] } }
  ];

  /* ═══ sastojci ══════════════════════════════════════════════════════
     `g` je grupa u mreži: pov povrće · voc voće · mle mleko i sir ·
     mes meso, riba i jaja · zit testenina i žitarice · ost ostalo.
     `s` su dodatne reči za pretragu (druga imena, česte greške u kucanju).
     `stap: 1` su stvari koje svako ima uvek — so, ulje, voda. Ostaju u spisku
     da recepti smeju da ih pomenu, ali se NE prikazuju u mreži i poklapanje ih
     uvek računa kao da ih ima. Inače bi svako jelo tražilo da tapne so. */

  var SASTOJCI = [
    /* povrće */
    { id: "paradajz", n: "Paradajz", g: "pov", a: "rounds:paradajz", s: "pelat sos" },
    { id: "krastavac", n: "Krastavac", g: "pov", a: "rounds:krastavac" },
    { id: "krompir", n: "Krompir", g: "pov", a: "mound:krompir" },
    { id: "sargarepa", n: "Šargarepa", g: "pov", a: "stick:sargarepa", s: "mrkva" },
    { id: "luk", n: "Crni luk", g: "pov", a: "rounds:luk" },
    { id: "beliluk", n: "Beli luk", g: "pov", a: "cubes:bela" },
    { id: "paprika", n: "Paprika", g: "pov", a: "wedges:paprika", s: "babura" },
    { id: "tikvica", n: "Tikvica", g: "pov", a: "rounds:tikvica" },
    { id: "spanac", n: "Spanać", g: "pov", a: "leaves:spanac" },
    { id: "salata", n: "Zelena salata", g: "pov", a: "leaves:salata" },
    { id: "grasak", n: "Grašak", g: "pov", a: "berry:grasak" },
    { id: "pasulj", n: "Pasulj", g: "pov", a: "berry:pasulj", s: "boranija zrno" },

    /* voće */
    { id: "jabuka", n: "Jabuka", g: "voc", a: "rounds:jabuka" },
    { id: "banana", n: "Banana", g: "voc", a: "stick:banana" },
    { id: "jagoda", n: "Jagoda", g: "voc", a: "berry:jagoda" },
    { id: "limun", n: "Limun", g: "voc", a: "rounds:limun" },
    { id: "pomorandza", n: "Pomorandža", g: "voc", a: "rounds:pomorandza", s: "narandza" },
    { id: "kruska", n: "Kruška", g: "voc", a: "rounds:kruska" },
    { id: "grozdje", n: "Grožđe", g: "voc", a: "berry:grozdje" },
    { id: "borovnica", n: "Borovnice", g: "voc", a: "berry:borovnica" },
    { id: "breskva", n: "Breskva", g: "voc", a: "rounds:breskva" },

    /* mleko i sir */
    { id: "mleko", n: "Mleko", g: "mle", a: "liquid:mleko" },
    { id: "jogurt", n: "Jogurt", g: "mle", a: "liquid:jogurt" },
    { id: "belisir", n: "Beli sir", g: "mle", a: "cubes:bela", s: "feta sir" },
    { id: "kackavalj", n: "Kačkavalj", g: "mle", a: "wedges:kackavalj", s: "zuti sir gauda" },
    { id: "pavlaka", n: "Pavlaka", g: "mle", a: "swirl:pavlaka", s: "kisela slag" },
    { id: "puter", n: "Puter", g: "mle", a: "cubes:puter", s: "maslac" },

    /* meso, riba i jaja */
    { id: "jaja", n: "Jaja", g: "mes", a: "fried_egg", s: "jaje" },
    { id: "piletina", n: "Piletina", g: "mes", a: "patty:pile", s: "pile batak belo meso" },
    { id: "mleveno", n: "Mleveno meso", g: "mes", a: "patty:meso", s: "fas" },
    { id: "sunka", n: "Šunka", g: "mes", a: "rounds:sunka" },
    { id: "virsle", n: "Viršle", g: "mes", a: "stick:sunka", s: "hrenovke" },
    { id: "tunjevina", n: "Tunjevina", g: "mes", a: "mound:riba", s: "tuna riba" },
    { id: "slanina", n: "Slanina", g: "mes", a: "stick:meso" },

    /* testenina i žitarice */
    { id: "testenina", n: "Testenina", g: "zit", a: "noodles:testenina", s: "pasta makarone spageti" },
    { id: "pirinac", n: "Pirinač", g: "zit", a: "grains:pirinac", s: "riza" },
    { id: "hleb", n: "Hleb", g: "zit", a: "bread:hleb", s: "vekna zemicka" },
    { id: "tost", n: "Tost hleb", g: "zit", a: "bread:tost" },
    { id: "pahuljice", n: "Pahuljice", g: "zit", a: "sprinkle:kora", s: "kukuruzne corn flakes" },
    { id: "ovsene", n: "Ovsene pahuljice", g: "zit", a: "grains:testenina", s: "zobene ovas" },
    { id: "palenta", n: "Palenta", g: "zit", a: "mound:palenta", s: "kacamak" },
    { id: "tortilja", n: "Tortilja", g: "zit", a: "stack:tost", s: "lepinja rap" },

    /* ostalo */
    { id: "med", n: "Med", g: "ost", a: "liquid:med" },
    { id: "kakao", n: "Kakao", g: "ost", a: "sprinkle:kakao" },
    { id: "cokolada", n: "Čokolada", g: "ost", a: "cubes:cokolada", s: "krem" },
    { id: "orasi", n: "Orasi", g: "ost", a: "cubes:orasi", s: "lesnici bademi" },
    { id: "keks", n: "Keks", g: "ost", a: "stack:keks", s: "plazma biskvit" },
    { id: "bosiljak", n: "Bosiljak", g: "ost", a: "leaves:zelen", s: "zacin peršun origano" },

    /* uvek pri ruci — ne prikazuju se u mreži */
    { id: "so", n: "So", g: "osn", a: "sprinkle:bela", stap: 1 },
    { id: "ulje", n: "Ulje", g: "osn", a: "liquid:ulje", stap: 1 },
    { id: "voda", n: "Voda", g: "osn", a: "liquid:voda", stap: 1 },
    { id: "biber", n: "Biber", g: "osn", a: "sprinkle:tamna", stap: 1 },
    { id: "brasno", n: "Brašno", g: "osn", a: "mound:bela", stap: 1 },
    { id: "secer", n: "Šećer", g: "osn", a: "sprinkle:bela", stap: 1 }
  ];

  var GRUPE = [
    { k: "pov", n: "Povrće" },
    { k: "voc", n: "Voće" },
    { k: "mle", n: "Mleko i sir" },
    { k: "mes", n: "Meso, riba i jaja" },
    { k: "zit", n: "Testenina i žitarice" },
    { k: "ost", n: "Ostalo" }
  ];

  /* ═══ jela ══════════════════════════════════════════════════════════
     `m` je niz jer su palačinke i doručak i užina, a pasta i ručak i večera.
     `req` traži, `opt` samo diže jelo na listi. `lvl` je težina i pada pravo u
     iste crtice koje vežbe već koriste: 1 bez šporeta · 2 tiganj ili šerpa ·
     3 rerna ili nešto što dugo traje. */

  var JELA = [

    /* ── doručak ─────────────────────────────────────────────────── */

    { id: "kajgana", n: "Kajgana", m: ["dor"],
      req: ["jaja"], opt: ["kackavalj", "sunka", "bosiljak"],
      min: 10, lvl: 2, os: 2,
      art: { v: "tanjir", t: ["mound:jaje", "sprinkle:zelen"] },
      desc: "Najbrži topao doručak koji postoji.",
      sast: ["3 jajeta", "kašika ulja ili malo putera", "so"],
      koraci: [
        "Razbij jaja u činiju i dobro ih izmešaj viljuškom.",
        "Zagrej tiganj na srednjoj vatri i stavi malo ulja.",
        "Sipaj jaja i sačekaj desetak sekundi da uhvate dno.",
        "Mešaj polako drvenom kuvačom dok se ne skupe u mekane grudvice.",
        "Skloni sa vatre čim prestanu da budu vlažna — posle toga se suše.",
        "Posoli i odmah služi."
      ] },

    { id: "jaje-tost", n: "Jaje na oko sa tostom", m: ["dor"],
      req: ["jaja", "tost"], opt: ["puter", "kackavalj"],
      min: 12, lvl: 2, os: 1,
      art: { v: "tanjir", t: ["bread:tost", "fried_egg"] },
      desc: "Žumance koje se razlije po tostu.",
      sast: ["1 jaje", "2 kriške tost hleba", "malo ulja ili putera", "so"],
      koraci: [
        "Stavi tost u toster ili ga zapeci u suvom tiganju sa obe strane.",
        "Zagrej tiganj sa malo ulja na srednje slaboj vatri.",
        "Razbij jaje pažljivo u tiganj, tako da se žumance ne pokida.",
        "Poklopi i peci dva do tri minuta — belance mora da pobeli, žumance da ostane meko.",
        "Prevrni jaje na tost, posoli i jedi dok je toplo."
      ] },

    { id: "palacinke", n: "Palačinke", m: ["dor", "uzi"],
      req: ["jaja", "mleko"], opt: ["med", "cokolada", "jagoda"],
      min: 25, lvl: 2, os: 4,
      art: { v: "tanjir", t: ["stack:tost", "sauce:med"] },
      desc: "Tanke, mekane i uvek premalo.",
      sast: ["2 jajeta", "300 ml mleka", "200 g brašna", "prstohvat soli", "ulje za tiganj"],
      koraci: [
        "Umuti jaja sa mlekom i prstohvatom soli.",
        "Dodaj brašno postepeno i mešaj dok ne nestane svaka grudvica.",
        "Ostavi testo da odstoji deset minuta — tako palačinke budu mekše.",
        "Zagrej tiganj i premaži ga tankim slojem ulja.",
        "Sipaj kutlaču testa i nagni tiganj u krug da se razlije po celom dnu.",
        "Peci dok se ivice ne odvoje, prevrni i peci još pola minuta.",
        "Namaži šta voliš, savij i ređaj na tanjir."
      ] },

    { id: "ovsena-kasa", n: "Ovsena kaša sa bananom", m: ["dor"],
      req: ["ovsene", "mleko", "banana"], opt: ["med", "orasi", "kakao"],
      min: 10, lvl: 2, os: 1,
      art: { v: "cinija", t: ["mound:pirinac", "rounds:banana", "sprinkle:kora"] },
      desc: "Topla činija koja te drži sitom do velikog odmora.",
      sast: ["5 kašika ovsenih pahuljica", "200 ml mleka", "1 banana", "kašičica meda"],
      koraci: [
        "Stavi pahuljice i mleko u šerpicu.",
        "Kuvaj na tihoj vatri četiri do pet minuta i stalno mešaj.",
        "Skloni sa vatre kad se zgusne — nastaviće da se gusti i posle.",
        "Iseci bananu na kolutove i poređaj je odozgo.",
        "Prelij medom i pojedi dok je toplo."
      ] },

    { id: "sendvic-sir-sunka", n: "Sendvič sa sirom i šunkom", m: ["dor", "uzi"],
      req: ["hleb", "kackavalj", "sunka"], opt: ["puter", "paradajz", "salata"],
      min: 5, lvl: 1, os: 1,
      art: { v: "daska", t: ["bread:hleb", "rounds:sunka", "melt:kackavalj"] },
      desc: "Klasika koja se pravi za jedan minut.",
      sast: ["2 kriške hleba", "2 kriške kačkavalja", "2 kriške šunke", "malo putera"],
      koraci: [
        "Namaži obe kriške hleba tankim slojem putera.",
        "Poređaj kačkavalj pa šunku preko donje kriške.",
        "Ako imaš, dodaj kolutove paradajza i list salate.",
        "Poklopi drugom kriškom i preseci sendvič na pola po dijagonali."
      ] },

    { id: "jogurt-voce", n: "Jogurt sa voćem i medom", m: ["dor", "uzi"],
      req: ["jogurt"], opt: ["jagoda", "borovnica", "banana", "med", "orasi"],
      min: 5, lvl: 1, os: 1,
      art: { v: "cinija", t: ["liquid:jogurt", "berry:jagoda", "sauce:med"] },
      desc: "Sveže, hladno i gotovo pre nego što si stigla da smisliš šta ćeš.",
      sast: ["1 čaša jogurta", "šaka voća koje imaš", "kašičica meda"],
      koraci: [
        "Sipaj jogurt u činiju.",
        "Operi voće i iseci ga na komade koje možeš da uzmeš kašikom.",
        "Rasporedi voće po jogurtu.",
        "Prelij medom i, ako imaš, pospi izlomljenim orasima."
      ] },

    { id: "pahuljice-mleko", n: "Pahuljice sa mlekom", m: ["dor"],
      req: ["pahuljice", "mleko"], opt: ["banana", "med"],
      min: 3, lvl: 1, os: 1,
      art: { v: "cinija", t: ["liquid:mleko", "sprinkle:kora"] },
      desc: "Kad se probudiš pet minuta pre nego što treba da krenete.",
      sast: ["šolja kukuruznih pahuljica", "mleko po želji"],
      koraci: [
        "Sipaj pahuljice u dublju činiju.",
        "Prelij hladnim mlekom, taman toliko da ih pokrije.",
        "Ako hoćeš, dodaj kolutove banane.",
        "Jedi odmah — pahuljice omekšaju brzo."
      ] },

    { id: "topli-tost", n: "Topli tost sa kačkavaljem", m: ["dor", "uzi"],
      req: ["tost", "kackavalj"], opt: ["sunka", "paradajz", "puter"],
      min: 8, lvl: 2, os: 1,
      art: { v: "tanjir", t: ["bread:tost", "melt:kackavalj"] },
      desc: "Sir koji se otopi i razvuče kad ga prelomiš.",
      sast: ["2 kriške tost hleba", "2 kriške kačkavalja", "malo putera"],
      koraci: [
        "Namaži spoljne strane kriški tankim slojem putera.",
        "Stavi kačkavalj između kriški i dobro ih spoji.",
        "Peci u tiganju na srednjoj vatri, oko dva minuta sa svake strane.",
        "Pritisni sendvič lopaticom da se sir bolje otopi.",
        "Skini kad obe strane porumene i preseci na pola."
      ] },

    { id: "kajgana-sunka", n: "Kajgana sa šunkom i paprikom", m: ["dor"],
      req: ["jaja", "sunka", "paprika"], opt: ["luk", "kackavalj", "slanina"],
      min: 15, lvl: 2, os: 2,
      art: { v: "tanjir", t: ["mound:jaje", "cubes:sunka", "wedges:paprika"] },
      desc: "Kajgana koja je pojela pola frižidera.",
      sast: ["3 jajeta", "2 kriške šunke", "pola paprike", "kašika ulja", "so"],
      koraci: [
        "Iseci šunku i papriku na sitne kockice.",
        "Zagrej ulje u tiganju i propržite papriku dva minuta da omekša.",
        "Dodaj šunku i prži još minut.",
        "Razmuti jaja u činiji, posoli ih i sipaj u tiganj.",
        "Mešaj polako dok se jaja ne skupe, pa skloni sa vatre."
      ] },

    /* ── ručak ───────────────────────────────────────────────────── */

    { id: "pasta-pomodoro", n: "Pasta sa paradajz sosom", m: ["ruc", "vec"],
      req: ["testenina", "paradajz", "luk"], opt: ["kackavalj", "bosiljak", "beliluk"],
      min: 25, lvl: 2, os: 3,
      art: { v: "tanjir", t: ["noodles:testenina", "sauce:paradajz", "sprinkle:sir", "leaves:zelen"] },
      desc: "Klasika koja uvek uspe.",
      sast: ["250 g testenine", "4 paradajza ili pola konzerve pelata", "1 crni luk",
        "2 kašike ulja", "so", "kačkavalj za posipanje"],
      koraci: [
        "Stavi veliku šerpu vode da provri i dobro je posoli.",
        "Dok voda vri, iseci luk na sitno i propržite ga na ulju dok ne postane staklast.",
        "Dodaj iseckan paradajz, posoli i kuvaj sos petnaest minuta na tihoj vatri.",
        "Ubaci testeninu u ključalu vodu i kuvaj je koliko piše na kesici.",
        "Ocedi testeninu, ali sačuvaj malo vode od kuvanja.",
        "Sjedini testeninu sa sosom u tiganju i dodaj kašiku te vode da se sve poveže.",
        "Pospi rendanim kačkavaljem i listićima bosiljka."
      ] },

    { id: "makarone-sir", n: "Makarone sa sirom", m: ["ruc", "vec"],
      req: ["testenina", "kackavalj", "mleko"], opt: ["puter", "belisir"],
      min: 20, lvl: 2, os: 3,
      art: { v: "cinija", t: ["noodles:testenina", "melt:kackavalj"] },
      desc: "Kremasto, žuto i opasno dobro.",
      sast: ["250 g makarona", "150 g kačkavalja", "200 ml mleka", "kašika putera", "so"],
      koraci: [
        "Skuvaj makarone u posoljenoj vodi i ocedi ih.",
        "U istoj šerpi otopi puter na tihoj vatri.",
        "Sipaj mleko i pusti da se lagano zagreje, ali ne da provri.",
        "Dodaj rendani kačkavalj i mešaj dok se potpuno ne otopi.",
        "Vrati makarone u šerpu i promešaj da svaka bude obavijena sosom.",
        "Posoli po ukusu i služi odmah, dok je kremasto."
      ] },

    { id: "pileca-supa", n: "Pileća supa", m: ["ruc"],
      req: ["piletina", "sargarepa", "testenina"], opt: ["luk", "krompir", "bosiljak"],
      min: 45, lvl: 2, os: 4,
      art: { v: "cinija", t: ["liquid:supa", "rounds:sargarepa", "noodles:testenina", "steam"] },
      desc: "Ono što se kuva kad je neko prehlađen.",
      sast: ["500 g piletine", "2 šargarepe", "1 crni luk", "šaka sitne testenine", "so"],
      koraci: [
        "Stavi piletinu u veliku šerpu i prelij hladnom vodom da je pokrije.",
        "Pusti da provri, pa skini penu koja se skupi na vrhu.",
        "Dodaj oljuštenu šargarepu i ceo oljušten luk, posoli i smanji vatru.",
        "Kuvaj tiho oko trideset minuta, dok meso ne bude sasvim mekano.",
        "Izvadi meso i povrće, pa u supu ubaci testeninu i kuvaj je pet minuta.",
        "Iseci šargarepu na kolutove i vrati je u supu.",
        "Probaj da li treba još soli i služi vruće."
      ] },

    { id: "pirinac-povrce", n: "Pirinač sa povrćem", m: ["ruc", "vec"],
      req: ["pirinac", "sargarepa", "grasak"], opt: ["luk", "paprika", "tikvica"],
      min: 30, lvl: 2, os: 3,
      art: { v: "tanjir", t: ["grains:pirinac", "berry:grasak", "cubes:sargarepa"] },
      desc: "Šareno jelo koje se pravi u jednoj šerpi.",
      sast: ["200 g pirinča", "1 šargarepa", "šaka graška", "1 crni luk",
        "2 kašike ulja", "400 ml vode", "so"],
      koraci: [
        "Iseci luk i šargarepu na sitno.",
        "Propržite ih na ulju pet minuta, dok luk ne omekša.",
        "Dodaj opran pirinač i mešaj minut, da se zrna sjaje.",
        "Sipaj vodu, dodaj grašak i posoli.",
        "Poklopi i kuvaj na tihoj vatri petnaest minuta, bez otvaranja.",
        "Skloni sa vatre i ostavi poklopljeno još pet minuta pre nego što promešaš."
      ] },

    { id: "pohovana-piletina", n: "Pohovana piletina", m: ["ruc"],
      req: ["piletina", "jaja"], opt: ["limun", "krompir"],
      min: 30, lvl: 2, os: 3,
      art: { v: "tanjir", t: ["patty:kora", "wedges:limun"] },
      desc: "Hrskavo spolja, mekano unutra.",
      sast: ["500 g pilećih šnicli", "2 jajeta", "brašno", "prezle", "ulje za prženje", "so"],
      koraci: [
        "Istanji šnicle i posoli ih sa obe strane.",
        "Pripremi tri tanjira: brašno, razmućena jaja i prezle.",
        "Uvaljaj svaku šniclu prvo u brašno, pa u jaje, pa u prezle.",
        "Zagrej ulje u tiganju — spremno je kad mrvica prezli zacvrči.",
        "Prži šnicle tri do četiri minuta sa svake strane, dok ne budu zlatne.",
        "Vadi ih na papirni ubrus da upije višak masnoće.",
        "Služi sa kriškom limuna."
      ] },

    { id: "pire-virsle", n: "Krompir pire sa viršlama", m: ["ruc", "vec"],
      req: ["krompir", "mleko", "virsle"], opt: ["puter"],
      min: 35, lvl: 2, os: 3,
      art: { v: "tanjir", t: ["mound:krompir", "stick:sunka"] },
      desc: "Meki oblak od krompira sa viršlama pored.",
      sast: ["6 krompira", "150 ml mleka", "kašika putera", "4 viršle", "so"],
      koraci: [
        "Oljušti krompir, iseci ga na četvrtine i stavi u šerpu sa hladnom slanom vodom.",
        "Kuvaj dvadesetak minuta, dok viljuška ne uđe u krompir bez otpora.",
        "Ocedi vodu i vrati šerpu na kratko na vatru da voda ispari.",
        "Dodaj puter i toplo mleko, pa gnječi dok pire ne bude sasvim gladak.",
        "U drugoj šerpi zagrej vodu i ubaci viršle na pet minuta — ne sme da provri.",
        "Služi pire sa viršlama pored."
      ] },

    { id: "punjena-paprika", n: "Punjena paprika", m: ["ruc"],
      req: ["paprika", "mleveno", "pirinac", "paradajz"], opt: ["luk", "bosiljak"],
      min: 70, lvl: 3, os: 4,
      art: { v: "pleh", t: ["sauce:paradajz", "rounds:paprika"] },
      desc: "Nedeljni ručak, onaj koji miriše po celoj kući.",
      sast: ["6 baburi", "400 g mlevenog mesa", "100 g pirinča", "1 crni luk",
        "3 paradajza ili pola konzerve pelata", "ulje", "so"],
      koraci: [
        "Zagrej rernu na 200 stepeni.",
        "Odseci vrhove paprikama i pažljivo izvadi semenke.",
        "Iseci luk sitno i propržite ga na ulju dok ne omekša.",
        "Pomešaj luk, meso, opran pirinač i so u velikoj činiji.",
        "Napuni paprike smesom, ali ne do vrha — pirinač će nabubriti.",
        "Poređaj ih uspravno u pleh, prelij pasiranim paradajzom i dodaj malo vode.",
        "Peci pokriveno folijom četrdeset minuta, pa još deset bez folije."
      ] },

    { id: "satarash", n: "Sataraš", m: ["ruc", "vec"],
      req: ["paprika", "paradajz", "luk", "jaja"], opt: ["bosiljak"],
      min: 25, lvl: 2, os: 3,
      art: { v: "tanjir", t: ["sauce:paradajz", "cubes:paprika", "mound:jaje"] },
      desc: "Letnje jelo iz jednog tiganja.",
      sast: ["3 paprike", "3 paradajza", "1 crni luk", "3 jajeta", "2 kašike ulja", "so"],
      koraci: [
        "Iseci luk na rebarca, papriku na trake, a paradajz na kocke.",
        "Propržite luk na ulju dok ne postane staklast.",
        "Dodaj papriku i dinstaj je pet minuta.",
        "Ubaci paradajz, posoli i kuvaj dok se sos ne zgusne, oko deset minuta.",
        "Razbij jaja pravo u tiganj i mešaj dok se ne skupe.",
        "Skloni sa vatre čim se jaja stegnu."
      ] },

    { id: "musaka", n: "Musaka", m: ["ruc"],
      req: ["krompir", "mleveno", "jaja", "mleko"], opt: ["pavlaka", "luk"],
      min: 75, lvl: 3, os: 4,
      art: { v: "pleh", t: ["rounds:krompir", "patty:meso", "melt:jaje"] },
      desc: "Slojevi krompira i mesa pod zlatnom korom.",
      sast: ["8 krompira", "500 g mlevenog mesa", "1 crni luk", "3 jajeta",
        "200 ml mleka", "ulje", "so"],
      koraci: [
        "Zagrej rernu na 200 stepeni i nauljite pleh.",
        "Oljušti krompir i iseci ga na tanke kolutove.",
        "Propržite sitno iseckan luk, pa dodaj meso i prži dok ne promeni boju. Posoli.",
        "Ređaj u pleh: sloj krompira, sloj mesa, pa opet krompir odozgo.",
        "Peci četrdeset minuta, dok krompir ne omekša.",
        "Umuti jaja sa mlekom, prelij preko musake i vrati u rernu.",
        "Peci još petnaest minuta, dok kora ne porumeni."
      ] },

    { id: "corba-grasak", n: "Čorba od graška", m: ["ruc"],
      req: ["grasak", "sargarepa", "krompir"], opt: ["luk", "pavlaka", "bosiljak"],
      min: 35, lvl: 2, os: 4,
      art: { v: "cinija", t: ["liquid:grasak", "rounds:sargarepa", "steam"] },
      desc: "Zelena i topla, gotova pre nego što se sve ohladi.",
      sast: ["400 g graška", "1 šargarepa", "2 krompira", "1 crni luk",
        "kašika ulja", "1 l vode", "so"],
      koraci: [
        "Iseci luk, šargarepu i krompir na kockice.",
        "Propržite luk na ulju dva minuta.",
        "Dodaj šargarepu i krompir i prži još tri minuta.",
        "Sipaj vodu, posoli i kuvaj petnaest minuta.",
        "Ubaci grašak i kuvaj još deset minuta, dok sve ne omekša.",
        "Ako voliš gušće, izgnječi malo krompira kuvačom uz zid šerpe."
      ] },

    { id: "prebranac", n: "Prebranac", m: ["ruc"],
      req: ["pasulj", "luk"], opt: ["paprika", "slanina", "bosiljak"],
      min: 90, lvl: 3, os: 4,
      art: { v: "pleh", t: ["sauce:paradajz", "berry:pasulj"] },
      desc: "Traje dugo, ali se posle jede dva dana.",
      sast: ["500 g pasulja (potopljenog preko noći)", "4 crna luka",
        "2 kašike mlevene paprike", "ulje", "so"],
      koraci: [
        "Skuvaj potopljen pasulj u čistoj vodi dok ne omekša, oko četrdeset minuta.",
        "Zagrej rernu na 200 stepeni.",
        "Iseci luk na rebarca i dinstaj ga na ulju dok ne postane mek i sladak.",
        "Skloni luk sa vatre i umešaj mlevenu papriku — brzo, da ne zagori.",
        "Ređaj u vatrostalnu posudu naizmenično sloj pasulja i sloj luka.",
        "Prelij sa malo vode od kuvanja pasulja i posoli.",
        "Peci četrdeset minuta, dok se gore ne uhvati rumena korica."
      ] },

    { id: "pica-tortilja", n: "Pica na tortilji", m: ["ruc", "uzi"],
      req: ["tortilja", "paradajz", "kackavalj"], opt: ["sunka", "bosiljak", "paprika"],
      min: 15, lvl: 3, os: 2,
      art: { v: "tanjir", t: ["stack:tost", "sauce:paradajz", "melt:kackavalj", "leaves:zelen"] },
      desc: "Pica gotova za petnaest minuta, bez mešenja.",
      sast: ["2 tortilje", "4 kašike pasiranog paradajza", "150 g kačkavalja",
        "šunka i paprika po želji", "bosiljak"],
      koraci: [
        "Zagrej rernu na 220 stepeni.",
        "Stavi tortilje na papir za pečenje.",
        "Premaži svaku tankim slojem pasiranog paradajza, ali ostavi ivicu praznu.",
        "Pospi rendanim kačkavaljem, pa dodaj šta još voliš.",
        "Peci osam do deset minuta, dok se sir ne otopi a ivice ne postanu hrskave.",
        "Pospi bosiljkom i iseci na trouglove."
      ] },

    /* ── večera ──────────────────────────────────────────────────── */

    { id: "omlet-sir", n: "Omlet sa sirom", m: ["vec", "dor"],
      req: ["jaja", "kackavalj"], opt: ["mleko", "bosiljak", "sunka"],
      min: 12, lvl: 2, os: 2,
      art: { v: "tanjir", t: ["patty:jaje", "melt:kackavalj"] },
      desc: "Kao kajgana, samo uredniji.",
      sast: ["3 jajeta", "50 g kačkavalja", "kašika mleka", "malo putera", "so"],
      koraci: [
        "Umuti jaja sa kašikom mleka i prstohvatom soli.",
        "Zagrej tiganj sa malo putera na srednje slaboj vatri.",
        "Sipaj jaja i pusti ih da se stegnu, bez mešanja.",
        "Kad je gornja strana još malo vlažna, pospi kačkavalj preko jedne polovine.",
        "Preklopi omlet na pola lopaticom i drži ga još minut.",
        "Prebaci na tanjir dok je sir otopljen."
      ] },

    { id: "salata-tunjevina", n: "Salata sa tunjevinom", m: ["vec"],
      req: ["tunjevina", "salata", "paradajz"], opt: ["krastavac", "limun", "luk"],
      min: 10, lvl: 1, os: 2,
      art: { v: "cinija", t: ["leaves:salata", "mound:riba", "rounds:paradajz"] },
      desc: "Lagana večera bez uključivanja šporeta.",
      sast: ["1 konzerva tunjevine", "glavica zelene salate", "2 paradajza",
        "pola krastavca", "kašika ulja", "sok od pola limuna", "so"],
      koraci: [
        "Operi salatu, dobro je otresi i pocepaj rukama na komade.",
        "Iseci paradajz na kriške, a krastavac na kolutove.",
        "Ocedi tunjevinu i rasporedi je po povrću.",
        "Prelij uljem i limunom, posoli i lagano promešaj."
      ] },

    { id: "sopska", n: "Šopska salata", m: ["vec", "ruc"],
      req: ["paradajz", "krastavac", "belisir"], opt: ["luk", "paprika"],
      min: 10, lvl: 1, os: 2,
      art: { v: "cinija", t: ["cubes:paradajz", "cubes:krastavac", "sprinkle:bela"] },
      desc: "Sneg od sira preko crvenog paradajza.",
      sast: ["3 paradajza", "1 krastavac", "150 g belog sira", "kašika ulja", "so"],
      koraci: [
        "Iseci paradajz i krastavac na kockice slične veličine.",
        "Stavi ih u činiju, posoli i prelij uljem.",
        "Izrendaj beli sir krupno preko salate, tako da pokrije sve.",
        "Nemoj mešati posle sira — lepše je da ostane kao sneg odozgo."
      ] },

    { id: "krompir-rerna", n: "Krompir iz rerne", m: ["vec"],
      req: ["krompir"], opt: ["beliluk", "bosiljak", "kackavalj"],
      min: 45, lvl: 3, os: 3,
      art: { v: "pleh", t: ["wedges:krompir", "sprinkle:zelen"] },
      desc: "Zlatne kriške sa hrskavim ivicama.",
      sast: ["6 krompira", "3 kašike ulja", "2 čena belog luka", "so", "bosiljak"],
      koraci: [
        "Zagrej rernu na 220 stepeni.",
        "Operi krompir i iseci ga na kriške, ne moraš da ga ljuštiš.",
        "Stavi kriške u činiju, prelij uljem, posoli i promešaj rukama da se sve obloži.",
        "Prospi ih u pleh u jednom sloju — ako se preklapaju, neće biti hrskave.",
        "Peci trideset pet minuta, a na pola vremena ih promešaj.",
        "Pospi seckanim belim lukom i bosiljkom čim izađu iz rerne."
      ] },

    { id: "palenta-sir", n: "Palenta sa sirom", m: ["vec"],
      req: ["palenta", "belisir"], opt: ["puter", "mleko", "pavlaka"],
      min: 25, lvl: 2, os: 3,
      art: { v: "cinija", t: ["mound:palenta", "cubes:bela"] },
      desc: "Žuta, topla i punija nego što izgleda.",
      sast: ["200 g palente", "800 ml vode", "150 g belog sira", "kašika putera", "so"],
      koraci: [
        "Stavi vodu da provri i posoli je.",
        "Sipaj palentu u tankom mlazu i istovremeno mešaj — inače će biti grudvica.",
        "Kuvaj na tihoj vatri petnaest minuta i mešaj svaki minut.",
        "Skloni sa vatre i umešaj puter.",
        "Sipaj u činije i izmrvi beli sir odozgo, da se malo otopi."
      ] },

    { id: "tost-paradajz", n: "Tost sa paradajzom", m: ["vec", "uzi"],
      req: ["tost", "paradajz"], opt: ["bosiljak", "belisir", "beliluk"],
      min: 8, lvl: 1, os: 1,
      art: { v: "daska", t: ["bread:tost", "rounds:paradajz", "leaves:zelen"] },
      desc: "Tri sastojka, a sasvim dovoljno.",
      sast: ["2 kriške tost hleba", "1 paradajz", "kašika ulja", "so", "bosiljak"],
      koraci: [
        "Zapeci tost u tosteru ili u suvom tiganju.",
        "Iseci paradajz na tanke kolutove i lagano ih posoli.",
        "Poređaj paradajz preko toplog tosta.",
        "Prelij kapima ulja i pospi bosiljkom."
      ] },

    { id: "grilovano-povrce", n: "Grilovano povrće", m: ["vec"],
      req: ["tikvica", "paprika"], opt: ["paradajz", "beliluk", "bosiljak"],
      min: 25, lvl: 2, os: 3,
      art: { v: "tanjir", t: ["rounds:tikvica", "wedges:paprika", "leaves:zelen"] },
      desc: "Šareno i lako, sa tragovima roštilja.",
      sast: ["2 tikvice", "2 paprike", "2 kašike ulja", "so", "bosiljak"],
      koraci: [
        "Iseci tikvice na kolutove debele oko pola centimetra, a papriku na široke trake.",
        "Prelij povrće uljem i posoli.",
        "Zagrej grill tiganj dobro — mora da bude vruć pre nego što staviš povrće.",
        "Peči svaku stranu tri do četiri minuta, dok se ne pojave tamne pruge.",
        "Slaži na tanjir i pospi bosiljkom dok je toplo."
      ] },

    { id: "batak-rerna", n: "Piletina iz rerne sa krompirom", m: ["vec", "ruc"],
      req: ["piletina", "krompir"], opt: ["beliluk", "bosiljak", "limun"],
      min: 60, lvl: 3, os: 4,
      art: { v: "pleh", t: ["patty:pile", "wedges:krompir"] },
      desc: "Sve u jednom plehu, a rerna radi umesto tebe.",
      sast: ["4 pileća bataka", "6 krompira", "3 kašike ulja", "2 čena belog luka", "so"],
      koraci: [
        "Zagrej rernu na 200 stepeni.",
        "Iseci krompir na krupnije kriške i prospi ga po plehu.",
        "Posoli piletinu sa svih strana i poređaj je preko krompira.",
        "Prelij sve uljem i dodaj seckan beli luk.",
        "Peci četrdeset pet minuta.",
        "Proveri da li je meso pečeno — sok koji izađe kad ga probodeš mora da bude bistar."
      ] },

    { id: "sendvic-piletina", n: "Sendvič sa piletinom", m: ["vec", "uzi"],
      req: ["hleb", "piletina", "salata"], opt: ["paradajz", "pavlaka", "krastavac"],
      min: 10, lvl: 1, os: 1,
      art: { v: "daska", t: ["bread:hleb", "leaves:salata", "patty:pile"] },
      desc: "Za kad je ostalo piletine od ručka.",
      sast: ["2 kriške hleba", "komad pečene piletine", "2 lista zelene salate",
        "kašika pavlake", "paradajz"],
      koraci: [
        "Iseci piletinu na tanke trake.",
        "Namaži donju krišku hleba pavlakom.",
        "Poređaj list salate, pa piletinu, pa kolutove paradajza.",
        "Poklopi drugom kriškom i pritisni dlanom da se sendvič drži."
      ] },

    { id: "jaja-spanac", n: "Jaja sa spanaćem", m: ["vec"],
      req: ["jaja", "spanac"], opt: ["belisir", "luk", "beliluk"],
      min: 15, lvl: 2, os: 2,
      art: { v: "tanjir", t: ["leaves:spanac", "mound:jaje"] },
      desc: "Zeleno i žuto, gotovo za petnaest minuta.",
      sast: ["3 jajeta", "200 g spanaća", "1 čen belog luka", "kašika ulja", "so"],
      koraci: [
        "Operi spanać i ocedi ga.",
        "Zagrej ulje i kratko propržite seckan beli luk, samo dok ne zamiriše.",
        "Ubaci spanać — deluje kao mnogo, ali se skupi za minut.",
        "Kad uvene, posoli ga i razmakni u tiganju da napraviš mesta.",
        "Razbij jaja u sredinu i mešaj dok se ne stegnu.",
        "Ako imaš, izmrvi beli sir odozgo."
      ] },

    { id: "corba-paradajz", n: "Čorba od paradajza", m: ["vec", "ruc"],
      req: ["paradajz", "luk"], opt: ["pavlaka", "bosiljak", "beliluk"],
      min: 30, lvl: 2, os: 3,
      art: { v: "cinija", t: ["liquid:paradajz", "swirl:pavlaka", "steam"] },
      desc: "Crvena i topla, sa belim vrtlogom pavlake.",
      sast: ["6 paradajza ili 1 konzerva pelata", "1 crni luk", "kašika ulja",
        "500 ml vode", "kašika pavlake", "so"],
      koraci: [
        "Iseci luk sitno i dinstaj ga na ulju dok ne omekša.",
        "Dodaj iseckan paradajz i kuvaj deset minuta, dok se ne raspadne.",
        "Sipaj vodu, posoli i kuvaj još petnaest minuta.",
        "Ako voliš glatko, izgnječi sve kuvačom uz zid šerpe.",
        "Sipaj u činije i u sredinu svake stavi kašiku pavlake.",
        "Pospi bosiljkom."
      ] },

    /* ── užina ───────────────────────────────────────────────────── */

    { id: "vocna-salata", n: "Voćna salata", m: ["uzi"],
      req: ["jabuka", "banana"], opt: ["pomorandza", "grozdje", "kruska", "breskva", "med"],
      min: 10, lvl: 1, os: 2,
      art: { v: "cinija", t: ["cubes:jabuka", "rounds:banana", "berry:grozdje"] },
      desc: "Sve voće koje imaš, u jednoj činiji.",
      sast: ["1 jabuka", "1 banana", "šaka grožđa", "1 pomorandža", "kašičica meda"],
      koraci: [
        "Operi voće i oljušti ono što treba.",
        "Iseci sve na komade slične veličine — tako je lepše za jelo.",
        "Stavi u činiju i prelij sokom od pola pomorandže, da jabuka ne potamni.",
        "Dodaj kašičicu meda i lagano promešaj."
      ] },

    { id: "smuti", n: "Smuti od banane i jagode", m: ["uzi", "dor"],
      req: ["banana", "jagoda", "jogurt"], opt: ["med", "mleko", "borovnica"],
      min: 5, lvl: 1, os: 2,
      art: { v: "casa", t: ["liquid:jagoda", "swirl:pavlaka"] },
      desc: "Roze, hladno i gotovo za minut.",
      sast: ["1 banana", "šaka jagoda", "150 ml jogurta", "kašičica meda"],
      koraci: [
        "Oljušti bananu i izlomi je na komade.",
        "Operi jagode i skini im peteljke.",
        "Stavi sve u blender zajedno sa jogurtom i medom.",
        "Blendaj pola minuta, dok ne bude sasvim glatko.",
        "Sipaj u visoku čašu i popij odmah."
      ] },

    { id: "palacinke-cokolada", n: "Palačinke sa čokoladom", m: ["uzi"],
      req: ["jaja", "mleko", "cokolada"], opt: ["banana", "orasi"],
      min: 25, lvl: 2, os: 4,
      art: { v: "tanjir", t: ["stack:tost", "sauce:cokolada"] },
      desc: "Isto kao palačinke, samo bolje.",
      sast: ["2 jajeta", "300 ml mleka", "200 g brašna", "čokoladni krem", "ulje za tiganj"],
      koraci: [
        "Umuti jaja sa mlekom, pa postepeno dodaj brašno bez grudvica.",
        "Ispeci palačinke u zagrejanom nauljenom tiganju, jednu po jednu.",
        "Namaži svaku čokoladnim kremom dok je još topla — tako se lakše razmaže.",
        "Savij palačinku na četvrtine ili je urolaj.",
        "Ako imaš, dodaj kolutove banane pre savijanja."
      ] },

    { id: "sendvic-med", n: "Sendvič sa medom", m: ["uzi"],
      req: ["hleb", "med"], opt: ["puter", "banana", "orasi"],
      min: 4, lvl: 1, os: 1,
      art: { v: "daska", t: ["bread:hleb", "sauce:med"] },
      desc: "Najjednostavnija slatka užina.",
      sast: ["2 kriške hleba", "2 kašičice meda", "malo putera"],
      koraci: [
        "Namaži kriške tankim slojem putera.",
        "Prelij medom i razmaži ga kašičicom po celoj površini.",
        "Ako imaš, dodaj kolutove banane.",
        "Poklopi i preseci na pola."
      ] },

    { id: "jabuka-med-orasi", n: "Jabuka sa medom i orasima", m: ["uzi"],
      req: ["jabuka", "med", "orasi"], opt: ["kakao", "cokolada"],
      min: 6, lvl: 1, os: 1,
      art: { v: "tanjir", t: ["wedges:jabuka", "cubes:orasi", "sauce:med"] },
      desc: "Hrskavo, slatko i pametno.",
      sast: ["1 jabuka", "kašičica meda", "šaka oraha"],
      koraci: [
        "Operi jabuku i iseci je na kriške, a sredinu sa semenkama baci.",
        "Poređaj kriške na tanjir u krug.",
        "Izlomi orahe prstima na sitnije komade i pospi ih preko.",
        "Prelij medom."
      ] },

    { id: "keks-mleko", n: "Keks sa mlekom", m: ["uzi"],
      req: ["keks", "mleko"], opt: ["kakao", "cokolada"],
      min: 3, lvl: 1, os: 1,
      art: { v: "tanjir", t: ["stack:keks"] },
      desc: "Za kad ti treba nešto malo, a odmah.",
      sast: ["šaka keksa", "čaša mleka"],
      koraci: [
        "Sipaj mleko u čašu.",
        "Poređaj keks na tanjirić pored.",
        "Umači keks u mleko, ali kratko — inače se prelomi u čaši."
      ] },

    { id: "banana-cokolada", n: "Banana u čokoladi", m: ["uzi"],
      req: ["banana", "cokolada"], opt: ["orasi", "keks"],
      min: 15, lvl: 2, os: 2,
      art: { v: "daska", t: ["stick:banana", "sauce:cokolada", "sprinkle:orasi"] },
      desc: "Izgleda kao poslastičarnica, a pravi se kod kuće.",
      sast: ["2 banane", "100 g čokolade", "šaka mlevenih oraha"],
      koraci: [
        "Oljušti banane i preseci svaku na pola po dužini.",
        "Izlomi čokoladu i otopi je nad parom — u činiji iznad šerpe sa vrelom vodom.",
        "Pazi da voda ne dodiruje činiju i da ne uđe u čokoladu.",
        "Umoči svaku polovinu banane u čokoladu.",
        "Pospi mlevenim orasima i stavi u frižider na deset minuta da se stegne."
      ] },

    { id: "topli-kakao", n: "Topli kakao", m: ["uzi", "dor"],
      req: ["mleko", "kakao"], opt: ["pavlaka", "cokolada"],
      min: 8, lvl: 2, os: 2,
      art: { v: "solja", t: ["liquid:kakao", "swirl:pavlaka", "steam"] },
      desc: "Šolja koja greje ruke pre nego što je popiješ.",
      sast: ["300 ml mleka", "2 kašičice kakaa", "2 kašičice šećera", "kašika pavlake"],
      koraci: [
        "Pomešaj kakao i šećer u šolji sa dve kašike hladnog mleka, dok ne dobiješ gustu smesu.",
        "Zagrej ostatak mleka u šerpici, ali ga ne pusti da provri.",
        "Sipaj toplo mleko u šolju i mešaj dok se sve ne sjedini.",
        "Odozgo stavi kašiku pavlake."
      ] },

    { id: "stapici-sargarepa", n: "Štapići od šargarepe", m: ["uzi"],
      req: ["sargarepa"], opt: ["pavlaka", "limun", "krastavac"],
      min: 8, lvl: 1, os: 2,
      art: { v: "daska", t: ["stick:sargarepa"] },
      desc: "Hrskavo, i može da se umače.",
      sast: ["3 šargarepe", "3 kašike pavlake", "so", "malo limuna"],
      koraci: [
        "Operi i oljušti šargarepe.",
        "Iseci ih po dužini na štapiće debele kao prst.",
        "Pomešaj pavlaku sa prstohvatom soli i kapima limuna.",
        "Sipaj umak u malu činiju i poređaj štapiće oko nje."
      ] },

    { id: "puding", n: "Puding od čokolade", m: ["uzi"],
      req: ["mleko", "cokolada"], opt: ["pavlaka", "orasi", "keks"],
      min: 20, lvl: 2, os: 4,
      art: { v: "cinija", t: ["mound:cokolada", "swirl:pavlaka"] },
      desc: "Gust, taman i hladan iz frižidera.",
      sast: ["500 ml mleka", "100 g čokolade", "2 kašike brašna", "2 kašike šećera"],
      koraci: [
        "Odvoj pola šolje hladnog mleka i u njemu razmuti brašno bez grudvica.",
        "Ostatak mleka zagrej sa šećerom u šerpici.",
        "Kad se zagreje, sipaj razmućeno brašno i mešaj bez prestanka.",
        "Dodaj izlomljenu čokoladu i mešaj dok se ne otopi i smesa ne postane gusta.",
        "Sipaj u činijice i ostavi da se ohladi, pa u frižider na sat vremena."
      ] },

    { id: "tortilja-sir", n: "Tortilja sa sirom", m: ["uzi", "vec"],
      req: ["tortilja", "kackavalj"], opt: ["sunka", "paradajz", "bosiljak"],
      min: 10, lvl: 2, os: 1,
      art: { v: "daska", t: ["stack:tost", "melt:kackavalj"] },
      desc: "Presavijena, zapečena i hrskava po ivicama.",
      sast: ["1 tortilja", "80 g kačkavalja", "kriška šunke"],
      koraci: [
        "Pospi rendani kačkavalj preko jedne polovine tortilje.",
        "Dodaj šunku ako je imaš i preklopi tortilju na pola.",
        "Peci u suvom tiganju na srednjoj vatri dva minuta.",
        "Prevrni je i peci još dva minuta, dok se sir ne otopi.",
        "Iseci na trouglove i jedi dok se sir razvlači."
      ] }

  ];

  global.KUVANJE = { SASTOJCI: SASTOJCI, GRUPE: GRUPE, JELA: JELA, OBROCI: OBROCI };
})(window);
