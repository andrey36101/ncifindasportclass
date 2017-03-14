module.exports = (mongoose) => {
    /**
     * User Schema
     */

    let AccountSchema, UserSchema;

    AddressSchema = new mongoose.Schema({
        address1: {type: String},
        address2: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: String},
        country: {type: String},
        phone: {type: String}
    });

    UserSchema = new mongoose.Schema({
        name: { type: String },
        email: { type: String,  required: [true,'Email is required'] },
        password: { type: String,  required: [true,'Password is required'] },
        birthdate: { type: Date },
        gender: { type: String },
        registrationDate: { type: Date},
        address: {AddressSchema},
        location: { type: Array},
        isActive: { type: Boolean, default:true },
        profilePic: { type: String},
        about: { type: String},
        type: { type: String} // Trainer or Customer
    }, {timestamps: true});

    return mongoose.model('User', UserSchema);
};