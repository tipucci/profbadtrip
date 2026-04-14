# profbadtrip

Archivio statico dedicato a Gianluca Lerici, alias Professor Bad Trip: un progetto editoriale e visivo che raccoglie una selezione di opere, pubblicazioni e materiali di contesto in un sito leggero, navigabile e pubblicabile su hosting statico.

## Preview

- Demo: [https://profbadtrip.tipucci.it/](https://profbadtrip.tipucci.it/)
- Repository: [https://github.com/tipucci/profbadtrip](https://github.com/tipucci/profbadtrip)


## Perche Esiste Il Progetto

`profbadtrip` nasce come sito dedicato all'opera visiva di Gianluca Lerici, con l'obiettivo di costruire uno spazio semplice, indipendente e consultabile per esplorare immagini, pubblicazioni e riferimenti essenziali.

Il progetto parte da una base storica personale e viene ripreso, ripulito e adattato per una pubblicazione pubblica piu solida: non come esercizio astratto, ma come piccolo archivio web statico con una direzione visiva precisa e una struttura leggibile anche per chi arriva da fuori.

## Funzionalita Principali

- Home editoriale con accesso rapido al documentario.
- Galleria filtrabile per categoria e stile visivo.
- Sezione pubblicazioni con filtri per tipologia e intervallo temporale.
- Pagina biografica e pagina credits dedicate al contesto del progetto.
- Lightbox per immagini e copertine.
- Layout responsive senza dipendenze di build.
- Compatibilita con GitHub Pages e hosting statico tradizionale.
- Dominio personalizzato tramite file `CNAME`.
- File utili al deploy statico gia presenti: `404.html`, `robots.txt`, `sitemap.xml`.
- Redirect legacy Apache disponibili tramite file `.htaccess` per il vecchio percorso `/progetti/profbadtrip/`.

## Stack Utilizzato

- HTML
- CSS
- JavaScript vanilla
- Google Fonts
- GitHub Pages per il deploy statico

Il progetto non usa framework frontend, bundler o dipendenze runtime: tutto il sito e composto da file statici versionati direttamente nel repository.

## Struttura Del Progetto

```text
profbadtrip/
|- index.html
|- biografia.html
|- credits.html
|- galleria.html
|- pubblicazioni.html
|- 404.html
|- CNAME
|- robots.txt
|- sitemap.xml
|- favicon.ico
|- stile.css
|- mobile.css
|- stampa.css
|- shared.js
|- scriptGalleria.js
|- scriptPubb.js
|- data-galleria.js
|- data-pubblicazioni.js
|- immagini/
`- README.md
```

### File principali

- `index.html`: homepage del progetto.
- `galleria.html`: archivio visivo delle opere con filtri.
- `pubblicazioni.html`: elenco filtrabile di pubblicazioni e copertine.
- `biografia.html`: profilo biografico sintetico.
- `credits.html`: note di contesto, attribuzioni e crediti.
- `stile.css`: stylesheet principale desktop.
- `mobile.css`: adattamenti per schermi piccoli.
- `stampa.css`: regole per la stampa.
- `shared.js`: comportamenti condivisi dell'interfaccia.
- `data-galleria.js`: dataset della galleria.
- `data-pubblicazioni.js`: dataset delle pubblicazioni.

## Avvio Locale

Il progetto non richiede installazione di dipendenze.

### Opzione veloce

Apri direttamente `index.html` nel browser.

### Opzione consigliata

Per evitare differenze tra file aperti localmente e sito servito via HTTP, usa un piccolo server statico locale.

Esempi:

```bash
python -m http.server 8000
```

oppure, se usi Node.js:

```bash
npx serve .
```

Poi apri:

```text
http://localhost:8000
```

## Come Modificarlo

### Contenuti

- Per aggiungere o correggere opere della galleria, aggiorna `data-galleria.js`.
- Per aggiungere o correggere pubblicazioni, aggiorna `data-pubblicazioni.js`.
- Per testi e contenuti editoriali, modifica direttamente i file HTML.

### Stili

- Usa `stile.css` per la base grafica.
- Usa `mobile.css` per gli adattamenti responsive.
- Usa `stampa.css` solo per la resa print.

### Interazioni

- `shared.js` contiene la logica condivisa di navigazione e utility UI.
- `scriptGalleria.js` gestisce filtri, rendering e lightbox della galleria.
- `scriptPubb.js` gestisce filtri e lightbox delle pubblicazioni.

## Deploy

Il progetto e pensato per essere pubblicato come sito statico, senza build step.

### GitHub Pages

1. Pubblica il repository su GitHub.
2. Vai in `Settings > Pages`.
3. Seleziona `Deploy from a branch`.
4. Scegli il branch `main`.
5. Imposta la cartella `/ (root)`.
6. Verifica che `CNAME` sia presente se usi un dominio personalizzato.

### Hosting statico generico

Puoi pubblicare il contenuto del repository anche su qualunque hosting statico che serva file HTML, CSS, JS e asset senza trasformazioni.

Per il dominio personalizzato, assicurati che:

- i path interni restino relativi;
- `404.html` sia incluso;
- `robots.txt` e `sitemap.xml` puntino al dominio corretto;
- il DNS del sottodominio sia configurato verso il provider scelto.

### Redirect 301 dal vecchio percorso

Se il sito prima era pubblicato in una sottocartella, per esempio:

```text
https://www.tipucci.it/progetti/profbadtrip/
```

il redirect permanente va configurato sul vecchio hosting, non sul nuovo sottodominio.

Nel repository e presente un file `.htaccess` pronto all'uso con redirect `301` verso:

```text
https://profbadtrip.tipucci.it/
```

Perche funzioni correttamente:

1. carica il file `.htaccess` dentro la vecchia cartella `/progetti/profbadtrip/`;
2. assicurati che `mod_rewrite` sia attivo sul server Apache;
3. verifica che URL come `index.html`, `galleria.html` e gli asset sotto `immagini/` vengano inoltrati sul nuovo dominio mantenendo il path.

### Variante Apache con e senza www

Se preferisci gestire il redirect a livello di VirtualHost o configurazione principale Apache, puoi usare una regola equivalente che intercetta sia `tipucci.it` sia `www.tipucci.it` e sposta solo il vecchio percorso del progetto:

```apache
RewriteEngine On

RewriteCond %{HTTP_HOST} ^(www\.)?tipucci\.it$ [NC]
RewriteRule ^progetti/profbadtrip/?$ https://profbadtrip.tipucci.it/ [R=301,L]

RewriteCond %{HTTP_HOST} ^(www\.)?tipucci\.it$ [NC]
RewriteRule ^progetti/profbadtrip/(.*)$ https://profbadtrip.tipucci.it/$1 [R=301,L]
```

Questa variante e utile quando:

1. non vuoi affidarti a `.htaccess`;
2. hai accesso al vhost Apache del dominio principale;
3. vuoi essere sicuro che il redirect valga sia per `tipucci.it` sia per `www.tipucci.it`.

## Licenza

Il codice del progetto e distribuito con licenza MIT.

La licenza MIT si applica al codice del sito. Le opere, le immagini, i video e gli eventuali contenuti editoriali presenti nel repository non sono automaticamente rilasciati sotto licenza MIT salvo esplicita indicazione e restano dei rispettivi aventi diritto.

Per dettagli, vedi il file `LICENSE` e la pagina `credits.html`.

## Possibili Sviluppi Futuri

- consolidare le sorgenti dati in un unico formato;
- migliorare ulteriormente metadati SEO e social preview;
- aggiungere una cover Open Graph dedicata;
- rifinire ulteriormente la documentazione dei diritti e delle attribuzioni dei contenuti;
- introdurre una documentazione editoriale piu ampia sulle opere.

## Autore

**Tiziano Pucci**

- Sito: [https://www.tipucci.it](https://www.tipucci.it)
- Progetto: `profbadtrip`
