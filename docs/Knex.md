### Migrations

`http://knexjs.org/#Migrations`

`http://perkframework.com/v1/guides/database-migrations-knex.html`

There's an issue with migrations, they don't work if there's no knexfile in the folder when migration is made. Until this is fixed migration files have to be made by hand which is not too hard actually. Just add timestamp before the name of the migration and you're good to go.
Example migrations are in `/migrations` folder.