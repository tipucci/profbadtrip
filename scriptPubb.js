function caricaXML(nomeFile) {
	var xmlhttp;
	try {
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET", nomeFile, false);
		xmlhttp.send();
		return xmlhttp.responseXML;
	} catch (errore) {
		return null;
	}
}

function inizializzaDaDati(dati){
	for(var i = 0; i<dati.length; i++){
		var pubblicazione = new Pubblicazione(dati[i].categoria, dati[i].periodo, dati[i].stile, dati[i].nome, dati[i].anno, dati[i].citta, dati[i].immagine || "");
		elencoPubb.collezione.push(pubblicazione);
	}
}

function Pubblicazione(categ, per, stil, nom, ann, citt, img){
	this.categoria = categ;
	this.periodo = per;
	this.stile = stil;
	this.nome = nom;
	this.anno = ann;
	this.citta = citt;
	this.immagine = img || "";
}

function Elenco(){
	this.collezione = [];

	this.inizializza = function(nodo){
		var pubblicazioni = nodo.getElementsByTagName("pubblicazione");

		for(var i = 0; i<pubblicazioni.length; i++){
			var categoria = pubblicazioni[i].getAttribute("categoria");
			var periodo = pubblicazioni[i].getAttribute("periodo");
			var stili = pubblicazioni[i].getElementsByTagName("stile");
			var stile = stili[0].firstChild.nodeValue;
			var nomi = pubblicazioni[i].getElementsByTagName("nome");
			var nome = nomi[0].firstChild.nodeValue;
			var anni = pubblicazioni[i].getElementsByTagName("anno");
			var anno = anni[0].firstChild.nodeValue;
			var citta2 = pubblicazioni[i].getElementsByTagName("citta");
			var citta = citta2[0].firstChild.nodeValue;

			var immagini = pubblicazioni[i].getElementsByTagName("immagine");
			var immagine = "";
			if (immagini.length && immagini[0].firstChild){
				immagine = immagini[0].firstChild.nodeValue;
			}

			var pubblicazione = new Pubblicazione(categoria, periodo, stile, nome, anno, citta, immagine);
			this.collezione.push(pubblicazione);
		}
	};

	this.creaSel = function(){
		var s = "";
		var posizione = document.getElementById("selCat");
		s += '<option value="tutto">Tutte le pubblicazioni</option>';
		s += '<option value="copMusica">Cover dischi e CD</option>';
		s += '<option value="discografia">Discografia</option>';
		s += '<option value="copLibro">Libri e riviste</option>';
		s += '<option value="fumetto">Fumetti</option>';
		posizione.innerHTML = s;
	};

	this.creaSel2 = function(){
		var s = "";
		var posizione = document.getElementById("selAnno");
		s += '<option value="tutto">Tutti gli anni</option>';
		s += '<option value="80">1985 - 1989</option>';
		s += '<option value="90">1990 - 1999</option>';
		s += '<option value="00">2000 - 2009</option>';
		s += '<option value="10">2010 - 2016</option>';
		posizione.innerHTML = s;
	};

	this.cerca = function(selCat, annoDa, annoA){
		var filtrati = [];
		var inizio = Math.min(annoDa, annoA);
		var fine = Math.max(annoDa, annoA);
		for (var i = 0; i<this.collezione.length; i++){
			var annoPubblicazione = parseInt(this.collezione[i].anno, 10);
			var inRange = annoPubblicazione >= inizio && annoPubblicazione <= fine;
			if (categoriaCorrisponde(this.collezione[i].categoria, selCat) && inRange){
				filtrati.push(this.collezione[i]);
			} else if (("tutto" == selCat) && inRange){
				filtrati.push(this.collezione[i]);
			}
		}
		filtrati.sort(function(a, b){
			return parseInt(b.anno, 10) - parseInt(a.anno, 10);
		});
		return filtrati;
	};
}

function categoriaCorrisponde(categoriaPubblicazione, filtroCategoria){
	if (filtroCategoria == "copMusica"){
		return categoriaPubblicazione == "copDisco" || categoriaPubblicazione == "copCd" || categoriaPubblicazione == "copMusica";
	}
	return categoriaPubblicazione == filtroCategoria;
}

function iconaCategoria(categoria){
	if (categoria == "copDisco" || categoria == "copMusica"){
		return '<span class="pubb-icon pubb-icon--disco" aria-hidden="true">&#9673;</span>';
	}
	if (categoria == "copCd"){
		return '<span class="pubb-icon pubb-icon--cd" aria-hidden="true">&#9678;</span>';
	}
	if (categoria == "discografia"){
		return '<span class="pubb-icon pubb-icon--discografia" aria-hidden="true">&#9678;</span>';
	}
	if (categoria == "copLibro"){
		return '<span class="pubb-icon pubb-icon--libro" aria-hidden="true">&#9635;</span>';
	}
	return '<span class="pubb-icon pubb-icon--fumetto" aria-hidden="true">&#10022;</span>';
}

function formattaTestoConMaiuscolaIniziale(testo){
	if (!testo || !testo.length){
		return testo;
	}
	return testo.charAt(0).toUpperCase() + testo.substring(1);
}

function formattaTitoloPubblicazione(titolo){
	var separatore = " di ";
	var indice = titolo.lastIndexOf(separatore);

	if (indice === -1){
		return '<strong class="pubb-title">' + titolo + '</strong>';
	}

	return '<span class="pubb-title"><strong>' + titolo.substring(0, indice) + '</strong><span class="pubb-title__author">' + titolo.substring(indice) + '</span></span>';
}

function aggiornaStatoPubblicazioni(){
	return;
}

function aggiornaControlliPubblicazioni(){
	var controlli = document.getElementById("pubbControlli");
	var pulsante = document.getElementById("mostraAltrePubblicazioni");
	var restanti = risultatiPubbCorrenti.length - dimensionePubbVisibile;
	if (!controlli){
		return;
	}

	if (restanti > 0){
		controlli.className = "galleria-controlli";
		if (!pulsante){
			controlli.innerHTML = '<button type="button" id="mostraAltrePubblicazioni" class="galleria-loadmore">Mostra altre pubblicazioni</button>';
			pulsante = document.getElementById("mostraAltrePubblicazioni");
			if (pulsante){
				pulsante.addEventListener("click", mostraAltrePubblicazioni, false);
			}
		}
		if (pulsante){
			pulsante.innerHTML = "Mostra altre pubblicazioni (" + restanti + ")";
		}
		return;
	}

	controlli.className = "galleria-controlli galleria-controlli--nascosti";
	controlli.innerHTML = "";
}

function markupPubblicazione(pubblicazione){
	var s = "";
	var cover = pubblicazione.immagine || "";
	s += '<li class="pubb-item">';
	if (cover){
		s += '<button type="button" class="pubb-cover-button" data-cover="' + cover + '" data-titolo="' + pubblicazione.nome + '" aria-label="Apri copertina di ' + pubblicazione.nome + '">';
		s += '<img class="pubb-cover" src="' + cover + '" alt="Copertina di ' + pubblicazione.nome + '" loading="lazy" decoding="async" />';
		s += '</button>';
	} else {
		s += iconaCategoria(pubblicazione.categoria);
	}
	s += '<div class="pubb-copy">';
	s += formattaTitoloPubblicazione(pubblicazione.nome);
	s += '<span class="pubb-meta pubb-meta--stile">' + formattaTestoConMaiuscolaIniziale(pubblicazione.stile) + ' &middot; ' + pubblicazione.citta + ' &middot; ' + pubblicazione.anno + '</span>';
	s += '</div>';
	s += '</li>';
	return s;
}

function agganciaEventiCover(){
	var cover = document.getElementsByClassName("pubb-cover-button");
	var i = 0;
	for (i = 0; i < cover.length; i++){
		cover[i].addEventListener("click", apriPubbLightboxDaCover, false);
	}
}

function renderPubblicazioni(risultati){
	var s = "";
	var posizione = document.getElementById("posizione");
	var daMostrare;
	var i;

	risultatiPubbCorrenti = risultati || [];
	dimensionePubbVisibile = Math.min(BATCH_PUBB, risultatiPubbCorrenti.length);

	if (!risultatiPubbCorrenti.length){
		posizione.innerHTML = '<li class="empty-state empty-state--list">Nessuna pubblicazione trovata. Prova a modificare i filtri.</li>';
		aggiornaStatoPubblicazioni();
		aggiornaControlliPubblicazioni();
		return;
	}

	daMostrare = risultatiPubbCorrenti.slice(0, dimensionePubbVisibile);
	for (i = 0; i < daMostrare.length; i++){
		s += markupPubblicazione(daMostrare[i]);
	}

	posizione.innerHTML = s;
	agganciaEventiCover();
	aggiornaStatoPubblicazioni();
	aggiornaControlliPubblicazioni();
}

function mostraAltrePubblicazioni(){
	var posizione = document.getElementById("posizione");
	var s = "";
	var daAggiungere;
	var i;

	if (!posizione || dimensionePubbVisibile >= risultatiPubbCorrenti.length){
		return;
	}

	daAggiungere = risultatiPubbCorrenti.slice(dimensionePubbVisibile, dimensionePubbVisibile + BATCH_PUBB);
	for (i = 0; i < daAggiungere.length; i++){
		s += markupPubblicazione(daAggiungere[i]);
	}

	posizione.insertAdjacentHTML("beforeend", s);
	dimensionePubbVisibile = Math.min(dimensionePubbVisibile + BATCH_PUBB, risultatiPubbCorrenti.length);
	agganciaEventiCover();
	aggiornaStatoPubblicazioni();
	aggiornaControlliPubblicazioni();
}

function apriPubbLightbox(cover, titolo){
	var lightbox = document.getElementById("pubbLightbox");
	var immagine = document.getElementById("pubbLightboxImage");
	var chiudi = document.getElementById("chiudiPubbLightbox");
	var pannello = document.getElementsByClassName("pubb-lightbox__panel");
	if (!lightbox || !immagine){
		return;
	}

	ultimoTriggerPubbLightbox = document.activeElement;
	immagine.src = cover;
	immagine.alt = "Copertina di " + titolo;
	lightbox.className = "pubb-lightbox pubb-lightbox--aperto";
	lightbox.setAttribute("aria-hidden", "false");
	if (document.body.className.indexOf("lightbox-open") === -1){
		document.body.className += (document.body.className ? " " : "") + " lightbox-open";
	}
	if (chiudi){
		chiudi.focus();
	} else if (pannello.length){
		pannello[0].focus();
	}
}

function chiudiPubbLightbox(){
	var lightbox = document.getElementById("pubbLightbox");
	var immagine = document.getElementById("pubbLightboxImage");
	if (!lightbox){
		return;
	}

	lightbox.className = "pubb-lightbox";
	lightbox.setAttribute("aria-hidden", "true");
	if (immagine){
		immagine.src = "";
	}
	document.body.className = document.body.className.replace(" lightbox-open", "").replace("lightbox-open", "");
	if (ultimoTriggerPubbLightbox && ultimoTriggerPubbLightbox.focus){
		ultimoTriggerPubbLightbox.focus();
	}
}

function apriPubbLightboxDaCover(){
	apriPubbLightbox(this.getAttribute("data-cover"), this.getAttribute("data-titolo"));
}

function gestisciTastieraLightboxPubblicazioni(evento){
	var lightbox = document.getElementById("pubbLightbox");
	var eventoTastiera = evento || window.event;
	var pannello = document.getElementsByClassName("pubb-lightbox__panel");
	var focusabili;
	var primo;
	var ultimo;
	if (!lightbox || lightbox.className.indexOf("pubb-lightbox--aperto") === -1){
		return;
	}

	if (eventoTastiera.keyCode === 27){
		chiudiPubbLightbox();
	} else if (eventoTastiera.keyCode === 9 && pannello.length){
		focusabili = pannello[0].querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		if (!focusabili.length){
			eventoTastiera.preventDefault();
			pannello[0].focus();
			return;
		}
		primo = focusabili[0];
		ultimo = focusabili[focusabili.length - 1];
		if (eventoTastiera.shiftKey && document.activeElement === primo){
			eventoTastiera.preventDefault();
			ultimo.focus();
		} else if (!eventoTastiera.shiftKey && document.activeElement === ultimo){
			eventoTastiera.preventDefault();
			primo.focus();
		}
	}
}

function sincronizzaCardCategoriaPubblicazioni(){
	var selezione = document.getElementById("selCat");
	var card = document.getElementsByClassName("pubb-filter-card");
	var i = 0;
	if (!selezione){
		return;
	}

	for (i = 0; i < card.length; i++){
		if (card[i].getAttribute("data-categoria") == selezione.value){
			card[i].className = "pubb-filter-card pubb-filter-card--attiva";
			card[i].setAttribute("aria-pressed", "true");
		} else {
			card[i].className = "pubb-filter-card";
			card[i].setAttribute("aria-pressed", "false");
		}
	}
}

function selezionaCardCategoriaPubblicazioni(){
	var selezione = document.getElementById("selCat");
	var valore = this.getAttribute("data-categoria");
	if (!selezione){
		return;
	}

	selezione.value = valore;
	sincronizzaCardCategoriaPubblicazioni();
	mostraPubb();
}

function mostraPubb(){
	var selCat = document.getElementById("selCat").value;
	var annoDa = parseInt(document.getElementById("annoDa").value, 10);
	var annoA = parseInt(document.getElementById("annoA").value, 10);
	var risultati = elencoPubb.cerca(selCat, annoDa, annoA);
	renderPubblicazioni(risultati);
}

function aggiornaEtichetteAnni(){
	var annoDa = parseInt(document.getElementById("annoDa").value, 10);
	var annoA = parseInt(document.getElementById("annoA").value, 10);
	var inizio = Math.min(annoDa, annoA);
	var fine = Math.max(annoDa, annoA);
	document.getElementById("annoDaLabel").innerHTML = "Da " + inizio;
	document.getElementById("annoALabel").innerHTML = "A " + fine;
	aggiornaRangePubblicazioni(inizio, fine);
}

function aggiornaRangePubblicazioni(inizio, fine){
	var filtro = document.getElementById("pubbRangeFilter");
	var minimo = 1985;
	var massimo = 2016;
	var totale = massimo - minimo;
	if (!filtro){
		return;
	}

	filtro.style.setProperty("--range-start", (((inizio - minimo) / totale) * 100) + "%");
	filtro.style.setProperty("--range-end", (((fine - minimo) / totale) * 100) + "%");
}

function mostraTutto(){
	document.getElementById("selCat").value = "tutto";
	document.getElementById("annoDa").value = "1985";
	document.getElementById("annoA").value = "2016";
	aggiornaEtichetteAnni();
	renderPubblicazioni(elencoPubb.cerca("tutto", 1985, 2016));
}

var elencoPubb = new Elenco();
var risultatiPubbCorrenti = [];
var dimensionePubbVisibile = 0;
var BATCH_PUBB = 14;
var ultimoTriggerPubbLightbox = null;

function inizializza(){
	var c = document.getElementById("cerca");
	var card = document.getElementsByClassName("pubb-filter-card");
	var chiudi = document.getElementById("chiudiPubbLightbox");
	var backdrop = document.getElementById("pubbLightboxBackdrop");
	var i = 0;

	c.addEventListener("click", mostraPubb, false);

	elencoPubb.creaSel();
	elencoPubb.creaSel2();

	var nodo = caricaXML("elencopubb.xml");
	if (nodo && nodo.getElementsByTagName("pubblicazione").length){
		elencoPubb.inizializza(nodo);
	} else if (typeof PROFBADTRIP_PUBBLICAZIONI !== "undefined" && PROFBADTRIP_PUBBLICAZIONI.length){
		inizializzaDaDati(PROFBADTRIP_PUBBLICAZIONI);
	}

	document.getElementById("selCat").value = "tutto";
	document.getElementById("annoDa").addEventListener("input", function (){
		aggiornaEtichetteAnni();
		mostraPubb();
	}, false);
	document.getElementById("annoA").addEventListener("input", function (){
		aggiornaEtichetteAnni();
		mostraPubb();
	}, false);
	document.getElementById("selCat").addEventListener("change", function (){
		sincronizzaCardCategoriaPubblicazioni();
		mostraPubb();
	}, false);
	if (chiudi){
		chiudi.addEventListener("click", chiudiPubbLightbox, false);
	}
	if (backdrop){
		backdrop.addEventListener("click", chiudiPubbLightbox, false);
	}
	document.addEventListener("keydown", gestisciTastieraLightboxPubblicazioni, false);
	for (i = 0; i < card.length; i++){
		card[i].addEventListener("click", selezionaCardCategoriaPubblicazioni, false);
	}
	aggiornaEtichetteAnni();
	sincronizzaCardCategoriaPubblicazioni();
	mostraTutto();
}

document.addEventListener("DOMContentLoaded", inizializza, false);
