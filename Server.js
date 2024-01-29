const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
//const {analytics} = require("./analyze");

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


app.get('/api/analytics', async (req, res) => {
  let connection;

  try {
    // Initialize the Oracle database connection
    connection = await initializeOracleConnection();
    // Example query to get the latest changes from the audit table within the last hour
    const query = `
SELECT * FROM MLOG$_TB_RELATION TR
LEFT JOIN MLOG$_TB_RELATION_TEMP TR_TEMP ON TR.RELATION_NO = TR_TEMP.RELATION_NO
`;

    // Execute the query
    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

		const flags = [];
			result.rows.forEach((value, key)=>{
				if (!value.FIRST_NAME_1 || !value.SURNAME_1) {
					const vvalue = {...value, "reason": "Not in temp"}
					return flags.push(vvalue);
				}

				if (value.SURNAME != value.SURNAME_1 || value.FIRST_NAME != value.FIRST_NAME_1 || value.MOBILE1_1 != value.MOBILE1){
					const vvalue = {...value, "reason": "unauthorized change"}
					return flags.push(vvalue);

				}
			});
    // Process the data and identify records with the same key but different values
   /*  const mismatches = findDataMismatches(result.rows);
    const duplicates = findDataDuplicates(result.rows); */

    // Send the response with the changes and mismatches
    /* res.json({ changes: result.rows, mismatches, duplicates }); */
    res.json({flags})
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
