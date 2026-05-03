const connectDB = require("../../src/db/db");
const noteModel = require("../../src/model/note.model");

async function handleRequest(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === "DELETE") {
    await noteModel.findOneAndDelete({
      _id: id,
    });

    res.status(200).json({
      message: "Note Deleted Successfully",
    });
    return;
  }

  if (req.method === "PATCH") {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    await noteModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        title: data.title,
        description: data.description,
      },
    );

    res.status(200).json({
      message: "Note Updated Successfully",
    });
    return;
  }

  res.status(405).json({
    message: "Method Not Allowed",
  });
}

module.exports = handleRequest;
