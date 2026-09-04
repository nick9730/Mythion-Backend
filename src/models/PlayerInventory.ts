import mongoose, { Schema } from 'mongoose';

export const  InventorySlotType = [ 'Weapon','Armor','Inventory'] as const ;


export interface IInventoryItem {
    itemId:   string;
    itemName: string;
    quantity: number;
    equipped: boolean;
    slotType : typeof InventorySlotType[number];
}

export interface IPlayerInventory {
    playerId:  mongoose.Types.ObjectId;
    items:     IInventoryItem[];
}

const PlayerInventorySchema = new Schema<IPlayerInventory>(
    {
        playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, unique: true },
        items: [
            {
                itemId:   { type: String, required: true },
                itemName: { type: String, required: true },
                quantity: { type: Number, default: 1 },
                equipped: { type: Boolean, default: false },
                slotType: {type:String, enum :InventorySlotType , default : "Inventory"}
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model<IPlayerInventory>('PlayerInventory', PlayerInventorySchema);
