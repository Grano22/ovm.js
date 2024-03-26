type primitives = boolean | string | number | bigint;
type PrimitivesObject = Boolean | String | Number | BigInt;

export interface NativeValueSpec<ValueType extends primitives | PrimitivesObject = any> {
    $type: 'ValueSpec';
    type: ValueType;
    optional: boolean;
    default: ValueType | undefined;
    validation: any;
}

export interface NativeSchema {
    $type: 'NativeSchema',
    spec: Record<string, NativeValueSpec|NativeSchema>;
}