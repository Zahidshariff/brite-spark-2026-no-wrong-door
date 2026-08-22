const { XMLParser } = require("fast-xml-parser");
const config = require("../config");

const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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


async function getBenefitsRecords() {

    let lastError = null;

    for (
        let attempt = 1;
        attempt <= config.MAX_RETRIES;
        attempt++
    ) {

        try {

            const response = await fetchWithTimeout(
                `${config.XML_URL}/records`
            );

            if (!response.ok) {

                throw new Error(
                    `XML service returned HTTP ${response.status}`
                );
            }

            const xml = await response.text();

            const parsed = parser.parse(xml);

            let records =
                parsed?.BenefitsRegister?.Record || [];

            if (!Array.isArray(records)) {
                records = [records];
            }

            return {
                success: true,
                records,
                attempts: attempt
            };

        } catch (error) {

            lastError = error;

            console.log(
                `XML attempt ${attempt} failed: ${error.message}`
            );

            if (attempt < config.MAX_RETRIES) {

                const delay =
                    config.RETRY_DELAYS[attempt - 1] || 1000;

                await sleep(delay);
            }
        }
    }

    return {
        success: false,
        records: [],
        attempts: config.MAX_RETRIES,
        error: lastError
            ? lastError.message
            : "Unknown error"
    };
}


module.exports = {
    getBenefitsRecords
};