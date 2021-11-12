const inputElem = document.querySelector('#input');
const predictionElem = document.querySelector('#prediction');
const loadingElem = document.querySelector("#loading");
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

(async () => {
    const idxsOfLargestNArrayElems = (arr, n, idxToExclude) => {
        const together = Array.from(arr).map((elem, idx) => [elem, idx]);

        const sorted = together.sort((a, b) => b[0] - a[0]);

        const idxs = sorted.map(a => a[1]).filter(idx => idx !== idxToExclude);

        return idxs.slice(0, n);
    };

    const textToInputTensor = (text, seqLength = 4) => {
        const returnVal = new Array(seqLength);
        returnVal.fill(0);

        // :(
        const words = text.replaceAll(".", "").replaceAll(",", "").replaceAll("!", "").replaceAll("?", "").split(" ");

        const wordsMappedToNums = words.map(word => tokenizerJson[word] || 1);// 1 for OOV

        return returnVal.map((defaultVal, idx) => {
            const pos = wordsMappedToNums.length - idx - 1;
            const val = wordsMappedToNums[pos];
            if(val > 49999){
                return defaultVal;
            }
            return val || defaultVal;
        }).reverse();
    };

    const tokenizerJson = await fetch("./tokenizer-idx.json").then(x=>x.json());
    const tokenizerJsonReversed = Object.fromEntries(Object.entries(tokenizerJson).map(([a, b]) => [b, a]));

    const MODEL_URL = 'tfjs-model/model.json';

    const model = await loadGraphModel(MODEL_URL);

    loadingElem.hidden = true;
    inputElem.disabled = false;

    // console.log(textToInputTensor();

    const predictNextWord = async text => {
        const input = textToInputTensor(text);

        const tensor = tf.tensor([input]);

        const predicted = await model.executeAsync(tensor);
        const predictedArr = predicted.dataSync();
        // console.log("predictedArr", predictedArr);
        const largest3Words = idxsOfLargestNArrayElems(predictedArr, 3, 1);

        // const max = predicted.argMax(1).dataSync()[0];
        // console.log(predicted, max);
        // const word = tokenizerJsonReversed[max];

        return largest3Words.map(num => tokenizerJsonReversed[num]);
    };

    let lastUpdate = Date.now();

    const checkSuggestions = async () => {
        const text = inputElem.value;

        if(text.endsWith(" ") || text.length === 0){
            predictionElem.innerHTML = "";
            const words = await predictNextWord(text.trim());

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
    checkSuggestions();
})();
