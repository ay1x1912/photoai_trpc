
import { CommandDialog, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import React, { Dispatch, SetStateAction } from 'react'
interface  DashBoardCommandProps{
    open:boolean,
    setOpen:Dispatch<SetStateAction<boolean>>
}
function DashBoardCommand({open,setOpen}:DashBoardCommandProps) {
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
            placeholder='Find a meeting or agent'
            />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandDialog>
    )
}

export default DashBoardCommand
