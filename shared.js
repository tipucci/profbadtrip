(function () {
	function initNav() {
		var toggle = document.getElementById("navToggle");
		var nav = document.getElementById("nav");
		if (!toggle || !nav) {
			return;
		}

		document.body.className += (document.body.className ? " " : "") + "js-nav";

		function closeNav(restoreFocus) {
			nav.className = nav.className.replace(" nav-open", "").replace("nav-open", "");
			toggle.setAttribute("aria-expanded", "false");
			if (restoreFocus) {
				toggle.focus();
			}
		}

		function toggleNav() {
			var isOpen = nav.className.indexOf("nav-open") !== -1;
			if (isOpen) {
				closeNav(false);
				return;
			}
			nav.className += (nav.className ? " " : "") + "nav-open";
			toggle.setAttribute("aria-expanded", "true");
		}

		toggle.addEventListener("click", toggleNav, false);
		document.addEventListener("keydown", function (event) {
			var key = event.key || "";
			var keyCode = event.keyCode;
			if ((key === "Escape" || keyCode === 27) && nav.className.indexOf("nav-open") !== -1) {
				closeNav(true);
			}
		}, false);
	}

	function initKeyboardMode() {
		document.addEventListener("keydown", function () {
			if (document.body.className.indexOf("using-keyboard") === -1) {
				document.body.className += (document.body.className ? " " : "") + "using-keyboard";
			}
		}, false);

		document.addEventListener("mousedown", function () {
			document.body.className = document.body.className.replace(" using-keyboard", "").replace("using-keyboard", "");
		}, false);
	}

	function initBackToTop() {
		var tornaSu = document.getElementById("tornaSu");
		var ultimaPosizione = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		if (!tornaSu) {
			return;
		}

		function aggiornaTornaSu() {
			var footer = document.getElementById("infobox");
			var posizioneCorrente = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			var mostra = posizioneCorrente > 420 && posizioneCorrente < ultimaPosizione;
			var copreFooter = false;
			if (footer && footer.getBoundingClientRect) {
				copreFooter = footer.getBoundingClientRect().top < (window.innerHeight - 72);
			}
			if (mostra && !copreFooter) {
				tornaSu.className = "torna-su torna-su--visibile";
			} else {
				tornaSu.className = "torna-su";
			}
			ultimaPosizione = posizioneCorrente;
		}

		tornaSu.addEventListener("click", function () {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, false);
		window.addEventListener("scroll", aggiornaTornaSu, false);
		aggiornaTornaSu();
	}

	document.addEventListener("DOMContentLoaded", function () {
		initNav();
		initKeyboardMode();
		initBackToTop();
	}, false);
})();
