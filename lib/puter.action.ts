import puter from "@heyputer/puter.js";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

export const signIn = async () => {
    return await puter.auth.signIn()
}

export const signOut =  () => {
    return puter.auth.signOut()
}

export const getCurrentUser = async () => {
    try{
        return await puter.auth.getUser()
    } catch (error) {
        return null
    }
}

export const isSignedIn = async () => {
    return await puter.auth.isSignedIn()
}

export const createProject = async ({item} : CreateProjectParams) : Promise<DesignItem | null> => {
    const projectId = item.id;
    const hosting = await getOrCreateHostingConfig();
    const hostedSource = projectId ? 
        await uploadImageToHosting({hosting, url: item.sourceImage, projectId, label: "source"}) : null;
    const hostedRender = projectId && item.renderedImage ? 
        await uploadImageToHosting({hosting, url: item.renderedImage, projectId, label: "rendered"}) : null;

    const resolvedSource = hostedSource?.url || item.sourceImage;

    const resolvedRender = hostedRender?.url || item.renderedImage;
    
    const {
        sourcePath : _sourcePath , 
        renderedPath : _renderedPath,
        publicPath : _publicPath,
        ...rest 
    } = item;

    const payload = {
        ...rest,
        sourcePath : resolvedSource,
        renderedPath : resolvedRender,
    }

    try {
        // call the  puter worker to store  the project  in kv 
        
        return payload;
    } catch (error) {
        console.warn(`Failed To Save Project : ${error}`);
        return null;
    }
       
}