const express = require('express');
const pool = require('../config/db');

const router = express.Router();

//Handler to Create  a note
router.post('/', async (req, res) => {
  try {
    const { description, image, favourite } = req.body;

    const newNote = await pool.query(
      `INSERT INTO notes (description, image, user_id, favourite) VALUES ($1, $2, $3, $4) RETURNING *`,
      [description, image, req.user.id, favourite]
    );

    return res.status(201).json({ data: newNote.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

//Handler to get all notes. this endpoint also allows to query using user_id
router.get('/', async (req, res) => {
  try {
    let { id } = req.user;

    let query = `SELECT * FROM notes WHERE user_id = ${id}`;

    const allNotes = await pool.query(query);
    return res.status(200).json({ data: allNotes.rows });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

//Handler to get a single note
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id]);
    return res.status(200).json({ data: note.rows[0] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

//Handler to update a note
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, favourite } = req.body;

    if (description) {
      await pool.query(`UPDATE notes SET description = $1 WHERE id = $2`, [description, id]);
    }
    if (typeof favourite === 'boolean') {
      await pool.query(`UPDATE notes SET favourite = $1 WHERE id = $2`, [favourite, id]);
    }

    return res.status(200).json('Todo was updated');
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

//Handler to delete a note
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM notes WHERE id = $1`, [id]);
    return res.status(200).json('Todo was deleted');
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
