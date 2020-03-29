
        // Inicializando o Firebase
        var config = {
            apiKey: "AIzaSyBxDUuRXd3jsvK1i_ljF0yKWY9TFm3MwcU",
            authDomain: "teste-mqtt.firebaseapp.com",
            databaseURL: "https://teste-mqtt.firebaseio.com",
            projectId: "teste-mqtt",
            storageBucket: "teste-mqtt.appspot.com",
            messagingSenderId: "252214925741",
            appId: "1:252214925741:web:670f553accf7a23332a924"
        }

        firebase.initializeApp(config);

        var database = firebase.database();
        