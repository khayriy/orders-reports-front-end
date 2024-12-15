import toast from 'react-hot-toast';
export default function DisplayToast(txt : string , state : boolean){
    if(state === false) {
        return toast.error(txt)
    } 
    else {
        return toast.success(txt)
    }  
}