const express = require("express");
const router = express.Router();
const scrapeBrand = require("../scraper/scraper");
const supabase = require("../supabaseClient.js");


// brand scraper or brand upload routes. (GET, POST, DELETE)


// GET /brand-upload
// Fetches all scraped brands from the database
router.get("/", async (req, res) => {
  try {
    // Query all brands from the 'scraped_brands' table, ordered by newest first
    const { data: scrapedBrands, error } = await supabase
      .from('scraped_brands')
      .select('id, name, website, mission, description, categories, logo_url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error retrieving scraped brands:", error);
      return res.status(500).json({ error: "Failed to retrieve scraped brands" });
    }

    // Successfully return the list of scraped brands
    return res.json(scrapedBrands);

  } catch (error) {
    console.error("Error retrieving scraped brands:", error.message);
    return res.status(500).json({ error: "Something went wrong while retrieving scraped brands" });
  }
});

// POST /brand-upload
// Uploads a new brand, scrapes its mission/description/categories, and saves it to the database

router.post("/", async (req, res) => {
  try {
    const { brand, website, logo } = req.body;

    // Validate required fields
    if (!brand || !website || !logo) {
      return res.status(400).json({ error: "brand, website, and logo are required" });
    }

    console.log(`Brand upload started for: ${brand}`);

    // Automatically scrape additional information from the brand's website
    const scrapedData = await scrapeBrand(website);

    // Combine user-provided data with scraped data
    const fullBrandData = {
      brand,
      website,
      logo,
      mission: scrapedData.mission,
      description: scrapedData.description,
      categories: scrapedData.categories
    };

    // Save combined data to the database
    const { data: savedBrand, error: dbError } = await supabase
      .from('scraped_brands')
      .insert([{
        name: brand,
        website: website,
        about_page_url: scrapedData.aboutPageUrl,
        mission: scrapedData.mission,
        description: scrapedData.description,
        categories: scrapedData.categories,
        logo_url: logo,
        created_at: new Date(),
        updated_at: new Date()
      }])
      .select();

    // Log any database errors (but still return scraped data to the client)
    if (dbError) {
      console.error("Error saving to database:", dbError);
    } else {
      console.log(`Brand saved to database: ${brand}`);
      fullBrandData.id = savedBrand[0].id;
    }

    console.log(`Brand upload complete: ${brand}`);
    return res.json(fullBrandData);

  } catch (error) {
    console.error("Error uploading brand:", error.message);
    return res.status(500).json({ error: "Something went wrong while uploading the brand" });
  }
});

// DELETE /brand-upload/:id
// Deletes a brand from the database by its ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the ID is provided and is a number
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "Invalid brand ID provided"
      });
    }

    // Attempt to delete the brand from the database
    const { error } = await supabase
      .from('scraped_brands')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting brand with ID ${id}:`, error);
      return res.status(500).json({
        success: false,
        error: "Failed to delete brand"
      });
    }

    console.log(`Brand with ID ${id} deleted successfully`);
    return res.json({
      success: true,
      message: `Brand with ID ${id} deleted successfully`
    });

  } catch (error) {
    console.error("Error deleting brand:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while deleting the brand"
    });
  }
});

module.exports = router;
