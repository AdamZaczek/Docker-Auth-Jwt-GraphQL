# To run locally some requirements must be met.

### 1. Create local env variables.

Make .env file in root folder and copy env values from docker-compose.yml

### 2. Apply Env Variables

Tools/db.js needs `require('dotenv').load();` at the top of the file

### 3. Install Databases

Install Redis, Redis Server, Babel-Cli, PostgresQL.