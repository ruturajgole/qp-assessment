import express, { Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

import CONFIG from "src/config.json";
import { User, Type } from "src/models";
import connect from "src";

export const verifyJWT = (res: Response, token?: string, requiresAdmin: boolean = false): User | null => {
  let user = null;
  if(!token){
    res.status(401).json({ message: "Please provide the bearer token" });
    return null;
  }

  try {
    jwt.verify(token!.replace("Bearer ", ""),
    CONFIG.jwtKey,
    (error: VerifyErrors | null, data: any) => {
      if(error){
        res.json({ error });
      } else {
        if(data.iat > data.exp) {
          res.status(440).json({ message: "Session expired. Please login again." });
        } else if (requiresAdmin && data.type === Type.Admin) {
          res.status(401).json({ message: "You are not authorized to perfom this operation" });
        } else {
          user = data;
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
  return user;
}

const router: express.Router = express.Router();

router.post("/api/auth/register", async (req: Request, res: Response) => {
  const { username, name, password, type } = req.body;

  try {
    const connection = await connect();

    const request = connection.request();
    Object.entries({name, username, password, type}).forEach((param) => request.input(param[0], param[1]));
    await request.execute("Register");
    
    await connection.close();
    res.status(200).json({ message: "User Created" });
  } catch(error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/api/auth/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const connection = await connect();

    const request = connection.request();
    Object.entries({ username, password }).forEach((param) => request.input(param[0], param[1]));
    const result = await request.execute("Login");
    console.log(result);
    await connection.close();
    if(result.recordset.length){
      const user = result.recordset[0];
      const token = jwt.sign(
        {ID: user.ID, type: user.type, username: user.username, name: user.name},
        CONFIG.jwtKey,
        {expiresIn: "1h"}
      );
      res.status(200).json({ token });
      return null;
    }
    res.status(401).json({ message: "Login Failed. Please check your credentials and try again." })
  } catch(error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
