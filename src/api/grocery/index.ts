import express, {Request, Response} from "express";

import connect from "src";
import { verifyJWT } from "src/api/auth";
import { User, Type } from "src/models";

const router: express.Router = express.Router();

router.get("/api/grocery/view", async (req: Request, res: Response) => {
  const token = req.headers["authorization"];

  const user = verifyJWT(res, token); 
  if(!user) return;

  try {
    const connection = await connect();    
    const results = await connection.request()
                    .query(`SELECT * FROM Grocery_Items ${(user as User).type === Type.User ? "WHERE stock > 0" : ""}`);
    
                    await connection.close();
    res.status(200).json(results.recordset);
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/grocery/add", async (req: Request, res: Response) => {
  const { name, price, stock } = req.body;
  const token = req.headers["authorization"];

  if(!verifyJWT(res, token, true)) return;

  try {
    const connection = await connect();
    const query = "INSERT INTO GROCERY_ITEMS (name, price, stock) VALUES(@name, @price, @stock)";

    const request = connection.request();
    Object.entries({name, price, stock}).forEach((param) => request.input(param[0], param[1]));
    await request.query(query);
    
    await connection.close();
    res.status(200).json({ message: "Grocery Item Added" });
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("api/grocery/remove", async (req: Request, res: Response) => {
  const { id } = req.body;
  const token = req.headers["authorization"];

  if(!verifyJWT(res, token)) return;

  try {
    const connection = await connect();
    const query = "DELETE FROM Grocery_Items WHERE id=@id";
    
    const request = connection.request();
    request.input("id", id);
    await request.query(query);
    
    await connection.close();
    res.status(200).json({ message: "Grocery Item Removed" });
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("api/grocery/update", async (req: Request, res: Response) => {
  const { id, name=null, price=null, stock=null } = req.body;

  try {
    const connection = await connect();
    const query = `UPDATE Grocery_Items SET 
    name = CASE WHEN @name IS NOT NULL THEN @name ELSE name END,
    price = CASE WHEN @price IS NOT NULL THEN @price ELSE price END,
    stock = CASE WHEN @stock IS NOT NULL THEN @stock ELSE stock END WHERE id=@id`;
    
    const request = connection.request();
    Object.entries({id, name, price, stock}).forEach((param) => request.input(param[0], param[1]));
    await request.query(query);
    
    await connection.close();
    res.status(200).json({ message: "Grocery Item Updated" });
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;