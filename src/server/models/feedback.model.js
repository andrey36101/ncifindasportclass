module.exports = (mongoose) => {
    /**
     * Feedback Schema
     */

    let FeedbackSchema;

    FeedbackSchema = new mongoose.Schema({
        content: { type: String,  required: [true,'Content is required'] },
        trainerId: { type: mongoose.Schema.Types.ObjectId,ref: 'User' },
        rating: {type: Number},
        userId: { type: mongoose.Schema.Types.ObjectId,ref: 'User' },
        createdDt: { type: Date, default: Date.now},
    }, {timestamps: true});

    return mongoose.model('Feedback', FeedbackSchema);
};