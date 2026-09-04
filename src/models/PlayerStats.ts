import mongoose ,{Schema} from "mongoose";

export interface IPlayerStats {
   className?: string;
    gender?: string;
    playerId: mongoose.Types.ObjectId;
    level:    number;
    xp:       number;
    health:   number;
    mana:     number;
    armor:    number;
    coins:    number;
    magicResist: number;
    lastLocation?:{
        x:number;
        y:number;
        z:number;
    }

}


const PlayerStatsSchema = new Schema<IPlayerStats>(
    {
        playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, unique: true },
        className: { type: String },
        gender: { type: String },
        level:    { type: Number, default: 1 },
        xp:       { type: Number, default: 0 },
        health:   { type: Number, default: 100 },
        mana:     { type: Number, default: 50 },
        armor:    { type: Number, default: 0 },
        coins:    { type: Number, default: 0 },
        magicResist: { type: Number, default: 0 },
        lastLocation:{
            x:{type:Number,default:0},
            y:{type:Number,default:0},
            z:{type:Number,default:0},

        }
    },
    { timestamps: true }
);

export default mongoose.model<IPlayerStats>('PlayerStats', PlayerStatsSchema);