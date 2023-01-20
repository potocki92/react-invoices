import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
  const { invoiceid } = req.query;

  const client = await MongoClient.connect(
    "mongodb+srv://satanista:satanista123@cluster0.zsrttvb.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  );

  const db = client.db();
  const collection = db.collection("Invoices");

  if (req.method === "PUT") {
    await collection.updateOne(
      { _id: ObjectId(invoiceid) },
      {
        $set: {
          status: "paid",
        },
      }
    );

    res.status(200).json({ message: "Invoice paid" });
    client.close();
  }

  //   delete request
  if (req.method === "DELETE") {
    await collection.deleteOne({ _id: ObjectId(invoiceid) });

    res.status(200).json({ message: "Invoice deleted successfully" });
    client.close();
  }
}

export default handler;