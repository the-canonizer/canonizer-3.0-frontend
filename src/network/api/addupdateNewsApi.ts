import NetworkCall from "../networkCall";
import {message} from "antd";
import addNewsRequest from "../request/addupdateNewsRequest"

export const addNewsRequestApi = async (body) =>{
    try {
        console.log("body of add news----------------------------------------------- in api",body);
        const editnewsdata =await NetworkCall.fetch(
                addNewsRequest.getAddNewsrequest(body))
       
        return editnewsdata;
    } catch (error) {
        
    message.error(error.message);
    return error.error.data
    }
}
export const campNewsFeedApi = async () =>{
    try {
        const campnewsdat =await NetworkCall.fetch(
                addNewsRequest.getcampNewsFeedData())
        return campnewsdat;

    } catch (error) {
        
    message.error(error.message);
    }
}
    export const editNewsFeedApi = async (body) =>{
        try {
            console.log("body in api",body);
            const editnewsdat =await NetworkCall.fetch(
                    addNewsRequest.geteditNewsFeedData(body))
           
            return editnewsdat;
    
        } catch (error) {
            
        message.error(error.message);
        }
    }

        export const updateNewsFeedApi = async (body) =>{
            try {
                const editnewsdat =await NetworkCall.fetch(
                        addNewsRequest.getupdateNewsFeedData(body))
                return editnewsdat;
        
            } catch (error) {
              
            message.error(error.message);
            return error.error.data;
            }
}