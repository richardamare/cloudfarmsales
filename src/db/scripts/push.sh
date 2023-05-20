path=$(pwd)/src/db/migrations
migration_file=$(ls -t $path | head -n 1)
file_path=$path/$migration_file
content=$(cat $file_path)

echo "Pushing migration to database..."
echo "Executing >> migrations/$migration_file"

# docker exec -it 5d9655ef9691 psql -U postgres -d iotcloudfarm -c "$content"

docker exec -it cc9990bbc351 psql "postgresql://postgres:LRdu9e9E583SP6UyBP7s@containers-us-west-184.railway.app:5633/railway" -c "$content"