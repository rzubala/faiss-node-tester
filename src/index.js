import { VertexAIEmbeddings } from "@langchain/google-vertexai";
import { BaseEmbeddings } from "./base.embeddings.js";

console.log("Hello AllFunds world!");

const embeddings = new VertexAIEmbeddings({
    model: "text-embedding-004",
});

export const assetClassesEmbeddings = new BaseEmbeddings({
    embeddings,
    logNamespace: "[AssetClassesEmbeddings]",
    name: "Asset Classes",
    storeDirectory: "embeddings/assetClasses",
    getDocuments: async () => [],
});

console.log("Trying to load asset classes ...");
const assetClassesVectorStore = await assetClassesEmbeddings.loadStore();

console.log("Asset classes loaded!");

["Alternatives", "Foobar"].forEach(async (text) => {
    const result = await assetClassesVectorStore
        .similaritySearch("Alternatives", 5)
        .then((docs) =>
            docs.map((d) =>
                JSON.stringify({
                    name: d.metadata.name,
                    ...d.metadata,
                })
            )
        );
    console.log(text, result);
});
