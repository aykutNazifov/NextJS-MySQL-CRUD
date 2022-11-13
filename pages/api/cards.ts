// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "../../connectMySqlDb";

export default function handler(req, res) {
  if (req.method === "GET") {
    const q = "SELECT * FROM cards ORDER BY id DESC";
    db.query(q, (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  } else if (req.method === "POST") {
    const q =
      "INSERT INTO cards (`name`, `overall`, `team`, `picture`) VALUES (?)";
    const values = [
      req.body.name,
      req.body.overall,
      req.body.team,
      req.body.picture,
    ];
    db.query(q, [values], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  } else if (req.method === "DELETE") {
  } else {
    return res.status(500).end("Something went wrong!");
  }
}
