import { User } from "../models/User";
import bcrypt from "bcrypt";

export const create = async (email: string, password: string) => {
    let hasUser = await findByEmail(email);
    if (!hasUser) {
        const hash = bcrypt.hashSync(password, 10);
        let newUser = await User.create({ email, password: hash });
        return newUser;
    } else {
        return new Error("E-mail já existe!");
    }
};

export const findByEmail = async (email: string) => {
    return await User.findOne({ where: { email } });
};

export const matchPassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
};

export const all = async () => {
    return await User.findAll();
};
