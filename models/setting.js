const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* A common gotcha for beginners is that the unique option for schemas is not a validator.
It's a convenient helper for building MongoDB unique indexes. */
const settingSchema = mongoose.Schema({
    site: {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        description: {
            type: String,
            trim: true,
            minlength: 1
        },
        logo: {
            type: String
        },
        favicon: {
            type: String
        },
        email: {
            type: String,
            trim: true
        },
        mobile: {
            type: String,
            trim: true
        },
        copyright: {
            type: String,
            trim: true
        },
        playstoreLink: {
            type: String,
            trim: true
        },
        appstoreLink: {
            type: String,
            trim: true
        }
    },
    socialLink: [{
        socialLinkName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        socialLinkUrl: {
            type: String
        },
        socialLinkPic: {
            type: String
        }
    }],
    social: {
        socialStatus: {
            type: Boolean,
            default: false
        },
        facebookAppId: {
            type: String,
            trim: true
        },
        googleClientId: {
            type: String,
            trim: true
        },
        appleId: {
            type: String,
            trim: true
        },
    },
    mail: {
        mailStatus: {
            type: Boolean,
            default: false
        },
        mailService: {
            type: String,
            trim: true
        },
        mailUsername: {
            type: String,
            trim: true
        },
        mailPassword: {
            type: String,
            trim: true
        },
        mailFrom: {
            type: String,
            trim: true
        }
    },
    payment: [{
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        status: {
            type: Boolean,
            default: false
        },
        credentials: [{
            name: {
                type: String,
                trim: true
            },
            value: {
                type: String,
                trim: true
            }
        }]
    }],
    fareDetails: [{
        vehicleType: {
            type: String,
            enum: ['Sedan5', 'Sedan7', 'Van']
        },
        baseFare: {
            type: String
        },
        minFare: {
            type: String
        },
        perKm: {
            type: String
        }
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports.Setting = mongoose.model('setting', settingSchema);
