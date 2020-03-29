let newWorker;

if ("serviceWorker" in navigator) {
navigator.serviceWorker
    .register("./chopeiraSW.js") // [A]
    .then(function(registration) {
    registration.addEventListener("updatefound", () => { // [B]
        // Uma atualização no Service Worker foi encontrada, instalando...
        console.log("1 - Uma atualização no Service Worker foi encontrada, instalando...");
        newWorker = registration.installing; // [C]

        newWorker.addEventListener("statechange", () => {
            // O estado do Service Worker mudou?
            console.log("2 - O estado do Service Worker mudou?");
            switch (newWorker.state) {
                case "installed": {
                    // Existe um novo Service Worker disponível, mostra a notificação
                    console.log("3 - Existe um novo Service Worker disponível, mostra a notificação");
                    if (navigator.serviceWorker.controller) {
                        document.getElementById('update-button').style.display = "block";
                        // O evento de clique na notificação
                        document.getElementById("update-button").addEventListener("click", function() {
                            newWorker.postMessage({ action: "skipWaiting" });
                        })  
                        break;
                    }
                }
            }
        });
    });

    // SUCESSO - ServiceWorker Registrado
        console.log("4 - ServiceWorker registrado com sucesso no escopo: ", registration.scope);
    })
    .catch(function(err) {
        // ERRO - Falha ao registrar o ServiceWorker
        console.log("5 - Falha ao registrar o ServiceWorker: ", err);
    })
}

let refreshing;

window.addEventListener('appinstalled', (e) => {
    console.log("APP pode ser instalado");
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    document.getElementById('add-button').style.display = "block";

    document.getElementById('add-button').addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        document.getElementById('add-button').style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
            } else {
            console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});

// Esse evento será chamado quando o Service Worker for atualizado
// Aqui estamos recarregando a página
navigator.serviceWorker.addEventListener("controllerchange", function() {
    if (refreshing) {
        return;
    }
    window.location.reload();
    refreshing = true;
    console.log("Refresh foi realizado")
});
