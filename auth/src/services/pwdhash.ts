import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PassHash {
    static async toHash (pass: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(pass, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    };
    static async compare (suppliedPwd:string, storedPwd:string) {
        const [hashedPwd, salt] = storedPwd.split('.');
        const buf = (await scryptAsync(suppliedPwd, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPwd;
    };
};