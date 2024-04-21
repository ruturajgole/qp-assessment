import express, { Request, Response } from "express";
import { verifyJWT } from "src/api/auth";
import connect from "src";
import { User } from "src/models";

const router: express.Router = express.Router();

router.get("/api/order/view", async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  const user: User | null = verifyJWT(res, token);
  if(!user) return;
  try {
    const connection = await connect();
    const query = `SELECT Users.name AS 'Ordered By', Grocery_Items.name AS 'Product', price, quantity, total 
    FROM Orders 
    INNER JOIN Users ON Orders.userId = Users.ID 
    INNER JOIN Grocery_Items ON Orders.itemId = Grocery_Items.ID 
    WHERE userId = @userId`;

    const request = connection.request();
    request.input("userId", (user as User).ID);
    const results = await request.query(query);
    
    await connection.close();
    res.status(200).json(results.recordset);
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/order/add", async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  const user: User | null = verifyJWT(res, token);
  if(!user) return;

  const { itemId, quantity, total } = req.body;

  try {
    const connection = await connect();
    const query = `INSERT INTO Orders(userId, itemId, quantity, total) VALUES(@userId, @itemId, @quantity, @total)`;

    const request = connection.request();
    Object.entries({
      userId: (user as User).ID,
      itemId,
      quantity,
      total
    }).forEach((param) => request.input(param[0], param[1]));
    await request.query(query);
    
    await connection.close();
    res.status(200).json({ message: "Order Added" });
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;