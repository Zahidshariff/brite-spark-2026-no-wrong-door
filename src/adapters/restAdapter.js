const config = require("../config");

async function fetchWithTimeout(url) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, config.TIMEOUT);

    try {
        return await fetch(url, {
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeout);
    }
}


async function getResidentById(id) {

    const url =
        `${config.REST_URL}/residents/${encodeURIComponent(id)}`;

    const response = await fetchWithTimeout(url);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `REST service returned HTTP ${response.status}`
        );
    }

    return await response.json();
}


module.exports = {
    getResidentById
};