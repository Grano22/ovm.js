import OVMException from "./OVMException.ts";

export default class NotDtoObjectGiven extends OVMException {
    private constructor() {
        super(`Not dto object given in ovm migrator`);
    }

    public static create() {
        return new this();
    }
}