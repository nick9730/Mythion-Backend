import mongoose, {  Schema } from 'mongoose';


export interface IPlayer {
    username: string;
    email:    string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isNewPlayer : boolean;
    
}


const PlayerSchema = new Schema<IPlayer>(
    {
        username: { type: String, required: true, unique: true },
        email:    { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isNewPlayer :{type:Boolean,default:true}

    },
    {timestamps:true}
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);
