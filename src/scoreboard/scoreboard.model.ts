import * as mongoose from 'mongoose';

export const ScoreboardSchema = new mongoose.Schema({
    record: {
        type: Number,
        required: true,
    }
});

export interface Scoreboard {
  id: string;
  record: number;
}