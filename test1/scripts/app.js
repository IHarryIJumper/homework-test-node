"use strict";

var paintData = {
		expenditure: 0.4, // расход литров на метр квадратный
		materials: {
			1: 5, // id товара : объем в упаковке (id=1: 5 литров)
			2: 10,
			67: 15,
			34: 40
		},
		prices: {
			1: { // id товара
				3: 120, // id поставщика: цена за упаковку
				// 3: 100, 
				5: 123.45,
				49: 135
			},
			2: {
				3: 240,
				5: 240.80,
				49: 230
			},
			67: {
				3: 340,
				// 3: 299,
				5: 360,
				49: 300.05
			},
			34: {
				3: 1200,
				5: 1050.99,
				49: 1150
				// 49: 800
			}
		}
	},
	sortedMaterialsKeys = [],
	sellersArray = [],
	optimalPrice = null,
	optimalMaterials = [],
	optimalSeller = 'Нет',
	squareInput = document.getElementById("square-input"),
	calculateButton = document.getElementById("square-calc");


function insertConsumption() {
	document.getElementById("consumption-rate").innerText = paintData.expenditure + ' литр'
}

function insertMaterials() {
	var materialsListContainer = document.getElementById("materials-list"),
		materialsIdArray = Object.keys(paintData.materials);

	materialsIdArray.map(function (materialId, idIndex) {
		var materialElement = document.createElement("li"),
			elementIdContainer = document.createElement("div"),
			materialValueContainer = document.createElement("div");

		materialElement.classList = 'list-element';

		elementIdContainer.innerText = materialId;
		elementIdContainer.classList = 'element-id bold';

		materialValueContainer.innerText = paintData.materials[materialId];
		materialValueContainer.classList = 'material-value';


		materialElement.appendChild(elementIdContainer);
		materialElement.appendChild(materialValueContainer);

		materialsListContainer.appendChild(materialElement)
	});
}

function inputWarning(message) {
	if (message === undefined) {
		document.getElementById("input-warning").innerText = '';
	} else {
		document.getElementById("input-warning").innerText = message;
	}
}

function squareValidation(event) {
	if (event.keyCode === 13) {
		calculations();
	} else {
		var number = parseFloat(event.target.value);

		if (number < 0) {
			event.target.value = 0;
		} else if (number > 1000) {
			// event.target.value = 1000;
			inputWarning('Значение площади слишком большое, возможен долгий просчет оптимальных значений');
		} else {
			inputWarning();
		}
	}
}

function resultMaterialsParser(materials) {
	var materialsResult = {},
		materialString = '';

	materials.map(function (material, materialIndex) {
		if (materialsResult[material] === undefined) {
			materialsResult[material] = 1;
		} else {
			materialsResult[material]++;
		}
	});

	Object.keys(materialsResult).map(function (material, materialIndex) {
		materialString += (material + ' x' + materialsResult[material] + '\n');
	});

	return materialString;
}

function calculations(event) {
	console.log('Calculations!');

	var squareValue = parseFloat(squareInput.value),
		priceElement = document.getElementById("price-rate"),
		materialsElement = document.getElementById("materials-rate"),
		sellerElement = document.getElementById("seller-rate");

	optimalPrice = null;
	optimalMaterials = [];
	optimalSeller = 'Нет';

	if (squareValue > 0 && squareValue <= 1000) {
		inputWarning();
		getOptimalPrice(squareValue);
		priceElement.innerText = optimalPrice;
		// materialsElement.innerText = optimalMaterials.join(', ');
		materialsElement.innerText = resultMaterialsParser(optimalMaterials);
		sellerElement.innerText = optimalSeller;
		saveData();
	} else {
		inputWarning('Введенная площадь некорректна');
		priceElement.innerText = 0;
		materialsElement.innerText = 'Нет';
		sellerElement.innerText = 'Нет';
	}
}

function addListeners() {
	squareInput.addEventListener("change", squareValidation);
	squareInput.addEventListener("keyup", squareValidation);
	calculateButton.addEventListener("click", calculations);
}

function swap(json) {
	var swapped = {};
	for (var key in json) {
		swapped[json[key]] = key;
	}
	return swapped;
}

function sortMaterials() {
	var swappedMaterialsJson = swap(paintData.materials),
		sortedMaterialsValues = Object.keys(swappedMaterialsJson).sort(function (a, b) {
			return a - b;
		});

	sortedMaterialsValues.map(function (value, valueIndex) {
		sortedMaterialsKeys.push(swappedMaterialsJson[value]);
	});
}

function getSellers() {
	sellersArray = Object.keys(paintData.prices[sortedMaterialsKeys[0]]);
}

function getBestPrice(materialsSet) {
	var bestPrice = null,
		currentPrice = 0,
		bestSeller = 0;
	for (var seller in sellersArray) {
		for (var material in materialsSet) {
			currentPrice += paintData.prices[materialsSet[material]][sellersArray[seller]];
		}
		if (bestPrice > currentPrice || bestPrice === null) {
			bestPrice = currentPrice;
			bestSeller = sellersArray[seller];
		}

		currentPrice = 0;
	}

	if (optimalPrice > bestPrice || optimalPrice === null) {
		optimalPrice = Math.ceil(bestPrice * 100) / 100;
		optimalMaterials = materialsSet;
		optimalSeller = bestSeller;
	}
}

function checkMaterialsConfigurations(liquidVolume) {
	var materialArray = [],
		currentVolume = 0,
		initialConfigurationArray = [],
		minConfigValue = 0,
		currentConfigValue = 1,
		maxConfigValue = sortedMaterialsKeys.length;

	if (minConfigValue === maxConfigValue) {
		return;
	}

	while (currentVolume < liquidVolume) {
		currentVolume += paintData.materials[sortedMaterialsKeys[0]]; //smallest material can
		initialConfigurationArray.push(minConfigValue);
		materialArray.push(sortedMaterialsKeys[0]);
	}

	getBestPrice(materialArray);

	while (currentConfigValue < maxConfigValue) {
		var initIteration = false,
			finalCalculation = {
				index: null,
				volume: null
			},
			editableConfigurationArray;

		if (initialConfigurationArray.length > 1) {
			editableConfigurationArray = Array.apply(Array, initialConfigurationArray);
		} else {
			editableConfigurationArray = [initialConfigurationArray[0]];
		}

		for (var configIndex = 0; configIndex < editableConfigurationArray.length; configIndex++) {
			if (initIteration === false) {
				editableConfigurationArray[configIndex] = currentConfigValue;
				initIteration = true;
			} else {
				if (editableConfigurationArray[configIndex] < currentConfigValue) {
					editableConfigurationArray[configIndex]++;
					editableConfigurationArray.fill(minConfigValue, configIndex + 1);
				}
			}

			materialArray = [];
			currentVolume = 0;

			var lastValue,
				configIteration = 0;
			while (currentVolume < liquidVolume) {
				lastValue = editableConfigurationArray[configIteration];
				currentVolume += paintData.materials[sortedMaterialsKeys[lastValue]];
				materialArray.push(sortedMaterialsKeys[lastValue]);
				configIteration++;
			}

			if (finalCalculation.index === configIteration && finalCalculation.volume === currentVolume) {
				var reversedElementIndex = (Array.apply(Array, editableConfigurationArray)).reverse().findIndex(function (element, index, array) {
					return element === currentConfigValue;
				});

				if (reversedElementIndex === -1) {
					console.error('Material index not found in materials array');
				}

				configIndex = (editableConfigurationArray.length - 1) - reversedElementIndex;


			} else {
				finalCalculation.index = configIteration;
				finalCalculation.volume = currentVolume;
				getBestPrice(materialArray);
			}

			if (lastValue === currentConfigValue) {
				currentConfigValue++;
				break;
			}

		}
	}
}

function getOptimalPrice(squareValue) {
	var liquidVolume = squareValue * paintData.expenditure;

	checkMaterialsConfigurations(liquidVolume);
}

function saveData() {
	var resultData = {
		price: optimalPrice,
		materials: optimalMaterials,
		seller: optimalSeller
	};
	localStorage.setItem('test1-resultData', JSON.stringify(resultData));
}

function start() {
	addListeners();
	insertConsumption();
	insertMaterials();
	sortMaterials();
	getSellers();
}

start();