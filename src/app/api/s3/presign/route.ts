import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/s3-client";
const uplodadRequesSchem = z.object({
    fileName: z.string(),
    contentType: z.string().optional(),
    
})
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validate = uplodadRequesSchem.safeParse(body);
        
        if (!validate.success) {
            return NextResponse.json({error:"Invalid request body"},{status:400 })
        }
        const { contentType, fileName} = validate.data
        const uniquekey = `${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
          Bucket: "photoaibucket",
          Key: uniquekey,
          ContentType: contentType ?? "",
         
        });
      
        const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 })
        const response = {
            presignedUrl,
            key:uniquekey
        }

       return NextResponse.json(response,{status:200})
    } catch {
        return NextResponse.json({error:"Internal server error"},{status:500})
        
    }
    
}