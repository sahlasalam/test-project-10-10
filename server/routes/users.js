const express = require("express");
const router = express.Router();
const User = require("../models/users.js");

// Escape user input before using it in a regular expression.
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET
router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 5),
    );

    const skip = (page - 1) * limit;

    // Apply filtering before $facet so both branches use
    // exactly the same matching documents.
    const matchStage = search
      ? {
          $match: {
            $or: [
              { name: { $regex: escapeRegex(search), $options: "i" } },
              { email: { $regex: escapeRegex(search), $options: "i" } },
              { username: { $regex: escapeRegex(search), $options: "i" } },
            ],
          },
        }
      : { $match: {} };

    const result = await User.aggregate([
      matchStage,
      {
        $facet: {
          data: [
            { $sort: { name: 1, _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                name: 1,
                username: 1,
                email: 1,
                company: 1,
                address: 1,
                website: 1,
              },
            },
          ],
          metadata: [{ $count: "total" }],
        },
      },
    ]);

    const data = result[0]?.data || [];
    const total = result[0]?.metadata[0]?.total || 0;

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
