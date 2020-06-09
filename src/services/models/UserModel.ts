import { Model } from "./Model";
import { ApiStringField, StringField, Validation, ApiPasswordField } from "../../utils/Validation";
import { IsDefined, IsOptional } from "class-validator";
import { CreateUserModel } from "../../types/UserTypes";
import { dummyId } from "../../utils/Functions";
import { GameModel } from "./GameModel";

export class UserModel extends Model<UserModel> {
    @ApiStringField(2, 50)
    firstName: string;

    @ApiStringField(2, 50)
    lastName: string;

    @ApiStringField(3, 50, false, StringField.EMAIL)
    email: string;

    @IsDefined({ groups: [Validation.FULL] })
    @IsOptional({ groups: [Validation.PARTIAL] })
    wishlist: GameModel[]; // should instead be an array of ids

    @ApiPasswordField()
    password: string;
}

export function createUserModel(model: CreateUserModel): UserModel {
    return new UserModel({
        firstName: model.firstName,
        lastName: model.lastName,
        email: model.email,
        wishlist: model.wishlist,
        password: model.password,
        id: model.id
    });
}

export function dummyUserModel(): UserModel {
    return new UserModel({
        firstName: 'Jack',
        lastName: 'Sparrow',
        email: 'jsparrow9@gmail.com',
        wishlist: [],
        password: 'lowUP123$$',
        id: dummyId()
    });
}
