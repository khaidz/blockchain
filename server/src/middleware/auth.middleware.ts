import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User, queryUser } from "../fabric/user/User.fabric";

export async function authentication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) return res.sendStatus(401);
        const user: any = jwt.verify(token, 'blockchain');
        const queryString: any = {};
        queryString.selector = {
            docType: "User",
            user_id: user.user_id,
        };
        const result = await queryUser(user.user_id, JSON.stringify(queryString));
        if (result.length === 0) return res.sendStatus(401);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(401);
    }
}
