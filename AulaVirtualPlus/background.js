// background.js — service worker de Aula Virtual Plus
// Por ahora solo registra la instalación. Aquí irán las notificaciones, etc.

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    console.log("Aula Virtual Plus instalada correctamente.");
  }
});
