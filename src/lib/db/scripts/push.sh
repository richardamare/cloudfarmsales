#!/bin/bash

# Read configuration from drizzle.config.json
# config_file="drizzle.config.json"
# out_path=$(grep -o '"out": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
# connection_string=$(grep -o '"connectionString": *"[^"]*"' "$config_file" | grep -o '"[^"]*"$' | tr -d '"')
connection_string="postgres://default:63ZgUEPxaubY@ep-small-field-350857-pooler.eu-central-1.postgres.vercel-storage.com/verceldb"

# Get all .sql files in ./migrations folder
migrations_path="src/db/migrations"
files=("$migrations_path"/*.sql)

# Iterate over each migration file
for file_path in "${files[@]}"; do
  echo "Pushing migration to database..."
  echo "Executing >> $file_path"

  # Read content of the migration file
  content=$(cat "$file_path")

  # Execute migration using connection string
  docker exec -it cc9990bbc351 psql "$connection_string" -c "$content"
done