OVM.js (Object Version Mapper) Package
======================================

> **ObjectMigratorExtension** is not stable interface yet, it can be changed over time

## Components

### ObjectVersionMigrator - Auto migration

**Auto migration** enables you to convert any __anonymous__ object into other one according given (native) schema. 

Example:

```js
// Step one - define your native schema
const myLatestSchema = {
    $type: 'NativeSchema',
    spec: {
        simpleField: {
            $type: 'ValueSpec',
            default: undefined,
            type: String,
            optional: false,
            validation: []
        },
        compoundField: {
            $type: 'NativeSchema',
            spec: {
                nestedField: {
                    $type: 'ValueSpec',
                    default: undefined,
                    type: Array,
                    optional: true,
                    validation: []
                }
            }
        }
    }
};

// Step one and half - define your anonymous object
const myObject = {
    simpleField: null,
    compoundField: {
        nestedField: 'NotAnArrayYet'
    }
};

// Step two - create insteance of ObjectVersionMigrator util
const migrator = new ObjectVersionMigrator({
    // Specify your config here
});

// Step three - auto migrate your object according your defined schema
const migratedObj = migrator.autoMigrate(myObject, myLatestSchema);

/* You should have something like this:
{
    simpleField: '',
    compoundField: {
        nestedField: []
    }
}
 */
```

So via native schema you can migrate in objects:
* Type of property
* Optionality of property
* Default value of property
* Validity of property (coming in future)

### Native Schema V1

Install or check __@types/ovm.js__ package.

### ObjectVersionMigrator - Reset (Coming in future)

Concept: Reset all object with default values according (native) schema.

### Extensibility - alpha API

I want to support extension API for this project to make it compatible with most available schemas by converting into native schema. For now this interface is not stable, because i have plans to improve it over time, see TODO.md.

Available extensions:
* Zod

### ObjectVersionProjectionCarver - Create Schema from object (Coming in future)

### ObjectStructuredGenerator - Generate content based on schema using faker.js (Coming in future)

### ObjectStructureDifferencesRecogniser - Find differences in structure between two schema versions (Coming in future)

### ObjectStructureDifferencesRecogniser - Find conflicts between two schemas (Coming in future)

