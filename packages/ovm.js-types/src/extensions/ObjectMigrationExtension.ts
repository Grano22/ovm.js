import {NativeSchema, NativeValueSpec} from "../NativeSchema";

interface ObjectMigratorExtension<ForeignSpecType> {
    readonly NAME: string;

    isSchemaSupported(foreignSchema: unknown): boolean;
    convertSchema?(foreignSchema: unknown): NativeSchema;
    covertToNativeSpec(foreignSpecDef: ForeignSpecType): NativeValueSpec;
}

export default ObjectMigratorExtension;