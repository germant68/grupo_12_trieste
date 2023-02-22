module.exports = {
  "development": {
    "username": process.env.db_username,
    "password": null,
    "database": process.env.db_database,
    "host": process.env.db_host,
    "dialect": process.env.db_dialect
  }
}  
/*
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}*/
