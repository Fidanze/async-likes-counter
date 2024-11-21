import express, { Request, Response } from "express";
import addJobs from "./queue";
import { MongoClient } from "mongodb";

const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

export const mongoClient = new MongoClient("mongodb://mongo:27017/");

app.use(cors());

app.get("/add", (req: Request, res: Response) => {
  res.sendStatus(200);
  addJobs();
});

app.get("/get", (req: Request, res: Response) => {
  mongoClient
    .connect()
    .then(async (mongoClient) => {
      const collection = mongoClient.db("counterDb").collection("counter");
      const curValue = await collection.findOne();
      if (curValue === null) {
        const val = await collection.insertOne({ value: 0 });
        console.log(`Создали первоначальное значение: ${JSON.stringify(val)}`);
        res.status(200).json(0);
      } else {
        console.log(`Текущее значение в бд: ${JSON.stringify(curValue)}`);
        res.status(200).json(curValue.value);
      }
    })
    .catch((reason) => {
      console.log("Ошибка при получении данных!");
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async () => {
  await mongoClient.close();
  console.log("Приложение завершило работу");
  process.exit();
});
