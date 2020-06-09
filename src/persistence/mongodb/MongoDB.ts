import { Schema, Model, Document, model, connect } from "mongoose";
import { ObjectId } from "mongodb";
import { IDatabase } from "../Database";
import { Entity } from "../entities/Entity";
import { ObjectProps } from "../../types/GeneralTypes";
import { DB_CONNECTION, DB_HOST, DB_DATABASE } from "../../config/env";

export class MongoDB<T extends Entity<T>> implements IDatabase<T> {
    protected model: Model<Document>;

    constructor(
        collection: string,
        schema: Schema,
    ) {

        connect(
            `${DB_CONNECTION}://${DB_HOST}/${DB_DATABASE}`,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        this.model = model(collection, schema);
    }

    public async findById(id: string): Promise<T> {
        if (!ObjectId.isValid(id)) return null;

        const searchedDoc: Document = await this.model.findById(id);
        if (!searchedDoc) return null;

        return this.toEntity(searchedDoc);
    }

    public async find(params?: Partial<ObjectProps<T>>): Promise<T[]> {

        const foundDocs: Document[] = await this.model.find(params);

        return foundDocs.map((doc: Document) => this.toEntity(doc));
    }

    public async create(entity: Omit<T, 'id'>): Promise<T> {

        const newDoc: Document = new this.model(
            this.toDocument(
                Object.assign(<T>entity, { id: new ObjectId() })
            )
        );

        return this.toEntity(await newDoc.save());
    }

    public async update(
        id: string,
        partialEntity: Omit<Partial<ObjectProps<T>>, 'id'>,
    ): Promise<T> {
        delete partialEntity['id']; // make sure id cannot be updated

        if (!ObjectId.isValid(id)) return null;

        const oldDoc: Document = await this.model.findById(id);
        if (!oldDoc) return null;

        const entity: T = this.toEntity(oldDoc);
        Object.assign(entity, partialEntity);

        const updatedDoc: Document = this.toDocument(entity);
        Object.assign(oldDoc, updatedDoc);

        return this.toEntity(await oldDoc.save());
    }

    public async delete(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return null;

        return !!(await this.model.findByIdAndDelete(id));
    }

    public toDocument(entity: T): Document {
        const mongoDoc: Document = <any>entity;
        mongoDoc._id = mongoDoc.id;
        delete mongoDoc.id;
        return mongoDoc;
    }

    public toEntity(mongoDoc: Document): T {
        const doc: { id: string, _id: string } = mongoDoc.toObject();

        Object.keys(doc).forEach((key: string) => {
            if (doc[key] instanceof ObjectId) {
                doc[key] = doc[key].toHexString();
            }
        });

        doc.id = doc._id;
        delete doc._id;

        return <any>doc;
    }

}
