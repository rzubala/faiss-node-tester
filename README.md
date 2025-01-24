# Faiss Node Tester

A tester that verifies that faiss-node loading of embeddings works correctly.
Using the `RUN_SIMILARITY_SEARCH` environment variable, you can also run a similarity search verification although Google Auth configuration is required: [info](https://cloud.google.com/docs/authentication/getting-started)

# Image creation:
```bash
docker build --platform=linux/amd64 -t faiss-node-tester -f ./Dockerfile .
```

# Starting the container:
```bash
docker compose up
```

# Running it locally:
```bash
pnpm i
```
```bash
RUN_SIMILARITY_SEARCH=true pnpm start
```

