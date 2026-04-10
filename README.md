# profbadtrip

Sito statico dedicato a Gianluca Lerici, alias Professor Bad Trip.

## Struttura attuale

La struttura del repository resta volutamente semplice per mantenere compatibilita con GitHub Pages:

- `index.html` e le altre pagine HTML stanno nella root.
- `stile.css`, `mobile.css` e `stampa.css` gestiscono la presentazione.
- `scriptGalleria.js`, `scriptPubb.js`, `data-galleria.js` e `data-pubblicazioni.js` gestiscono contenuti e interazioni.
- `immagini/` contiene gli asset grafici del sito.
- `404.html` gestisce le pagine non trovate su GitHub Pages.
- `CNAME` imposta il dominio personalizzato `profbadtrip.tipucci.it`.

## Stato deploy

I riferimenti interni nei file HTML sono relativi, quindi il sito puo funzionare sia su GitHub Pages sia sul dominio personalizzato senza path hardcoded alla vecchia sottocartella.

Sono stati aggiornati:

- canonical URL
- `robots.txt`
- `sitemap.xml`
- `CNAME`

## Pubblicazione su GitHub Pages

1. Pubblica il branch `main` su GitHub.
2. In GitHub apri `Settings > Pages`.
3. Imposta `Deploy from a branch`.
4. Seleziona il branch `main` e la cartella `/ (root)`.
5. Verifica che il file `CNAME` venga servito correttamente.
6. Configura il DNS di `profbadtrip.tipucci.it` verso GitHub Pages.

## Nota

Se vuoi, nel passo successivo posso anche fare il commit, il push su GitHub e lasciarti il repository gia pronto per attivare Pages.
