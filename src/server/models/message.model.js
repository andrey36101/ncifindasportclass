module.exports = (mongoose) => {
    /**
     * Message Schema
     */

    let MessageSchema;

    MessageSchema = new mongoose.Schema({
        title: { type: String,  required: [true,'Message title is required'] },
        description: { type: String,  required: [true,'Description is required'] },
        senderId: { type: mongoose.Schema.Types.ObjectId }, // Message Sender's User Id
        recipientId: { type: mongoose.Schema.Types.ObjectId }, // Message Recipient's User Id
        createdDt: { type: Date, default: Date.now},
    }, {timestamps: true});

    return mongoose.model('Message', MessageSchema);
};