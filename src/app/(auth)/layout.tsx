import React, { HtmlHTMLAttributes } from 'react'
interface LayoutProps extends HtmlHTMLAttributes<HTMLDivElement>{
   
}
function Layout({children}:LayoutProps) {
    return (
        <div className='bg-muted min-h-svh flex justify-center items-center p-6 md:p-10'>
            <div className='w-full max-w-sm md:max-w-3xl '>
                {children}
            </div>
        </div>
    )
}

export default Layout
