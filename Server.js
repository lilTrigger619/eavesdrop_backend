/* 
const express = require('express');
const mysql = require('mysql');
const cors = require('cors')

const app = express();
const port = 3001;

app.use(cors())

// Database connection parameters
const dbParams = {
  host: 'localhost',
  user: 'root',
  database: 'sample_usg',
  password: '',
};

const connection = mysql.createConnection(dbParams);

// Track the last timestamp to detect changes
let lastTimestamp = 0;

app.get('/api/latest_changes', (req, res) => {
  // Example query to get the latest changes from the audit table within the last hour
  const query = 'SELECT * FROM changelog WHERE ChangeTimestamp > NOW() - INTERVAL 1 HOUR';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Update the last timestamp
      if (results.length > 0) {
        lastTimestamp = results[results.length - 1].timestamp;
      }

      // Process the data and identify records with the same key but different values
      const mismatches = findDataMismatches(results);
      const duplicates = findDataDuplicates(results);
      
      // Send the response with the changes and mismatches
      res.json({ changes: results, mismatches, duplicates});
    }
  });
});

function findDataMismatches(data) {
  const mismatches = [];

  // const keyMap = new Map();
  //const duplicateIds = new Set();


 data?.forEach((element, i) => {
  if(element?.OldValue !== element?.NewValue){
    mismatches?.push({
      recordId : element.RecordID,
      fieldName: element.FieldName,
      previousRecord: element.OldValue,
      currentRecord: element.NewValue,
      changeTimestamp: element.ChangeTimestamp
    });
  }

 
});
  return mismatches ;
}


function findDataDuplicates(data) {
  const duplicates = [];

  // const keyMap = new Map();
  //const duplicateIds = new Set();


 data?.forEach((element, i) => {
  if(element?.OldValue === element?.NewValue){
    duplicates?.push({
      recordId: element.RecordID,
      previousRecord: element.OldValue,
      currentRecord: element.NewValue,
      changeTimestamp: element.ChangeTimestamp
    });
  }

 
});
  return duplicates ;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 


 */







const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

// Database connection parameters for Oracle
const dbParams = {
  user: 'BANKOWNER',
  password: 'pass1234',
  connectString: '10.203.14.60:9534/USGL',
};

async function initializeOracleConnection() {
  try {
    // Establish a connection to the Oracle database
    const connection = await oracledb.getConnection(dbParams);
    console.log('Connected to Oracle Database');
    return connection;
  } catch (error) {
    console.error('Error connecting to Oracle Database', error);
    throw error;
  }
}

app.get('/api/latest_changes', async (req, res) => {
  let connection;

  try {
    // Initialize the Oracle database connection
    connection = await initializeOracleConnection();
    
    // Example query to get the latest changes from the audit table within the last hour
    const query = `
    SELECT * 
    FROM MLOG$_TB_RELATION_TEMP
    `;
    // Execute the query
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    // Process the data and identify records with the same key but different values
    /*  const mismatches = findDataMismatches(result.rows);
    const duplicates = findDataDuplicates(result.rows); */
    
    // Send the response with the changes and mismatches
    /* res.json({ changes: result.rows, mismatches, duplicates }); */
    res.json({result})
  } catch (error) {
    console.error('Error executing query', error);
   res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Release the Oracle database connection
    if (connection) {
      try {
        await connection.close();
        console.log('Disconnected from Oracle Database');
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
});



app.get('/api/latest_changes_temp', async (req, res) => {
  let connection;

  try {
    // Initialize the Oracle database connection
    connection = await initializeOracleConnection();

    // Example query to get the latest changes from the audit table within the last hour
    const query = `
      SELECT * 
      FROM MLOG$_TB_RELATION
`;

    // Execute the query
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    // Process the data and identify records with the same key but different values
   /*  const mismatches = findDataMismatches(result.rows);
    const duplicates = findDataDuplicates(result.rows); */

    // Send the response with the changes and mismatches
    /* res.json({ changes: result.rows, mismatches, duplicates }); */
    res.json({result})
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Release the Oracle database connection
    if (connection) {
      try {
        await connection.close();
        console.log('Disconnected from Oracle Database');
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
});

// ... (rest of your code remains unchanged)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
