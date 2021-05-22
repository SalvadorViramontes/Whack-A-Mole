const gameKeys = ['q', 'w', 'e', 'z', 'x'];
let timeOut = true;
let timer;
let promise;

function getRandomCellId(){
    let randomIndex = Math.floor(Math.random() * gameKeys.length);
    return gameKeys[randomIndex];
}

function getRandomTime(){
    let randomTime = Math.floor((Math.random() * 2000) + + 1000);
    return randomTime;
}

function newAsteroid(){
    let asteroidNode = document.createElement("img");
    asteroidNode.src="./img/asteroid.png";
    asteroidNode.className="hidden";
    return asteroidNode;
}

function clickEventHandler(event){
    checkIfAsteroidHit(event.currentTarget.id);
}

function keyboardEventHandler(event){
    let keyPressed = event.key;
    if (!gameKeys.includes(keyPressed)) return;

    checkIfAsteroidHit(keyPressed);
}

function checkIfAsteroidHit(cellId){
    let cellAsteroid = document.querySelector(`#${cellId}>img`);
    if(cellAsteroid.className === ""){
        timeOut = false;
        clearTimeout(timer);
        promise.reject();
        cellAsteroid.className = "hidden";
        let pointNode = document.querySelector(".points");
        let pointCount = Number(pointNode.childNodes[0].data)
        pointCount += 1;
        pointNode.childNodes[0].data = String(pointCount);
    }
}

function gameOver(score){
    let startCheckbox = document.getElementById("gameStarted");
    startCheckbox.checked = false;

    let startButton = document.querySelector(".start");
    startButton.disabled = false;

    document.getElementById("q").removeEventListener("click", clickEventHandler);
    document.getElementById("w").removeEventListener("click", clickEventHandler);
    document.getElementById("e").removeEventListener("click", clickEventHandler);
    document.getElementById("z").removeEventListener("click", clickEventHandler);
    document.getElementById("x").removeEventListener("click", clickEventHandler);
    document.removeEventListener('keydown', keyboardEventHandler);

    let cardBody = document.querySelector(".card-body");
    cardBody.removeChild(cardBody.childNodes[0]);

    GameOverTemplateInjector(score);
}

function asteroidMissed(cellId){
    let cellAsteroid = document.querySelector(`#${cellId}>img`);
    cellAsteroid.className = "hidden";
    let lifeNode = document.querySelector(".lives");
    let liveCount = Number(lifeNode.childNodes[0].data)
    liveCount -= 1;
    lifeNode.childNodes[0].data = String(liveCount);

    if(liveCount === 0){
        let pointNode = document.querySelector(".points");
        let pointCount = Number(pointNode.childNodes[0].data);
        gameOver(pointCount);
    }
}

function waitForRound() {
	var deferred = {
		promise: null,
		resolve: null,
		reject: null
	};

	deferred.promise = new Promise(function(resolve, reject) {
        deferred.resolve = resolve;
		deferred.reject = reject;
        timer = setTimeout(function(){
            deferred.resolve();
        }, getRandomTime());
    });

    promise = deferred;
	return deferred.promise;
}

function sleep(ms){
    return new Promise(function(resolve, reject) {
        timer = setTimeout(function(){
            resolve();
        }, ms);
    });
}

async function startGameEvent(){
    let startCheckbox = document.getElementById("gameStarted");
    startCheckbox.checked = true;

    let startButton = document.querySelector(".start");
    startButton.disabled = true;
    GridTemplateInjector();

    while(startCheckbox.checked){
        timeOut = true;
        let cellId = getRandomCellId();
        let cellAsteroid = document.querySelector(`#${cellId}>img`);
        cellAsteroid.className = "";
        try{
            await waitForRound();
        }
        catch(e){}
        if(timeOut){
            asteroidMissed(cellId);
        }
        await sleep(500);
    }
}

function BaseTemplateInjector(){
    function init(){
        let card = document.createElement("div");
        let cardHeader = document.createElement("div");
        let cardBody = document.createElement("div");
        let cardFooter = document.createElement("div");
        card.classList.add("card");
        cardHeader.classList.add("card-header");
        cardBody.classList.add("card-body");
        cardFooter.classList.add("card-footer");

        let pointMeter = document.createElement("div")
        let pointValue = document.createElement("span")
        pointMeter.classList.add("meter");
        pointValue.classList.add("points");
        pointMeter.appendChild(document.createTextNode("Marcador: "))
        pointValue.appendChild(document.createTextNode("-"));
        pointMeter.appendChild(pointValue);
        let titleHeader = document.createElement("h1");
        titleHeader.appendChild(document.createTextNode("Whack-A-Mole Reptiliano"));
        let lifeMeter = document.createElement("div")
        let lifeValue = document.createElement("span")
        lifeMeter.classList.add("meter");
        lifeValue.classList.add("lives");
        lifeMeter.appendChild(document.createTextNode("Vidas: "))
        lifeValue.appendChild(document.createTextNode("-"));
        lifeMeter.appendChild(lifeValue);
        cardHeader.appendChild(pointMeter);
        cardHeader.appendChild(titleHeader);
        cardHeader.appendChild(lifeMeter);

        let jumbotron = document.createElement("div");
        jumbotron.classList.add("jumbotron");
        let jumbotronTitle = document.createElement("h2");
        jumbotronTitle.appendChild(document.createTextNode("Instrucciones"));
        let jumbotronContent = document.createElement("ul");
        let element_01 = document.createElement("li");
        element_01.appendChild(document.createTextNode("Haz click al asteroide con el ratón"));
        let element_02 = document.createElement("li");
        element_02.appendChild(document.createTextNode('Usa las teclas "Q", "W", "E", "Z" y "X"'));
        jumbotronContent.appendChild(element_01);
        jumbotronContent.appendChild(element_02);
        jumbotron.appendChild(jumbotronTitle);
        jumbotron.appendChild(jumbotronContent);
        cardBody.appendChild(jumbotron);

        let startButton = document.createElement("button");
        startButton.appendChild(document.createTextNode("Comenzar"));
        startButton.classList.add("start");
        let startCheckbox = document.createElement("input");
        startCheckbox.type = "checkbox";
        startCheckbox.id = "gameStarted";
        startCheckbox.hidden = true;
        cardFooter.appendChild(startButton);
        cardFooter.appendChild(startCheckbox);
        
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardFooter);

        let body = document.querySelector("body");
        body.appendChild(card);
    }

    init();

    document.querySelector(".start").addEventListener("click", startGameEvent);
}

function GridTemplateInjector(){
    let cardBody = document.querySelector(".card-body");
    cardBody.removeChild(cardBody.childNodes[0]);

    let grid = document.createElement("div");
    let topGridRow = document.createElement("div");
    let qCell = document.createElement("div");
    let wCell = document.createElement("div");
    let eCell = document.createElement("div");
    let bottomGridRow = document.createElement("div");
    let zCell = document.createElement("div");
    let xCell = document.createElement("div");
    grid.classList.add("grid");
    topGridRow.classList.add("grid-row");
    bottomGridRow.classList.add("grid-row");
    qCell.classList.add("grid-col");
    wCell.classList.add("grid-col");
    eCell.classList.add("grid-col");
    zCell.classList.add("grid-col");
    xCell.classList.add("grid-col");
    qCell.id = "q";
    wCell.id = "w";
    eCell.id = "e";
    zCell.id = "z";
    xCell.id = "x";
    qCell.appendChild(newAsteroid());
    wCell.appendChild(newAsteroid());
    eCell.appendChild(newAsteroid());
    zCell.appendChild(newAsteroid());
    xCell.appendChild(newAsteroid());
    topGridRow.appendChild(qCell);
    topGridRow.appendChild(wCell);
    topGridRow.appendChild(eCell);
    bottomGridRow.appendChild(zCell);
    bottomGridRow.appendChild(xCell);
    grid.appendChild(topGridRow);
    grid.appendChild(bottomGridRow);
    cardBody.appendChild(grid);

    let pointNode = document.querySelector(".points");
    pointNode.childNodes[0].data = "0";

    let lifeNode = document.querySelector(".lives");
    lifeNode.childNodes[0].data = "3";

    document.getElementById("q").addEventListener("click", clickEventHandler);
    document.getElementById("w").addEventListener("click", clickEventHandler);
    document.getElementById("e").addEventListener("click", clickEventHandler);
    document.getElementById("z").addEventListener("click", clickEventHandler);
    document.getElementById("x").addEventListener("click", clickEventHandler);
    document.addEventListener('keydown', keyboardEventHandler);
}

function GameOverTemplateInjector(score){
    let cardBody = document.querySelector(".card-body");
    let jumbotron = document.createElement("div");
    jumbotron.classList.add("jumbotron");
    let jumbotronTitle = document.createElement("h2");
    jumbotronTitle.appendChild(document.createTextNode("Juego Terminado"));
    let jumbotronContent = document.createElement("h3");
    jumbotronContent.appendChild(document.createTextNode(`Puntuación Final: ${score}`));
    jumbotron.appendChild(jumbotronTitle);
    jumbotron.appendChild(jumbotronContent);
    cardBody.appendChild(jumbotron);
}

document.addEventListener("DOMContentLoaded", BaseTemplateInjector);