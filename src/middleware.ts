import { NextRequest, NextResponse} from 'next/server';


export function middleware(request: NextRequest) {
    console.log("middleware is called");
}