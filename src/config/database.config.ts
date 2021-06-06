import { MongoClient, Db } from "mongodb";

class Database {
    private client: MongoClient | undefined;
    public db: Db | undefined;

    public async init() {
        try {
            // connect to client
            this.client = new MongoClient(process.env.MONGODB_URI ?? "", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            await this.client.connect();
            console.log("Connected to db using " + process.env.MONGODB_URI);

            // set database
            this.db = this.client.db(process.env.DATABASE_NAME ?? "");
        } catch (error) {
            console.log({ red: process.env.MONGODB_URI });
            console.log({ error });
        }
    }
}

export default new Database();
