const path = require('path');
const fs = require('fs');
const tf = require("@tensorflow/tfjs-node")
const modelsNames = "base,beauty,combined,crypto,gaming,kpop,tech".split(",");
const PORT = process.env.PORT || 5000;
const express = require('express');

const load = (async () => {
    const basePath = path.resolve(".");
    console.log(fs.readdirSync(basePath), fs.readdirSync("/app"));
    loadedModels = Object.fromEntries(await Promise.all(modelsNames.map(async name => [name, await tf.loadGraphModel(`file://${basePath}/heroku/${name}-model/model.json`)])));

    console.log(await predictNextWord("i am", loadedModels.base));
})();


express().get("/predictNext", async (req, res) => {
    const modelName = req.query.model;
    const text = req.query.text;

    await load;

    if(!modelName || typeof modelName !== 'string' || typeof text !== 'string' || !loadedModels[modelName]) {
        return res.status(500).end();
    }

    const model = loadedModels[modelName];

    const predicted = await predictNextWord(text, model);

    return res.status(200).json({text, modelName, predicted}).end();
}).listen(PORT);

console.log(tf.version);

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
    const words = text.replace(/\./g, "").replace(/,/g, "").replace(/!/g, "").replace(/\\?/g, "").split(" ");
    console.log(words);

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

const tokenizerJson = require("./tokenizer-idx.json");

const tokenizerJsonReversed = Object.fromEntries(Object.entries(tokenizerJson).map(([a, b]) => [b, a]));

let loadedModels;

const predictNextWord = async (text, model) => {
    const input = textToInputTensor(text);
    console.log(input);

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
