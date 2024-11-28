const express = require('express');
const bodyParser = require('body-parser');
const SparqlParser = require('sparqljs').Parser;
const SparqlGenerator = require('sparqljs').Generator;
const parser = new SparqlParser();
const generator = new SparqlGenerator();
const axios = require('axios');
const cors = require('cors');
const app = express();
const endpoint = 'http://dbpedia.org/sparql';

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

app.post('/queryBy/Actor', async (req, res) => {
  const { userInput } = req.body;

  const query = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbp: <http://dbpedia.org/property/>
      SELECT ?film ?name
      WHERE {
        ?film a dbo:Film.
        ?film dbp:language "English"@en.
        ?film dbp:starring "${userInput}"@en.
        ?film dbp:name ?name.
      }
      LIMIT 20
    `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  console.log(response.data.results.bindings);
  res.json(response.data.results.bindings);
});

app.post('/queryBy/Director', async (req, res) => {
  const { userInput } = req.body;

  const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    SELECT ?film ?name
    WHERE {
      ?film a dbo:Film.
      ?film dbp:director "${userInput}"@en.
      ?film dbp:name ?name.
  }
  `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

app.post('/queryBy/Genre', async (req, res) => {
  const { userInput } = req.body;

  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbp: <http://dbpedia.org/property/>
  SELECT ?film ?name
  WHERE {
    ?film a dbo:Film.
    ?film dbp:genre "${userInput}"@en.
    ?film dbp:name ?name.
  }
  `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

function SPARQLManipulation(query) {
  return generator.stringify(parser.parse(query));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
