const inputElem = document.querySelector('#input');
const predictionElem = document.querySelector('#prediction');
const loadingElem = document.querySelector("#loading");
const modelsDropdownElem = document.querySelector("#models-dropdown");

(async () => {
    await fetch("https://mobile-keyboard.herokuapp.com/");

    loadingElem.hidden = true;
    inputElem.disabled = false;

    const predictNextWord = async text => {
        const selectedModel = modelsDropdownElem.value;

        const url = `https://mobile-keyboard.herokuapp.com/predictNext?model=${selectedModel}&text=${encodeURIComponent(text)}`;

        const result = await fetch(url);
        const data = await result.json();

        return data.predicted;
    };

    let lastUpdate = Date.now();

    const checkSuggestions = async () => {
        const text = inputElem.value;

        if(text.endsWith(" ") || text.length === 0){
            predictionElem.innerHTML = "";
            const words = await predictNextWord(text.trim());
            predictionElem.innerHTML = "";

            // best word should be in the middle
            const temp = words[0];
            words[0] = words[1];
            words[1] = temp;

            words.forEach((word) => {
                const btn = document.createElement("button");
                btn.innerText = word;
                predictionElem.appendChild(btn);
                btn.onclick = () => {
                    inputElem.value += btn.innerText + " ";
                    checkSuggestions();
                };
            })
            lastUpdate = Date.now();
        }else if(Date.now() - lastUpdate > 500){
            predictionElem.innerHTML = "";
            predictionElem.innerText = "";
            lastUpdate = Date.now();
        }
    };
    inputElem.oninput = checkSuggestions;
    modelsDropdownElem.onchange = checkSuggestions;

    await checkSuggestions();
})();
