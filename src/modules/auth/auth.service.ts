import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface.tsauth.interface"

const loginUser = async (payload : ILoginUser) => {
         const { email, password } = payload;
         const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    })
    console.log(user)
}

export const authService = {
    loginUser,
}