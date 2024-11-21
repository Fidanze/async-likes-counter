import { Job, Queue, Worker } from "bullmq";
import { mongoClient } from ".";

const connection = {
  host: "redis",
  port: 6379,
};

export const myQueue = new Queue("myqueue", { connection });


export default async function addJobs() {
  await myQueue.add("increase", { step: 1 }, { removeOnComplete: true });
}

const worker = new Worker(
  "myqueue",
  async (job: Job) => {
    console.log(job.data);
    mongoClient
      .connect()
      .then(async (mongoClient) => {
        const collection = mongoClient.db("counterDb").collection("counter");
        const curValue = await collection.findOne();
        if (curValue === null) {
          const val = await collection.insertOne({ value: job.data.step });
          console.log(
            `Создали первоначальное значение: ${JSON.stringify(val)}`
          );
        } else {
          const result = await collection.updateOne(
            {},
            { $set: { value: curValue.value + job.data.step } }
          );
          console.log(`Новое значение: ${curValue.value + job.data.step}`);
          console.log(`Новое значение: ${JSON.stringify(result)}`);
        }
      })
      .catch((reason) => {
        console.log("Ошибка при выполнении работы!");
      });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job} has failed with ${err.message}`);
});
