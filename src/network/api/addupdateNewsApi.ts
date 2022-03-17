import NetworkCall from "../networkCall";
import {message} from "antd";
import addNewsRequest from "../request/addupdateNewsRequest"

export const addNewsApi = async (body) =>{
    try {
        
    } catch (error) {
        
    message.error(error.message);
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
    export const editNewsFeedApi = async () =>{
        try {
            const editnewsdat =await NetworkCall.fetch(
                    addNewsRequest.geteditNewsFeedData())
            return editnewsdat;
    
        } catch (error) {
            
        message.error(error.message);
        }
    }

        export const updateNewsFeedApi = async (body) =>{
            try {
                console.log("data obj body in  api", body);
                const editnewsdat =await NetworkCall.fetch(
                        addNewsRequest.getupdateNewsFeedData(body))
                console.log("request = update data=> ",editnewsdat);
                return editnewsdat;
        
            } catch (error) {
                
            message.error(error.message);
            }
}