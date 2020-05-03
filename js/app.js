
let lerChopeira = document.getElementById("lerChopeira");
let tela = document.querySelector('.camera');
let qrcodeCapturado = false;
let chopeiraSelecionada = '';

const ativarCamera = () => {    
    tela.classList.toggle('active');
}

const ativarAposLerQrcode = () => {    
    let form = document.querySelector('.qrcodeLido');
    form.classList.toggle('active');
}

const desativarLeituraQrCode = () => {
    let form = document.querySelector('.acaoLerQrcode');
    form.classList.toggle('active');
}

lerChopeira.addEventListener('click', ativarCamera);

var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
});

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA && !qrcodeCapturado) {
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            chopeiraSelecionada = code.data;
            console.log(code.data);
            qrcodeCapturado = true;
            tela.style.height = '1px';
            ativarCamera();
            desativarLeituraQrCode();
            ativarAposLerQrcode();
        }
    }
    requestAnimationFrame(tick);
}

// Mapeamento dos campos do formulário
let comprar = document.getElementById("liberarChopeira");
let idCompra = document.getElementById("idCompra");
let volumeComprado = document.getElementById("volumeComprado");
let compraDoMichael = document.getElementById("compraDoMichael");

// Cria a referência com o nó a ser manipulado no Firebase
const dbRef = firebase.database().ref();
const compraRef = dbRef.child('compras');
let compraAtual = '';

// Adiciona no banco de dados
function adicionar() {
    let novoRegistro = database.ref().child('compras').push().key;
    let updates = {};
    let dadosDoRegistro = {
        chopeiraSelecionada: chopeiraSelecionada,
        volumeComprado: 0
    }

    updates['/compras/' + novoRegistro] = dadosDoRegistro;
    database.ref().update(updates);

    compraAtual = novoRegistro;

    console.log("Registro " + novoRegistro + " inserido na tabela 'compras'");
}

// Adiciona no banco de dados BOTÃO MICHAEL
function adicionarMichael() {
    let novoRegistro = database.ref().child('compras').push().key;
    let updates = {};
    let dadosDoRegistro = {
        chopeiraSelecionada: '-M5PEWnTMxcRKOxbBCiP',
        volumeComprado: 350,
        ocupada: true
    }

    updates['/compras/' + novoRegistro] = dadosDoRegistro;
    database.ref().update(updates);

    compraAtual = novoRegistro;

    console.log("Registro " + novoRegistro + " inserido na tabela 'compras'");
}

compraDoMichael.addEventListener("click", adicionarMichael);

compraRef.on("child_changed", snap => {
    if (snap.key == compraAtual) {
        idCompra.textContent = compraAtual;
        volumeComprado.textContent = snap.val().volumeComprado;
    }
});
