import React from 'react'

import Image from 'next/image'

interface ErrorStateProps{
    title:string,
    description: string,
    image?:string
}
function EmptyState({title,description,image='/empty.svg'}:ErrorStateProps) {
    return (
        <div className='flex flex-col items-center justify-center '>
        
           <Image src={image} alt='logo' height={240} width={240}/>
           <div className='flex flex-col gap-y-2 max-w-md mx-auto text-center'>
            <h6 className='text-lg font-medium'>{title}</h6>
            <p className='text-sm text-muted-foreground'>{description}</p>
           </div>
        </div>
    )
}

export default EmptyState 
