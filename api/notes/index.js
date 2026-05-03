const connectDB = require("../../src/db/db");
const noteModel = require("../../src/model/note.model");

async function handleRequest(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const notes = await noteModel.find();
    res.status(200).json({
      message: "Notes Fetched Successfully",
      notes,
    });
    return;
  }

  if (req.method === "POST") {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    await noteModel.create({
      title: data.title,
      description: data.description,
    });

    res.status(201).json({
      message: "note created successfully",
    });
    return;
  }

  res.status(405).json({
    message: "Method Not Allowed",
  });
}

module.exports = handleRequest;
