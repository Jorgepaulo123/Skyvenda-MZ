import { useState } from "react";

export default function AlertDialog({title,content,actions,open=false}) {
    const [alertState,setAlertState]=useState(open)
 return (
   <>
   {open &&(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={()=>{
        setAlertState(false)
    }}>

    <div className="min-w[200px] min-h[100px] bg-blue-100 rounded-3xl p-5">
        <div className="">
            <label className="font-bold text-lg">{title}</label>
        </div>
        <div>
            {content}
        </div>
        <div>{actions}</div>

    </div>

   </div>
   )}
   </>
 );
}