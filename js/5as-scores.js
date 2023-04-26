/**
 * @typedef {Object<string, string | number>} Data
 */

/**
 * @param {Data} data
 * @returns {Data}
 */
function computeDerivedValues(data) {
	data['score1'] = countLivesTaken(data, 'lives2-');
	data['score2'] = countLivesTaken(data, 'lives1-');
	return data;
}

/**
 * @param {Data} data
 * @param {string} prefix
 * @returns number
 */
function countLivesTaken(data, prefix) {
	return Object.entries(data)
		.filter(([key]) => key.startsWith(prefix))
		.map(([,value]) => 2-(+value))
		.reduce((total, val) => total + val, 0)
}

/**
 * @param {Data} data
 */
function updateValues(data) {
	Object.entries(data)
		.forEach(([key, value]) => {
			const str = value.toString();
			/** @type NodeListOf<HTMLElement> */(document.querySelectorAll(`.${key}`))
				.forEach(elem => {
					elem.textContent = str;
					elem.dataset['value'] = str;
				});
		});
}

/**
 * @returns {Promise<void>}
 */
async function loadData() {
	return makeRequest('../sc-5as/streamcontrol.json')
		.then(JSON.parse)
		.then(computeDerivedValues)
		.then(updateValues);
}


/**
 * @param {string} url
 * @returns {Promise<string>}
 */
function makeRequest (url) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType('application/json');
		xhr.open('GET', url);
		xhr.setRequestHeader('Pragma', 'no-cache');
		xhr.setRequestHeader('Cache-Control', 'no-cache');
		xhr.onload = function () {
			if (xhr.status >= 400) {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			} else {
				resolve(xhr.response);
			}
		};
		xhr.onerror = function () {
			reject({
				status: xhr.status,
				statusText: xhr.statusText
			});
		};
		xhr.send();
	});
}

loadData()
	.then(() => {
		setInterval(() => loadData().catch(console.error), 500);
	})
	.catch(console.error);
