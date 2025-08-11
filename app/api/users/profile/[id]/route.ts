import { NextResponse, NextRequest } from "next/server";
import prisma from "@/utils/db";
import jwt from "jsonwebtoken";
import { JWTPayload } from "@/utils/types";

interface props {
    params : {id: string}
}
/**
 * @method DELETE 
 * @route ~/api/users/profile/:id
 * @desc Delete profile
 * @access private (only user himself can delete his account)
 */

export async function DELETE(request: NextRequest, {params }: props) {
    try {
        console.log(request.headers);
const user = await prisma.user.findUnique({where: {id: parseInt(params.id)}});
if (!user) { 
    return NextResponse.json(
        {message: 'User not found'},
        {status: 404}
    );
}
const authToken = request.headers.get("authToken") as string;
const userFromToken = jwt.verify(authToken, process.env.JWT_SECRET as string) as JWTPayload;
if (userFromToken === null) {
    return NextResponse.json( 
        {message : 'not token provided, access denied'},
        {status: 401}
    );
}
if (userFromToken.id === user.id) {
await prisma.user.delete({where: {id: parseInt(params.id)}});
 return NextResponse.json(
            {message: 'your profile (account) has been deleted'},
            {status: 200} 
 );
}
return NextResponse.json( 
    {message : 'only user himself can delete his profile, forbidden'},
    {status: 403}
)
    } catch (error) { 
        return NextResponse.json(
            { message: 'internal server error'},
            { status: 500 }
        );
    }
}