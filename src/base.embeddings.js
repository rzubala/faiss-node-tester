import path from "node:path";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { chunk } from "remeda";

export class BaseEmbeddings {
    vectorStore;
    chunkSize = 1500;

    constructor(config) {
        this.config = config;
        this.vectorStore = new FaissStore(this.config.embeddings, {});
        if (this.config.chunkSize) {
            this.chunkSize = this.config.chunkSize;
        }
    }

    get store() {
        return this.vectorStore;
    }

    async populate() {
        const documents = await this.config.getDocuments();
        try {
            await this.addDocuments(documents);
            console.log(
                this.config.logNamespace,
                `Populated vector store with ${documents.length} documents`
            );
        } catch (error) {
            console.error(
                this.config.logNamespace,
                "Failed to populate vector store",
                error
            );
        }
    }

    async loadStore() {
        try {
            this.vectorStore = await FaissStore.load(
                path.join(
                    path.resolve(path.dirname("")),
                    this.config.storeDirectory
                ),
                this.config.embeddings
            );
            console.log(this.config.logNamespace, "Loaded vector store");
            return this.vectorStore;
        } catch (error) {
            console.error(
                this.config.logNamespace,
                "Failed to load vector store",
                error
            );
        }
    }

    async addDocuments(documents) {
        const chunks = chunk(documents, this.chunkSize);
        for (const chunk of chunks) {
            let startTime = Date.now();
            await this.vectorStore.addDocuments(chunk);
            console.log(
                this.config.logNamespace,
                `Added chunk with ${chunk.length} docs`
            );
            await this.saveVectorStore();
            const elapsedTime = Date.now() - startTime;
            const waitTime = 60000;
            if (elapsedTime < waitTime) {
                const waitFor = waitTime - elapsedTime;
                console.log(`Waiting for ${waitFor} ms`);
                await new Promise((resolve) => setTimeout(resolve, waitFor));
            }
        }
        await this.saveVectorStore();
    }

    async saveVectorStore() {
        console.log(this.config.logNamespace, "Saving vector store");
        try {
            await this.vectorStore.save(this.config.storeDirectory);
            console.log(this.config.logNamespace, "Saved vector store");
        } catch (error) {
            console.error(
                this.config.logNamespace,
                "Failed to save vector store",
                error
            );
        }
    }
}
