import express, {json, Request, Response} from "express";
import { middleware } from "./middleware.js";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/types"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();
app.use(express.json())

app.post("/signup", async (req: Request, res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return;
    }

   try {
     const user = await prismaClient.user.create({
        data: {
            email: parsedData.data?.email,
            // Hash the password
            password: parsedData.data.password,
            username: parsedData.data.username
        }
    })

      res.status(201).json({
            userId: user.id
        });

   } catch (error: any) {
        if(error.code === 'P2002') {
            const field = error.meta?.target?.[0];
             res.status(409).json({
                message: `User already exists with this ${field}`
            })
            return;
        }
       res.status(500).json({
        message: "Something went wrong"
     })
    }

})

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // Compare the hashed password 
    const user =  await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })

    if(!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post('/room', middleware, async (req, res) => {
const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }  

    // @ts-ignore - Will fix this later 
    const userId = req.userId
    // const slug = slugify(name)

    try {
    const room = await prismaClient.room.create({
        data: {
            adminId: userId, 
            slug: parsedData.data?.name
        }
    })

    res.json({
        roomId: room.id
    })
   } catch(error) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
   }  
})

app.listen(3001);