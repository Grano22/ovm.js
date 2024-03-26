import {NativeSchema, NativeValueSpec, ObjectMigratorExtension} from "ovm.js";
import NotDtoObjectGiven from "./exception/NotDtoObjectGiven.ts";

interface ObjectVersionMigratorConfig {

}

export default class ObjectVersionMigrator {
    readonly #extensions: Map<string, ObjectMigratorExtension<any>>;
    // @ts-ignore
    readonly #serviceConfig: ObjectVersionMigratorConfig;

    constructor(serviceConfig: ObjectVersionMigratorConfig) {
        this.#extensions = new Map<string, ObjectMigratorExtension<any>>;
        this.#serviceConfig = serviceConfig;
    }

    autoMigrate(dtoObject: object, latestSchema: unknown): object
    {
        if (!this.#isAnonObject(dtoObject)) {
            throw NotDtoObjectGiven.create();
        }

        const copyObj = Object.assign({}, dtoObject);

        let latestNativeSchema = this.#getSchema(latestSchema);

        if (!latestNativeSchema) {
            throw new Error('Given schema is not supported');
        }

        this.#migrateLevel(copyObj, latestNativeSchema);

        return copyObj;
    }

    #migrateLevel(dtoObjectRef: object, latestSchema: NativeSchema) {
        for (const propName of new Set([ ...Object.keys(dtoObjectRef), ...Object.keys(latestSchema.spec) ]).values()) {
            if (this.#isNativeSchema(latestSchema.spec[propName])) {
                if (!this.#isAnonObject(dtoObjectRef[propName])) { //typeof dtoObjectRef[propName] !== 'object' || Array.isArray(dtoObjectRef[propName])
                    dtoObjectRef[propName] = {};
                }

                this.#migrateLevel(dtoObjectRef[propName], latestSchema.spec[propName] as NativeSchema);

                continue;
            }

            if (typeof latestSchema.spec[propName] === 'undefined') {
                delete dtoObjectRef[propName];

                continue;
            }

            if (typeof dtoObjectRef[propName] === 'undefined') {
                this.#fillPropWithDefaultValue(dtoObjectRef, propName, latestSchema.spec[propName] as NativeValueSpec);

                continue;
            }

            if (this.#detectType(dtoObjectRef[propName]) !== (latestSchema.spec[propName] as NativeValueSpec).type) {
                this.#migrateProp(dtoObjectRef, propName, latestSchema.spec[propName] as NativeValueSpec);
            }
        }
    }

    #fillPropWithDefaultValue(dtoObjectRef: object, propName: string, propDesiredSpec: NativeValueSpec): any
    {
        Object.defineProperty(dtoObjectRef, propName, {
            value: this.#getPropDefaultValue(propDesiredSpec),
            configurable: true,
            enumerable: true,
            writable: true
        });
    }

    #getPropDefaultValue(propDesiredSpec: NativeValueSpec): any
    {
        if (propDesiredSpec.optional) {
            return null;
        }

        if (typeof propDesiredSpec.default !== 'undefined') {
            return propDesiredSpec.default;
        }

        if (propDesiredSpec.type?.constructor === Array) {
            return 0;
        }

        switch (propDesiredSpec.type)
        {
            case String:
                return '';
            case Boolean:
                return false;
            case BigInt:
                return 0n;
            case Number:
                return 0;
            case Array:
                return [];
        }
    }

    #detectType(value: unknown)
    {
        if (Array.isArray(value)) {


            return Array;
        }

        switch (typeof value) {
            case "bigint": return BigInt;
            case "boolean": return Boolean;
            case "function": return Function;
            case "number": return Number;
            case "string": return String;
            case "symbol": return Symbol;
            case "object": return Object;
            default: throw new Error(`Unsupported type: ${typeof value}`);
        }
    }

    #migrateProp(dtoObjectRef: object, propName: string, propDesiredType: NativeValueSpec) {
        if (propDesiredType.type === Number) {
            dtoObjectRef[propName] = +dtoObjectRef[propName] || propDesiredType.default;

            return;
        }

        if (propDesiredType.type === String) {
            dtoObjectRef[propName] = dtoObjectRef[propName]?.toString() || '';

            return;
        }

        if (propDesiredType.type === Array || propDesiredType.type?.constructor === Array) {
            dtoObjectRef[propName] = propDesiredType.default || [];

            return;
        }

        if (propDesiredType.optional) {
            dtoObjectRef[propName] = null;

            return;
        }

        dtoObjectRef[propName] = this.#fillPropWithDefaultValue(dtoObjectRef, propName, propDesiredType);
    }

    #getSchema(latestSchema: unknown) {
        let latestNativeSchema: NativeSchema|null = null;

        if (!latestSchema) {
            return null;
        }

        if (this.#isNativeSchema(latestSchema)) {
            return latestSchema satisfies NativeSchema;
        }

        for (const extension of this.#extensions.values()) {
            if (extension.isSchemaSupported(latestSchema)) {
                if (latestNativeSchema !== null) {
                    throw new Error('Schema is supported by multiple extensions');
                }

                latestNativeSchema = extension?.convertSchema && extension?.convertSchema(latestSchema) || null;
            }
        }

        return latestNativeSchema;
    }

    #isNativeSchema(potentialSchema: unknown): potentialSchema is NativeSchema
    {
        return typeof(potentialSchema) === 'object' &&
            potentialSchema !== null &&
            "$type" in potentialSchema &&
            "spec" in potentialSchema &&
            potentialSchema?.$type === 'NativeSchema' &&
            typeof potentialSchema?.spec === 'object';
    }

    #isAnonObject(sth: unknown): sth is Object
    {
        return Object.prototype.toString.call(sth) === '[object Object]';
    }
}