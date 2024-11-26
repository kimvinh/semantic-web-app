const express = require('express');
const bodyParser = require('body-parser');
const SparqlParser = require('sparqljs').Parser;
const SparqlGenerator = require('sparqljs').Generator;
const parser = new SparqlParser();
const generator = new SparqlGenerator();
const axios = require('axios');
const cors = require('cors');
const app = express();

// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json()); // Parses JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded requests

// Use cors middleware to handle Cross-Origin requests
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  })
);

const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/query', async (req, res) => {
  const { value } = req.body;
  const endpoint = 'http://dbpedia.org/sparql';
  const parsedQuery = parser.parse(`
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbp: <http://dbpedia.org/property/>
      SELECT ?film
      WHERE {
        ?film a dbo:Film.
        ?film dbp:language "English"@en.
        ?film dbp:starring "${value}"@en.
      }
      LIMIT 10
    `);

  const queryString = generator.stringify(parsedQuery);
  console.log(queryString);
  axios
    .get(endpoint, {
      params: { query: queryString },
      headers: { Accept: 'application/sparql-results+json' },
    })
    .then((response) => {
      console.log('SPARQL Results:', response.data.results.bindings);
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
