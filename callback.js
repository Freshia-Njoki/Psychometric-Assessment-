const sql = 'INSERT INTO `users`(`name`, `age`) VALUES (?, ?), (?,?)';
const values = ['Josh', 19, 'Page', 45];

connection.execute({ sql, values }, (err, result, fields) => {
    if (err instanceof Error) {
        console.log(err);
        return;
    }

    console.log(result);
    console.log(fields);
}
);




try {
    const sql = 'INSERT INTO `users`(`name`, `age`) VALUES (?, ?), (?,?)';
    const values = ['Josh', 19, 'Page', 45];
  
    const [result, fields] = await connection.execute({
      sql,
      values,
      // ... other options
    });
  
    console.log(result);
    console.log(fields);
  } catch (err) {
    console.log(err);
  }