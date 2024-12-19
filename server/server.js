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
  let attachedQuery = '';
  for (let i = 0; i < userInput.length; i++) {
    attachedQuery += `?film dbp:starring "${userInput[i]}"@en.\n`;
  }

  // List all of films and their gross income starred by actors' name based on the user's input
  const query = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbp: <http://dbpedia.org/property/>
      SELECT DISTINCT ?name ?gross
      WHERE {
        ?film a dbo:Film.
        ?film dbp:language "English"@en.
        ${attachedQuery}
        ?film dbp:name ?name.
        OPTIONAL {?film dbp:gross ?gross}.
        FILTER (?name != ""@en)
      }
    `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

app.post('/queryBy/Director', async (req, res) => {
  const { userInput } = req.body;

  // List all of films and their gross income based on the director's name based on the user's input
  const query = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>
    SELECT DISTINCT ?name ?gross
    WHERE {
      ?film a dbo:Film.
      ?film dbp:director "${userInput}"@en.
      ?film dbp:name ?name.
      OPTIONAL {?film dbp:gross ?gross}.
      FILTER (?name != ""@en)
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

  // List all of films and their gross income based on genre from the user's input
  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbp: <http://dbpedia.org/property/>
  SELECT DISTINCT ?name ?gross
  WHERE {
    ?film a dbo:Film.
    ?film dbp:genre "${userInput}"@en.
    ?film dbp:name ?name.
    OPTIONAL {?film dbp:gross ?gross}.
    FILTER (?name != ""@en)
  }
  `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

// List all of films and their gross income that have the same director based on the title film from the user's input
app.post('/queryBy/Title', async (req, res) => {
  const { userInput } = req.body;
  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbp: <http://dbpedia.org/property/>
  SELECT DISTINCT ?name ?gross
  WHERE {
    ?film a dbo:Film.
    ?film dbp:language "English"@en.
    ?film dbp:name "${userInput}"@en.
    ?film dbp:director ?director.

    ?otherFilm a dbo:Film.
    ?otherFilm dbp:language "English"@en.
    ?otherFilm dbp:name ?name.
    ?otherFilm dbp:director ?director.
    OPTIONAL {?otherFilm dbp:gross ?gross}.

    FILTER (?name != "${userInput}"@en)
    FILTER (?name != ""@en)
  }
  `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

// List all of films and their gross income based on the released year from the user's input
app.post('/queryBy/releasedYear', async (req, res) => {
  const { userInput } = req.body;
  let filter;
  if (Array.isArray(userInput)) {
    filter = `FILTER (YEAR(?year) >= ${userInput[0]} && YEAR(?year) <= ${userInput[1]})`;
  } else {
    filter = `FILTER (YEAR(?year) = ${userInput})`;
  }
  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbp: <http://dbpedia.org/property/>
  SELECT DISTINCT ?name ?gross
  WHERE {
    ?film a dbo:Film.
    ?film dbp:language "English"@en.
    ?film dbp:name ?name.
    ?film dbo:releaseDate ?year.
    OPTIONAL {?film dbp:gross ?gross}.
    ${filter}
    FILTER (?name != ""@en)
  }
  `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

// List all of films and their gross income based on the language from the user's input
app.post('/queryBy/Language', async (req, res) => {
  const { userInput } = req.body;
  const query = `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dbp: <http://dbpedia.org/property/>
  SELECT DISTINCT ?name ?gross
  WHERE {
    ?film a dbo:Film.
    ?film dbp:language "${userInput}"@en.
    ?film dbp:name ?name.
    OPTIONAL {?film dbp:gross ?gross}.
    FILTER (?name != ""@en)
  }
  `;

  const sparql_query = SPARQLManipulation(query);
  const response = await axios.get(endpoint, {
    params: { query: sparql_query },
    headers: { Accept: 'application/sparql-results+json' },
  });
  res.json(response.data.results.bindings);
});

// Parse the query string and create the correct format SPARQL queries
function SPARQLManipulation(query) {
  return generator.stringify(parser.parse(query));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
