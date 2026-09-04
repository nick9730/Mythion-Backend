import mongoose, { Schema,Document } from 'mongoose';

export const  QuestStatus = [ 'NotTaken','Pending',  'Completed'] as const ;


export interface IQuest {
    questId:   string;
    questName: string;
    status:    typeof QuestStatus[number];
}

export interface IPlayerQuest extends Document {
    playerId: mongoose.Types.ObjectId;
    quests:   IQuest[];
}

const PlayerQuestSchema = new Schema<IPlayerQuest>(
    {
        playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, unique: true },
        quests: [
            {
                questId:   { type: String, required: true },
                questName: { type: String, required: true },
                status:    { 
                    type: String, 
                    enum : QuestStatus,
                    default :'NotTaken'
              } 
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IPlayerQuest>('PlayerQuest', PlayerQuestSchema);