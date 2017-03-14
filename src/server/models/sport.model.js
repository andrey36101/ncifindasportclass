module.exports = (mongoose) => {
    /**
     * Sports Schema
     */

    let SportSchema, AddressSchema;
    AddressSchema = new mongoose.Schema({
        address1: {type: String},
        address2: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: String},
        country: {type: String},
        phone: {type: String}
    });

    SportSchema = new mongoose.Schema({
        name: { type: String,  required: [true,'Sport name is required'] },
        description: { type: String,  required: [true,'Description is required'] },
        ownerId: { type: mongoose.Schema.Types.ObjectId }, // Trainer's User Id
        startDate: { type: Date},
        startTime: { type: String},
        address: { AddressSchema },
        location: { type: Array},
        prompPicture: { type: String},
        age: { type: Number},
        price: { type: Number, min: 1},
        tags: { type: Array},
        isActive: { type: Boolean, default:true },
        createdDt: { type: Date, default: Date.now},
    }, {timestamps: true});

    return mongoose.model('Sport', SportSchema);
};