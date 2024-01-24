function analyze (req, res, connection){
    try{

    }catch(e){

    }
};



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
      const temp_table_result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
      const main_table_result = await connection.execute(query, [], {outFormat: oracledb.OUT_FORMAT_OBJECT});
  
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