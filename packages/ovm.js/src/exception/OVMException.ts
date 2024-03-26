abstract class OVMException extends Error {
    // @ts-ignore
    public static create(...args: any[]): ThisType<OVMException> { throw new Error('No creation method for OVMException'); };
}

export default OVMException;