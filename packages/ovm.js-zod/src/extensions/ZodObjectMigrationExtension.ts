import {NativeSchema, NativeValueSpec, ObjectMigratorExtension } from "ovm.js";
import {ZodObject, ZodType} from "zod";

export default class ZodObjectMigrationExtension implements ObjectMigratorExtension<ZodType> {
    readonly NAME: string = 'zod';

    isSchemaSupported(foreignSchema: unknown): foreignSchema is ZodObject<any> {
        return foreignSchema instanceof ZodObject;
    }

    convertSchema(foreignSchema: ZodObject<any>): NativeSchema {
        return foreignSchema.shape;
    }

    covertToNativeSpec(foreignSpecDef: ZodType): NativeValueSpec
    {
        return {
            $type: 'ValueSpec',
            type: foreignSpecDef._type,
            optional: false,
            default: undefined,
            validation: []
        };
    }
}