import MongoClient from 'mongodb-rest-relay';

const uri = process.env.MONGODB_URI as string;
const options = {
  serverApi: {
    strict: true,
    deprecationErrors: true
  }
};

let client: MongoClient | null;
let clientPromise: any;

if (process.env.NODE_ENV === 'development') {
  // in development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // in production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
