/* ==========================================================================
   Feature Growth · Helper de eventos (Google Tag Manager)
   - El contenedor GTM se carga con el snippet oficial inline en el <head>.
   - Este archivo solo expone window.fgTrack(evento, params) para disparar
     eventos personalizados hacia el Data Layer (que consume GTM).
   ========================================================================== */

(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];

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
