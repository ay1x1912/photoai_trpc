import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";


interface DataPaginationProps {
  totalPages: number;
    page: number,
    onPageChange:(page:number)=>void
}
export default function DataPagination({
    totalPages,
    page,
    onPageChange
}: DataPaginationProps) {


  return (
     (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange((Math.max(1, page - 1)))}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(p)}
              className="w-8 h-8 p-0"
            >
              {p}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    )
  )
  
  //   <div className="flex items-center justify-between px-20 mt-12">
  //     <div>{`${page}/${totalPages}`}</div>
  //         <div className="flex justify-center items-center gap-4">
  //             <Button
  //                 onClick={()=>onPageChange(page-1)}
  //                 disabled={page == 1}>
  //                 previous
  //             </Button>
  //             <Button
  //                onClick={()=>onPageChange(page+1)}
  //                 disabled={page == totalPages}>
  //                 Next
  //             </Button>
  //     </div>
  //   </div>
  // );
}
