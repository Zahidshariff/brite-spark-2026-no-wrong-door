const express = require("express");

const config = require("./config");

const {
    buildResidentView
} = require("./core/aggregator");


const app = express();

app.use(express.json());


/*
 * API health check
 */
app.get("/health", (req, res) => {

    res.status(200).json({
        status: "ok",
        service: "no-wrong-door-api"
    });

});


/*
 * Unified resident view
 *
 * GET /residents/:id
 */
app.get("/residents/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const result =
            await buildResidentView(id);

        if (!result.found) {

            return res.status(404).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {

        console.error("Unexpected API error:", error);

        return res.status(500).json({
            error: "unexpected_error",
            message: "Unable to build resident view."
        });
    }

});


app.listen(config.PORT, () => {

    console.log(
        `No Wrong Door API running on http://127.0.0.1:${config.PORT}`
    );

});