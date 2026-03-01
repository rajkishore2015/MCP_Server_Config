const express = require('express');
const simpleGit = require('simple-git');
const router = express.Router();
const git = simpleGit();

router.get('/status', async (req, res) => {
  try {
    const status = await git.status();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
