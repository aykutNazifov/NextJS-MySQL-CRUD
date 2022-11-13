import { db } from "../../../connectMySqlDb";

export default function handler(req, res) {
  const bookId = req.query.id;
  if (req.method === "DELETE") {
    console.log(bookId);
    const q = "DELETE FROM cards WHERE id=?";
    db.query(q, [bookId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(205).json({ message: "Card has been deleted!" });
    });
  }
  if (req.method === "PUT") {
    const q = "UPDATE cards SET `name` = ?, `team`= ?, `overall`=? WHERE id=?";
    const values = [req.body.name, req.body.team, req.body.overall];
    db.query(q, [...values, bookId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Cards has been updated" });
    });
  }
}
