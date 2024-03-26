import {describe, expect, test} from "vitest";
import ObjectVersionMigrator from "../src/ObjectVersionMigrator";
import {NativeSchema} from "@types/ovm.js";
import NotDtoObjectGiven from "../src/exception/NotDtoObjectGiven";

describe('Test object migration functionality', () => {
    test('Object can be auto migrated with given valid native schema and default settings', () => {
        // Given
        const migrator = new ObjectVersionMigrator({});
        const dtoObject = {
            oldField: 'NotChangedValueSpec',
            secondOlfField: 'ChangedValueSpecToNumber',
            fieldThatWouldBeDeleted: true,
            oldOptionalField: '',
            compoundField: {
                justOldFieldTab: [51, 90, 21],
                deletedNestedField: {},
                changedNestedField: 500
            },
            migratedCompoundFieldIntoSingularOne: {
                awesomeCol1: '',
                subCompoundValue: {
                    nestedAgain: ['str', 'str2']
                }
            },
            migratedSingularFieldIntoCompoundOne: [62, 21],
            undefinedField: undefined,
            notOptionalField: null
        };
        const newLatestSchema = {
            $type: 'NativeSchema',
            spec: {
                oldField: {
                    $type: 'ValueSpec',
                    default: undefined,
                    type: String,
                    optional: false,
                    validation: []
                },
                secondOlfField: {
                    $type: 'ValueSpec',
                    default: 15,
                    type: Number,
                    optional: false,
                    validation: []
                },
                newField: {
                    $type: 'ValueSpec',
                    default: true,
                    type: Boolean,
                    optional: false,
                    validation: []
                },
                oldOptionalField: {
                    $type: 'ValueSpec',
                    default: null,
                    type: String,
                    optional: true,
                    validation: []
                },
                compoundField: {
                    $type: 'NativeSchema',
                    spec: {
                        justOldFieldTab: {
                            $type: 'ValueSpec',
                            default: [],
                            type: Array,
                            optional: false,
                            validation: []
                        },
                        changedNestedField: {
                            $type: 'ValueSpec',
                            default: 'ChangedValue',
                            type: String,
                            optional: true,
                            validation: []
                        },
                        newOptionalField: {
                            $type: 'ValueSpec',
                            default: undefined,
                            type: String,
                            optional: true,
                            validation: []
                        }
                    }
                },
                migratedCompoundFieldIntoSingularOne: {
                    $type: 'ValueSpec',
                    default: ['cool'],
                    type: Array,
                    optional: false,
                    validation: []
                },
                migratedSingularFieldIntoCompoundOne: {
                    $type: 'NativeSchema',
                    spec: {
                        addedSubField: {
                            $type: 'ValueSpec',
                            default: undefined,
                            type: Array,
                            optional: true,
                            validation: []
                        },
                        secondAddedSubfield:  {
                            $type: 'ValueSpec',
                            default: [15, 16],
                            type: Array,
                            optional: false,
                            validation: []
                        }
                    }
                },
                undefinedField: {
                    $type: 'ValueSpec',
                    default: undefined,
                    type: String,
                    optional: false,
                    validation: []
                },
                notOptionalField: {
                    $type: 'ValueSpec',
                    default: undefined,
                    type: String,
                    optional: false,
                    validation: []
                }
            }
        } satisfies NativeSchema;

        // When
        const migratedObj = migrator.autoMigrate(dtoObject, newLatestSchema);

        // Then
        expect(migratedObj).toEqual({
            oldField: 'NotChangedValueSpec',
            secondOlfField: 15,
            newField: true,
            oldOptionalField: '',
            compoundField: {
                justOldFieldTab: [51, 90, 21],
                changedNestedField: '500',
                newOptionalField: null
            },
            migratedCompoundFieldIntoSingularOne: ['cool'],
            migratedSingularFieldIntoCompoundOne: {
                addedSubField: null,
                secondAddedSubfield: [15, 16]
            },
            undefinedField: "",
            notOptionalField: ""
        });
    });

    test.each([null, new Set(), ['array']])('only dto object is accepted for %s', (objCase) => {
        // Arrange
        const migrator = new ObjectVersionMigrator({});

        // Act & Assert
        expect(() => migrator.autoMigrate(objCase, {
            $type: 'NativeSchema',
            spec: {}
        })).toThrow(NotDtoObjectGiven.create());
    });
});