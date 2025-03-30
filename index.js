require('dotenv').config();
const express = require('express');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à Cosmos DB
const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_URI,
  key: process.env.COSMOS_DB_KEY
});

const database = client.database(process.env.COSMOS_DB_DATABASE);
const container = database.container(process.env.COSMOS_DB_CONTAINER);

// Route API : /api/sensordata
app.get('/api/sensordata', async (req, res) => {
  try {
    const query = "SELECT TOP 100 * FROM c ORDER BY c.timestamp DESC";
    const { resources } = await container.items.query(query).fetchAll();
    res.json(resources);
  } catch (err) {
    console.error("Erreur Cosmos DB :", err.message);
    res.status(500).send("Erreur lors de la lecture des données.");
  }
});

app.listen(port, () => {
  console.log(`API disponible sur http://localhost:${port}/api/sensordata`);
});
