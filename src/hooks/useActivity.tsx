import baContext from "./../context/baContext";
import {useContext} from 'react';
import {useDispatch} from "react-redux";

const useActivity = () => {
    const dispatch = useDispatch()
    const context = useContext(baContext)
    const baId:any = context.baId

    return {
        startActivity: (...param:any) => dispatch({type: 'BA_START', baId}),
        stopActivity: (...param:any) => dispatch({type: 'BA_END', baId}),
    }
}

export default useActivity;
