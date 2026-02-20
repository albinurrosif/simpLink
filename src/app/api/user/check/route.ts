import {NextResponse, NextRequest} from 'next/server';
import { findUserByUsername } from '@/lib/modules/user/user.repository';

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.length < 3) {
        return NextResponse.json({ available: false});
    }

   try{
    const existingUser = await findUserByUsername(username.toLocaleLowerCase().trim());

    return NextResponse.json({ available: !existingUser });
   }catch(error: any) {
    return NextResponse.json({ available: false }, { status: 500 });
   }
}