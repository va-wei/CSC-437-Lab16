import { MongoClient } from "mongodb";

export interface ImageDocument {
    _id: string;
    src: string;
    name: string;
    author: string | UserDocument;
    likes: number;
}

export interface UserDocument {
    _id: string;
    name: string;
    email: string;
}

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImages(): Promise<ImageDocument[]> { // TODO #2
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }

        const collection = this.mongoClient.db().collection<ImageDocument>(collectionName); // TODO #1

        // Fetch all image documents
        const images = await collection.find().toArray();
        
        // Denormalize the 'author' field in each image
        const usersCollection = this.mongoClient.db().collection<UserDocument>("users");  // Assuming the collection name is 'users'
        
        const imagesWithAuthors = await Promise.all(images.map(async (image) => {
            // Fetch the author data (user document) based on the author reference (user ID)
            const user = await usersCollection.findOne({ _id: image.author });
            
            // Denormalize by replacing the author reference with the actual user data
            if (user) {
                image.author = user;  // Replace the author field with the entire user object
            } else {
                image.author = "Unknown";  // If no user found, set author to null
            }

            return image;
        }));

        return imagesWithAuthors;
    }
}