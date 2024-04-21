import express from "express";
import sql, { ConnectionPool, IOptions } from "mssql";
import CONFIG from "./config.json";
import {authApi, groceryApi, orderApi} from "src/api";

const app: express.Express = express();
const port: string | number = process.env.PORT || 3000;

app.use([express.json(), authApi, groceryApi, orderApi]);

const options: IOptions = {
  encrypt: true,
  trustServerCertificate: true
};

const connect = async (): Promise<ConnectionPool> => {
  const connection: ConnectionPool = new sql.ConnectionPool({...CONFIG, options});
  try {
    await connection.connect();
  } catch(error) {
    throw(error);
  }

  return connection;
}

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});  

export default connect;