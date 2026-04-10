function Opera(color, categ, sorg, sorg2, tit, dim, ann, tec){
	this.colore = color;
	this.categoria = categ;
	this.sorgente = sorg;
	this.sorgente2 = sorg2;
	this.titolo = tit || "";
	this.dimensione = dim || "";
	this.anno = ann || "";
	this.tecnica = tec || "";
}

function Galleria(){
	this.collezione = [];

	this.inizializza = function(nodo){
		var opere = nodo.getElementsByTagName("opera");

		for(var i = 0; i<opere.length; i++){
			var colore = opere[i].getAttribute("colore");
			var categoria = opere[i].getAttribute("categoria");
			var sorgenti = opere[i].getElementsByTagName("sorgente");
			var sorgente = sorgenti[0].firstChild.nodeValue;
			var sorgenti2 = opere[i].getElementsByTagName("sorgente2");
			var sorgente2 = sorgenti2[0].firstChild.nodeValue;
			var titoloNodo = opere[i].getElementsByTagName("titolo");
			var dimensioneNodo = opere[i].getElementsByTagName("dimensione");
			var annoNodo = opere[i].getElementsByTagName("anno");
			var tecnicaNodo = opere[i].getElementsByTagName("tecnica");
			var titolo = titoloNodo.length && titoloNodo[0].firstChild ? titoloNodo[0].firstChild.nodeValue : "";
			var dimensione = dimensioneNodo.length && dimensioneNodo[0].firstChild ? dimensioneNodo[0].firstChild.nodeValue : "";
			var anno = annoNodo.length && annoNodo[0].firstChild ? annoNodo[0].firstChild.nodeValue : "";
			var tecnica = tecnicaNodo.length && tecnicaNodo[0].firstChild ? tecnicaNodo[0].firstChild.nodeValue : "";

			var opera = new Opera(colore, categoria, sorgente, sorgente2, titolo, dimensione, anno, tecnica);
			this.collezione.push(opera);
		}
	};

	this.cerca = function(sceltaCateg, sceltaColor){
		var filtrati = [];
		for (var i = 0; i<this.collezione.length; i++){
			if ((this.collezione[i].categoria == sceltaCateg) && (this.collezione[i].colore == sceltaColor)){
				filtrati.push(this.collezione[i]);
			} else if (("tutto" == sceltaCateg) && ("tutto2" == sceltaColor)){
				filtrati.push(this.collezione[i]);
			} else if (("tutto" == sceltaCateg) && (this.collezione[i].colore == sceltaColor)){
				filtrati.push(this.collezione[i]);
			} else if ((this.collezione[i].categoria == sceltaCateg) && ("tutto2" == sceltaColor)){
				filtrati.push(this.collezione[i]);
			}
		}
		return filtrati;
	};
}

function inizializzaDaDati(dati){
	for(var i = 0; i<dati.length; i++){
		var opera = new Opera(dati[i].colore, dati[i].categoria, dati[i].sorgente, dati[i].sorgente2, dati[i].titolo || "", dati[i].dimensione || "", dati[i].anno || "", dati[i].tecnica || "");
		elencoOpere.collezione.push(opera);
	}
}

function mescolaOpere(collezione){
	for (var i = collezione.length - 1; i > 0; i--){
		var indiceCasuale = Math.floor(Math.random() * (i + 1));
		var temporanea = collezione[i];
		collezione[i] = collezione[indiceCasuale];
		collezione[indiceCasuale] = temporanea;
	}
}

function classeCategoriaOpera(categoria){
	if (categoria == "quadro"){
		return "miniatura-opera--quadro";
	}
	if (categoria == "xilografia"){
		return "miniatura-opera--xilografia";
	}
	if (categoria == "serigrafia"){
		return "miniatura-opera--serigrafia";
	}
	return "miniatura-opera--illustrazione";
}

function etichettaCategoriaOpera(categoria){
	if (categoria == "quadro"){
		return "Quadro";
	}
	if (categoria == "xilografia"){
		return "Xilografia";
	}
	if (categoria == "serigrafia"){
		return "Serigrafia";
	}
	return "Illustrazione";
}

function etichettaIndiceOpera(indice){
	if (indice < 9){
		return "0" + (indice + 1);
	}
	return "" + (indice + 1);
}

function rapportoOpera(dimensione){
	var match;
	if (!dimensione){
		return "";
	}

	match = dimensione.match(/(\d+(?:[.,]\d+)?)\s*(?:cm)?\s*[xX]\s*(\d+(?:[.,]\d+)?)/);
	if (!match){
		return "";
	}

	return match[1].replace(",", ".") + " / " + match[2].replace(",", ".");
}

function rapportoNumerico(ratio){
	if (!ratio){
		return 0;
	}

	if (typeof ratio == "number"){
		return ratio;
	}

	if (ratio.indexOf("/") !== -1){
		var parti = ratio.split("/");
		var larghezza = parseFloat(parti[0]);
		var altezza = parseFloat(parti[1]);
		if (!isNaN(larghezza) && !isNaN(altezza) && altezza > 0){
			return larghezza / altezza;
		}
	}

	ratio = parseFloat(ratio);
	if (isNaN(ratio)){
		return 0;
	}
	return ratio;
}

function spanOpera(ratio){
	var valore = rapportoNumerico(ratio);
	if (!valore){
		return 3;
	}
	if (valore >= 1.45){
		return 5;
	}
	if (valore >= 1.1){
		return 4;
	}
	if (valore >= 0.78){
		return 3;
	}
	if (valore >= 0.5){
		return 2;
	}
	return 2;
}

function sorgenteAnteprimaOpera(opera){
	if (!opera || !opera.sorgente){
		return "";
	}

	return opera.sorgente;
}

function haAnteprimaOpera(opera){
	return !!sorgenteAnteprimaOpera(opera);
}

function haTitoloOpera(opera){
	return !!(opera && opera.titolo && opera.titolo.replace(/\s+/g, "").length);
}

function sorgenteFallbackLocale(sorgente){
	return "";
}

function metaOpera(opera){
	var dettagli = [];
	if (!opera){
		return "";
	}
	if (opera.dimensione){
		dettagli.push(opera.dimensione);
	}
	if (opera.tecnica){
		dettagli.push(opera.tecnica);
	}
	if (opera.anno){
		dettagli.push(opera.anno);
	}
	return dettagli.join(" &middot; ");
}

function punteggioPrioritaOpera(opera){
	var anteprima = sorgenteAnteprimaOpera(opera);
	if (anteprima && !/^https?:\/\//.test(anteprima)){
		return 0;
	}
	if (anteprima){
		return 1;
	}
	return 2;
}

function aggiornaRiepilogoGalleria(){
	return;
}

function aggiornaControlliGalleria(){
	var controlli = document.getElementById("galleriaControlli");
	var pulsante = document.getElementById("mostraAltreOpere");
	var restanti = risultatiCorrenti.length - opereCaricate;
	if (!controlli){
		return;
	}

	if (restanti > 0){
		controlli.className = "galleria-controlli";
		if (!pulsante){
			controlli.innerHTML = '<button type="button" id="mostraAltreOpere" class="galleria-loadmore">Mostra altre opere</button>';
			pulsante = document.getElementById("mostraAltreOpere");
			if (pulsante){
				pulsante.addEventListener("click", mostraAltreOpere, false);
			}
		}
		if (pulsante){
			pulsante.innerHTML = "Mostra altre opere (" + restanti + ")";
		}
		return;
	}

	controlli.className = "galleria-controlli galleria-controlli--nascosti";
	controlli.innerHTML = "";
}

function markupOpera(opera, indice){
	var titolo = opera.titolo || "Opera del Professor Bad Trip";
	var dettaglio = metaOpera(opera);
	var ratio = rapportoOpera(opera.dimensione);
	var style = ratio ? ' style="--opera-ratio:' + ratio + ';--opera-span:' + spanOpera(ratio) + ';"' : "";
	var anteprima = sorgenteAnteprimaOpera(opera);
	var s = "";

	s += '<button type="button" class="miniatura-opera ' + classeCategoriaOpera(opera.categoria) + '" data-indice="' + indice + '"' + style + '>';
	if (anteprima){
		s += '<span class="miniatura-opera__media miniatura-opera__media--loading">';
		s += '<img class="miniatura-opera__img miniatura-opera__img--loading" src="' + anteprima + '" loading="lazy" decoding="async" alt="' + titolo + '" data-fallback-src="" />';
		s += '</span>';
	}
	s += '<span class="miniatura-opera__overlay">';
	s += '<span class="miniatura-opera__indice">' + etichettaIndiceOpera(indice) + '</span>';
	s += '<span class="miniatura-opera__meta">';
	s += '<span class="miniatura-opera__stile">' + titolo + '</span>';
	if (dettaglio){
		s += '<span class="miniatura-opera__dettaglio">' + dettaglio + '</span>';
	}
	s += '</span>';
	s += '</span>';
	s += '</button>';

	return s;
}

function collegaMiniature(immagini){
	var miniature;
	var immaginiCard;
	var i;
	if (!immagini){
		return;
	}

	miniature = immagini.getElementsByTagName("button");
	for (i = 0; i < miniature.length; i++){
		miniature[i].addEventListener("click", apriLightboxDaMiniatura, false);
	}

	immaginiCard = immagini.getElementsByTagName("img");
	for (i = 0; i < immaginiCard.length; i++){
		immaginiCard[i].onload = aggiornaRapportoMiniatura;
		immaginiCard[i].onerror = gestisciErroreMiniatura;
		if (immaginiCard[i].complete){
			if (immaginiCard[i].naturalWidth && immaginiCard[i].naturalHeight){
				aggiornaRapportoMiniatura.call(immaginiCard[i]);
			} else {
				gestisciErroreMiniatura.call(immaginiCard[i]);
			}
		}
	}
}

function renderRisultati(risultati){
	var immagini = document.getElementById("immagini");
	var s = "";
	var opereDaMostrare;
	var i;

	risultatiCorrenti = (risultati || []).filter(function (opera) {
		return haAnteprimaOpera(opera) && haTitoloOpera(opera);
	});
	opereCaricate = Math.min(BATCH_OPERE, risultatiCorrenti.length);

	if (!risultatiCorrenti.length){
		immagini.className = "immagini-vuote";
		immagini.innerHTML = '<p class="empty-state">Nessuna opera trovata. Prova a modificare i filtri.</p>';
		aggiornaRiepilogoGalleria();
		aggiornaControlliGalleria();
		return;
	}

	immagini.className = "";
	opereDaMostrare = risultatiCorrenti.slice(0, opereCaricate);

	for (i = 0; i < opereDaMostrare.length; i++){
		s += markupOpera(opereDaMostrare[i], i);
	}

	immagini.innerHTML = s;
	collegaMiniature(immagini);
	aggiornaRiepilogoGalleria();
	aggiornaControlliGalleria();
}

function aggiornaRapportoMiniatura(){
	var media = this.parentNode;
	var card = media ? media.parentNode : null;
	if (!media || !this.naturalWidth || !this.naturalHeight){
		return;
	}

	media.style.aspectRatio = this.naturalWidth + " / " + this.naturalHeight;
	media.className = media.className.replace(" miniatura-opera__media--loading", "").replace("miniatura-opera__media--loading", "");
	this.className = this.className.replace(" miniatura-opera__img--loading", "").replace("miniatura-opera__img--loading", "");
	if (card){
		card.style.setProperty("--opera-span", spanOpera(this.naturalWidth / this.naturalHeight));
	}
}

function aggiornaIndiceMiniature(){
	var immagini = document.getElementById("immagini");
	var miniature;
	var i = 0;
	if (!immagini){
		return;
	}

	miniature = immagini.getElementsByTagName("button");
	for (i = 0; i < miniature.length; i++){
		var indice = miniature[i].getElementsByClassName("miniatura-opera__indice");
		if (indice.length){
			indice[0].innerHTML = etichettaIndiceOpera(i);
		}
		miniature[i].setAttribute("data-indice", i);
	}

	aggiornaRiepilogoGalleria();
	aggiornaControlliGalleria();
}

function gestisciErroreMiniatura(){
	var fallback = this.getAttribute("data-fallback-src");
	var card;
	var indice;
	if (fallback && this.src.indexOf(fallback) === -1){
		this.setAttribute("data-fallback-src", "");
		this.src = fallback;
		return;
	}

	card = this.parentNode ? this.parentNode.parentNode : null;
	if (!card || !card.parentNode){
		return;
	}

	indice = parseInt(card.getAttribute("data-indice"), 10);
	if (!isNaN(indice)){
		risultatiCorrenti.splice(indice, 1);
		if (opereCaricate > 0){
			opereCaricate -= 1;
		}
	}

	card.parentNode.removeChild(card);
	aggiornaIndiceMiniature();
}

function renderPlaceholderGalleria(){
	var immagini = document.getElementById("immagini");
	var s = "";
	var i = 0;
	if (!immagini){
		return;
	}

	for (i = 0; i < 6; i++){
		s += '<span class="miniatura-opera miniatura-opera--placeholder" aria-hidden="true">';
		s += '<span class="miniatura-opera__media"></span>';
		s += '<span class="miniatura-opera__overlay">';
		s += '<span class="miniatura-opera__indice">&nbsp;</span>';
		s += '<span class="miniatura-opera__meta">';
		s += '<span class="miniatura-opera__stile">&nbsp;</span>';
		s += '</span>';
		s += '</span>';
		s += '</span>';
	}

	immagini.innerHTML = s;
}

function mostraAltreOpere(){
	var immagini = document.getElementById("immagini");
	var s = "";
	var opereDaAggiungere;
	var indiceBase;
	var i;

	if (!immagini || opereCaricate >= risultatiCorrenti.length){
		return;
	}

	indiceBase = immagini.getElementsByTagName("button").length;
	opereDaAggiungere = risultatiCorrenti.slice(opereCaricate, opereCaricate + BATCH_OPERE);
	for (i = 0; i < opereDaAggiungere.length; i++){
		s += markupOpera(opereDaAggiungere[i], indiceBase + i);
	}

	immagini.insertAdjacentHTML("beforeend", s);
	opereCaricate = Math.min(opereCaricate + BATCH_OPERE, risultatiCorrenti.length);
	collegaMiniature(immagini);
	aggiornaRiepilogoGalleria();
	aggiornaControlliGalleria();
}

function mostraOpere(){
	var sceltaCateg = document.getElementById("sceltaCateg").value;
	var sceltaColor = document.getElementById("sceltaColor").value;
	var risultati = elencoOpere.cerca(sceltaCateg, sceltaColor);
	renderRisultati(risultati);
}

function mostraTutto(){
	document.getElementById("sceltaCateg").value = "tutto";
	document.getElementById("sceltaColor").value = "tutto2";
	sincronizzaCardCategoria();
	sincronizzaCardStile();
	renderRisultati(elencoOpere.cerca("tutto", "tutto2"));
}

function sincronizzaCardCategoria(){
	var selezione = document.getElementById("sceltaCateg");
	var card = document.getElementsByClassName("categoria-card");
	var i = 0;
	if (!selezione){
		return;
	}

	for (i = 0; i < card.length; i++){
		if (card[i].getAttribute("data-categoria") == selezione.value){
			card[i].className = "categoria-card categoria-card--attiva";
			card[i].setAttribute("aria-pressed", "true");
		} else {
			card[i].className = "categoria-card";
			card[i].setAttribute("aria-pressed", "false");
		}
	}
}

function sincronizzaCardStile(){
	var selezione = document.getElementById("sceltaColor");
	var card = document.getElementsByClassName("stile-card");
	var i = 0;
	if (!selezione){
		return;
	}

	for (i = 0; i < card.length; i++){
		if (card[i].getAttribute("data-stile") == selezione.value){
			card[i].className = "stile-card stile-card--attiva";
			card[i].setAttribute("aria-pressed", "true");
		} else {
			card[i].className = "stile-card";
			card[i].setAttribute("aria-pressed", "false");
		}
	}
}

function selezionaCardStile(){
	var selezione = document.getElementById("sceltaColor");
	var valore = this.getAttribute("data-stile");
	if (!selezione){
		return;
	}

	if (valore == "tutto2"){
		selezione.value = "tutto2";
	} else if (selezione.value == valore){
		selezione.value = "tutto2";
	} else {
		selezione.value = valore;
	}

	sincronizzaCardStile();
	mostraOpere();
}

function selezionaCardCategoria(){
	var selezione = document.getElementById("sceltaCateg");
	var valore = this.getAttribute("data-categoria");
	if (!selezione){
		return;
	}

	if (valore == "tutto"){
		selezione.value = "tutto";
	} else if (selezione.value == valore){
		selezione.value = "tutto";
	} else {
		selezione.value = valore;
	}

	sincronizzaCardCategoria();
	mostraOpere();
}

function aggiornaLightbox(){
	var immagine = document.getElementById("lightboxImage");
	var titolo = document.getElementById("lightboxTitle");
	var meta = document.getElementById("lightboxMeta");
	var meno = document.getElementById("zoomOut");
	var piu = document.getElementById("zoomIn");
	var sorgente = "";
	if (!risultatiCorrenti.length || !immagine){
		return;
	}

	sorgente = risultatiCorrenti[indiceCorrente].sorgente2 || risultatiCorrenti[indiceCorrente].sorgente || "";
	immagine.src = sorgente;
	immagine.alt = risultatiCorrenti[indiceCorrente].titolo || "Opera del Professor Bad Trip";
	immagine.setAttribute("data-fallback-src", "");
	immagine.style.transform = "scale(" + zoomCorrente + ")";
	if (titolo){
		titolo.innerHTML = risultatiCorrenti[indiceCorrente].titolo || "Opera del Professor Bad Trip";
	}
	if (meta){
		meta.innerHTML = metaOpera(risultatiCorrenti[indiceCorrente]);
	}
	if (meno){
		meno.disabled = (zoomCorrente <= 1);
	}
	if (piu){
		piu.disabled = (zoomCorrente >= 3);
	}
}

function apriLightbox(indice){
	var lightbox = document.getElementById("lightbox");
	var chiudi = document.getElementById("chiudiLightbox");
	var pannello = document.getElementsByClassName("lightbox__panel");
	if (!lightbox || !risultatiCorrenti.length){
		return;
	}

	ultimoTriggerLightbox = document.activeElement;
	indiceCorrente = indice;
	zoomCorrente = 1;
	aggiornaLightbox();
	lightbox.className = "lightbox lightbox--aperto";
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

function chiudiLightbox(){
	var lightbox = document.getElementById("lightbox");
	if (!lightbox){
		return;
	}

	lightbox.className = "lightbox";
	lightbox.setAttribute("aria-hidden", "true");
	document.body.className = document.body.className.replace(" lightbox-open", "").replace("lightbox-open", "");
	if (ultimoTriggerLightbox && ultimoTriggerLightbox.focus){
		ultimoTriggerLightbox.focus();
	}
}

function apriLightboxDaMiniatura(){
	var indice = parseInt(this.getAttribute("data-indice"), 10);
	apriLightbox(indice);
}

function gestisciClickLightbox(evento){
	var eventoMouse = evento || window.event;
	var destinazione = eventoMouse.target || eventoMouse.srcElement;
	var dettagli = document.getElementsByClassName("lightbox__details");
	var immagine = document.getElementById("lightboxImage");
	var toolbar = document.getElementById("chiudiLightbox");

	if (!destinazione){
		chiudiLightbox();
		return;
	}

	if (dettagli.length && (destinazione === dettagli[0] || dettagli[0].contains(destinazione))){
		return;
	}
	if (immagine && (destinazione === immagine || immagine.contains(destinazione))){
		return;
	}
	if (toolbar && toolbar.parentNode && (destinazione === toolbar.parentNode || toolbar.parentNode.contains(destinazione))){
		return;
	}

	chiudiLightbox();
}

function gestisciErroreLightbox(){
	var fallback = this.getAttribute("data-fallback-src");
	if (fallback && this.src.indexOf(fallback) === -1){
		this.setAttribute("data-fallback-src", "");
		this.src = fallback;
	}
}

function mostraPrecedente(){
	if (!risultatiCorrenti.length){
		return;
	}

	indiceCorrente = (indiceCorrente === 0) ? risultatiCorrenti.length - 1 : indiceCorrente - 1;
	zoomCorrente = 1;
	aggiornaLightbox();
}

function mostraSuccessiva(){
	if (!risultatiCorrenti.length){
		return;
	}

	indiceCorrente = (indiceCorrente === risultatiCorrenti.length - 1) ? 0 : indiceCorrente + 1;
	zoomCorrente = 1;
	aggiornaLightbox();
}

function zoomIn(){
	zoomCorrente = Math.min(zoomCorrente + 0.25, 3);
	aggiornaLightbox();
}

function zoomOut(){
	zoomCorrente = Math.max(zoomCorrente - 0.25, 1);
	aggiornaLightbox();
}

function gestisciTastiera(evento){
	var lightbox = document.getElementById("lightbox");
	var eventoTastiera = evento || window.event;
	var focusabili;
	var primo;
	var ultimo;
	var pannello = document.getElementsByClassName("lightbox__panel");
	if (!lightbox || lightbox.className.indexOf("lightbox--aperto") === -1){
		return;
	}

	if (eventoTastiera.keyCode === 27){
		chiudiLightbox();
	} else if (eventoTastiera.keyCode === 37){
		mostraPrecedente();
	} else if (eventoTastiera.keyCode === 39){
		mostraSuccessiva();
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

var elencoOpere = new Galleria();
var risultatiCorrenti = [];
var indiceCorrente = 0;
var zoomCorrente = 1;
var opereCaricate = 0;
var BATCH_OPERE = 12;
var ultimoTriggerLightbox = null;

function inizializza(){
	var c = document.getElementById("cerca");
	var precedente = document.getElementById("operaPrecedente");
	var successiva = document.getElementById("operaSuccessiva");
	var chiudi = document.getElementById("chiudiLightbox");
	var meno = document.getElementById("zoomOut");
	var piu = document.getElementById("zoomIn");
	var backdrop = document.getElementById("lightboxBackdrop");
	var panel = document.getElementsByClassName("lightbox__panel");
	var stileCard = document.getElementsByClassName("stile-card");
	var categoriaCard = document.getElementsByClassName("categoria-card");
	var immagineLightbox = document.getElementById("lightboxImage");
	var i = 0;

	c.addEventListener("click", mostraOpere, false);
	precedente.addEventListener("click", mostraPrecedente, false);
	successiva.addEventListener("click", mostraSuccessiva, false);
	chiudi.addEventListener("click", chiudiLightbox, false);
	meno.addEventListener("click", zoomOut, false);
	piu.addEventListener("click", zoomIn, false);
	backdrop.addEventListener("click", chiudiLightbox, false);
	if (panel.length){
		panel[0].addEventListener("click", gestisciClickLightbox, false);
	}
	if (immagineLightbox){
		immagineLightbox.onerror = gestisciErroreLightbox;
	}
	renderPlaceholderGalleria();
	for (i = 0; i < stileCard.length; i++){
		stileCard[i].addEventListener("click", selezionaCardStile, false);
	}
	for (i = 0; i < categoriaCard.length; i++){
		categoriaCard[i].addEventListener("click", selezionaCardCategoria, false);
	}

	if (typeof PROFBADTRIP_GALLERIA !== "undefined" && PROFBADTRIP_GALLERIA.length){
		inizializzaDaDati(PROFBADTRIP_GALLERIA);
	}

	mescolaOpere(elencoOpere.collezione);
	elencoOpere.collezione.sort(function (operaA, operaB) {
		return punteggioPrioritaOpera(operaA) - punteggioPrioritaOpera(operaB);
	});

	document.getElementById("sceltaCateg").value = "tutto";
	document.getElementById("sceltaColor").value = "tutto2";
	document.getElementById("sceltaCateg").addEventListener("change", function (){
		sincronizzaCardCategoria();
		mostraOpere();
	}, false);
	document.getElementById("sceltaColor").addEventListener("change", function (){
		sincronizzaCardStile();
		mostraOpere();
	}, false);
	sincronizzaCardCategoria();
	sincronizzaCardStile();
	mostraTutto();
	document.addEventListener("keydown", gestisciTastiera, false);
}

document.addEventListener("DOMContentLoaded", inizializza, false);
