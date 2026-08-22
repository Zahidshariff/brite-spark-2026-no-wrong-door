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


async function getAllResidents() {

    const residents = [];
    const seenIds = new Set();

    let page = 1;
    let hasMore = true;

    while (hasMore) {

        const url =
            `${config.REST_URL}/residents?page=${page}&page_size=25`;

        const response = await fetchWithTimeout(url);

        if (!response.ok) {
            throw new Error(
                `REST service returned HTTP ${response.status}`
            );
        }

        const data = await response.json();

        for (const resident of data.results || []) {

            if (!seenIds.has(resident.id)) {

                seenIds.add(resident.id);
                residents.push(resident);
            }
        }

        hasMore = data.has_more === true;
        page++;

        if (page > 10000) {
            throw new Error(
                "REST pagination exceeded safety limit"
            );
        }
    }

    return residents;
}


module.exports = {
    getResidentById,
    getAllResidents
};