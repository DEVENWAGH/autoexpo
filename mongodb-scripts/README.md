# MongoDB Scripts for AutoExpo

This directory contains utility scripts for working with MongoDB in the AutoExpo project.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your MongoDB connection string.

## Available Scripts

### Insert Car Data

```bash
npm run insert-car
```

This script inserts a sample car (Tata Nexon) into the MongoDB database.

## Troubleshooting

### MongoDB ObjectId Issues

When working with MongoDB documents, it's best to let MongoDB generate IDs automatically:

```javascript
// Let MongoDB generate a unique _id
await collection.insertOne({ name: "Document without explicit _id" });

// If you need to reference the ID later:
const result = await collection.insertOne({ name: "My document" });
console.log(`Generated ID: ${result.insertedId}`);

// Only specify an ID when you absolutely need to control it
await collection.insertOne({
  _id: new ObjectId("67d1825cf1f5573104533c39"),
  name: "Document with specific _id",
});
```

### Date Field Issues

For timestamps, use JavaScript Date objects with the current date:

```javascript
// Using current date (recommended)
{
  createdAt: new Date(),
  updatedAt: new Date()
}

// Using specific date if needed
{
  createdAt: new Date("2025-03-30T16:15:46.396Z")
}
```

### Connection Issues

If you're having trouble connecting to MongoDB, make sure:

1. Your MongoDB server is running
2. Your connection string in `.env` is correct
3. Network access is properly configured
