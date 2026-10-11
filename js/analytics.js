/* ==========================================================================
   Feature Growth · Medición (Google Tag Manager)
   - Inicializa el Data Layer y carga el contenedor GTM.
   - Expone window.fgTrack(evento, params) para disparar eventos personalizados.
   - La etiqueta GA4 se configura DENTRO de GTM (Measurement ID G-…).
   ========================================================================== */

(function () {
  "use strict";

  var GTM_ID = "GTM-T5N7DK76";

  /* Data Layer + carga del contenedor GTM */
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js"
  });

  var firstScript = document.getElementsByTagName("script")[0];
  var gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(gtmScript, firstScript);
  } else {
    document.head.appendChild(gtmScript);
  }

  /* Helper de eventos personalizados: fgTrack('nombre_evento', { ... }) */
  window.fgTrack = function (eventName, params) {
    var payload = { event: eventName };
    if (params) {
      for (var key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          payload[key] = params[key];
        }
      }
    }
    window.dataLayer.push(payload);
  };
})();
