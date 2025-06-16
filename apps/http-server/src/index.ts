import express from "express"
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"

const app = express();

app.post("/signup", (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    res.json({
        userId: "123"
    })
})

app.post("/signin", middleware, (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
})

app.post('/room', middleware, (req, res) => {
const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }  
    res.json({
        roomId: 123
    })
})

app.listen(3001);