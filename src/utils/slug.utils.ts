import slugify from "slugify";
import { ClientSession } from "mongoose";

const generateSlug = async (title:string, repository:any, session: ClientSession | null = null):Promise<string> => {
    const baseSlug = slugify(title, { lower: true, strict: true });
    let suffix = 1;
    let finalSlug = baseSlug;
    
    
    let existingSlug = await repository.findBySlug(finalSlug, null, session);
    
    
    while (existingSlug) {
        finalSlug = `${baseSlug}-${suffix}`;
        existingSlug = await repository.findBySlug(finalSlug, null, session);
        suffix++;
    }
    
    return finalSlug;
};

export default generateSlug;