import React, { HtmlHTMLAttributes } from 'react'
import { createAvatar } from '@dicebear/core';
import { initials,botttsNeutral} from '@dicebear/collection';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';


interface GeneratedAvatarProps extends HtmlHTMLAttributes<HTMLDivElement>{
    seed:string,
    variant:"initials" | "botttsNeutral"
} 


function GeneratedAvatar({className,seed,variant}:GeneratedAvatarProps) {
    let avatar
    if(variant=="botttsNeutral"){
        avatar=createAvatar(botttsNeutral,{
            seed
        })
        
    }else{
        avatar=createAvatar(initials,{
            seed,
            fontWeight:500,
            fontSize:42
        })
    }
    return (
       <Avatar className={cn(className)}>
        <AvatarImage src={avatar.toDataUri()} alt='Avatar'/>
        <AvatarFallback >{seed.charAt(0).toUpperCase()}</AvatarFallback>
       </Avatar>
    )
}

export default GeneratedAvatar
