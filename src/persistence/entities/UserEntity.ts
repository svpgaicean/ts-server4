import { Entity } from "./Entity";
import { dummyId } from "../../utils/Functions";

export class UserEntity extends Entity<UserEntity> {
    firstName: string;
    lastName: string;
    email: string;
    wishlist: string[];
    password: string;
}

export function dummyUserEntity(): UserEntity {
    return new UserEntity({
        firstName: 'Jack',
        lastName: 'Sparrow',
        email: 'jsparrow9@gmail.com',
        wishlist: [],
        password: 'lowUP123$$',
        id: dummyId()
    });
}
