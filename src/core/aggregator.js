const {
    getResidentById
} = require("../adapters/restAdapter");

const {
    getBenefitsRecords
} = require("../adapters/xmlAdapter");


async function buildResidentView(id) {

    let resident = null;
    let residentError = null;

    // Source 1: Resident Index
    try {

        resident = await getResidentById(id);

    } catch (error) {

        residentError = error.message;
    }


    // Source 2: Benefits Register
    const benefitsResult =
        await getBenefitsRecords();


    return {

        found: resident !== null,

        resident: resident,

        benefits: benefitsResult.success
            ? benefitsResult.records
            : null,

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
                    attempts: benefitsResult.attempts
                }
                : {
                    status: "unavailable",
                    reason: benefitsResult.error,
                    attempts: benefitsResult.attempts
                }
        }
    };
}


module.exports = {
    buildResidentView
};