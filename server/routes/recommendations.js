// server/routes/recommendations.js

const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../utils/recommendations.js");


// Receives user preferences in the request body, fetches recommendations, and returns them as JSON
router.post("/", async (req, res) => {
  try {
    // Normalize and extract user preferences from request body, providing defaults as needed
    const userPreferences = {
      ownership: req.body.ownership || [],
      categories: req.body.categories || req.body.productCategory || [],
      socialResponsibility: req.body.socialResponsibility || "No",
      ethics: req.body.ethics || req.body.ethicalPractices || [],
      environmentalPractices: req.body.environmentalPractices || []
    };

    // Fetch recommendations using the utility function
    const recommendations = await getRecommendations(userPreferences);

    // Respond with the recommendations in JSON format
    res.json(recommendations);
  } catch (err) {
    // Log error and respond with HTTP 500 status and error message
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Recommendation error" });
  }
});

module.exports = router;
