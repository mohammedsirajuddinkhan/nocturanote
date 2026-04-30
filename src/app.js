// This file handles Server Creation Only

const express = require("express");
const path = require("path");
const noteModel = require("./model/note.model");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// because db to server and server to db calls take time hence we use async await here

// Creates notes
app.post("/notes", async (req, res) => {
  const data = req.body; // { title, description }
  await noteModel.create({
    title: data.title,
    description: data.description,
  });
  res.status(201).json({
    message: "note created successfully",
  });
});

// Views notes
app.get("/notes", async (req, res) => {
  // const note = await noteModel.findOne({ --> findOne() methods finds only one finding based on the condition and either gives an object or null
  //   title: "test title_3"
  // })
  const notes = await noteModel.find(); // find() method finds every notes created on the database and always returns an array or empty array
  res.status(200).json({
    message: "Notes Fetched Successfully",
    notes: notes,
  });
});

// Delete based on id
app.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;
  await noteModel.findOneAndDelete({
    _id: id,
  });
  res.status(200).json({
    message: "Note Deleted Successfully",
  });
});

// Updates description based on id
app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;

  await noteModel.findOneAndUpdate(
    {
      _id: id,
    },
    {
      title: title,
      description: description,
    },
  );
  res.status(200).json({
    message: "Note Updated Successfully",
  });
});

module.exports = app;
