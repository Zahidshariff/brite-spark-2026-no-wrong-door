const {
    getResidentById
} = require("../adapters/restAdapter");

const {
    getBenefitsRecords
} = require("../adapters/xmlAdapter");


async function buildResidentView(id) {

    let resident = null;
    let residentError = null;

    // ---------------------------------------
    // Source 1: Resident Index
    // ---------------------------------------
    try {

        resident = await getResidentById(id);

    } catch (error) {

        residentError = error.message;
    }


    // ---------------------------------------
    // Source 2: Benefits Register
    // ---------------------------------------
    const benefitsResult = await getBenefitsRecords();


    // ---------------------------------------
    // Build unified response
    // ---------------------------------------
    return {

        found: resident !== null,

        resident: resident,

        benefits: null,

        identity: {
            status: "not_attempted",
            reason: "The two source systems do not share a common identifier."
        },

        sources: {

            resident_index: residentError
                ? {
                    status: "unavailable",
                    reason: residentError
                }
                : {
                    status: "available"
                },

            benefits_register: benefitsResult.success
                ? {
                    status: "available",
                    attempts: benefitsResult.attempts,
                    records_available: benefitsResult.records.length,
                    records_attached: false
                }
                : {
                    status: "unavailable",
                    reason: benefitsResult.error,
                    attempts: benefitsResult.attempts,
                    records_attached: false
                }
        }
    };
}


module.exports = {
    buildResidentView
};