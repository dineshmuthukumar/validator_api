const mongoose = require('mongoose');
const async = require("async");
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const admin_data = require('./seeders/admin');
const user_data = require('./seeders/user');
const provider_data = require('./seeders/provider');

const { Admin } = require('./models/admin');
const { User } = require('./models/user');
const { Provider } = require('./models/provider');

dotenv.config();
// Database connection 
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then().catch((e) => console.log('Connection Failure...', e));

let admins = []
let users = []
let providers = []

async function seed() {
    await async.each(admin_data, async function iteratee(admin, next) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
        await admins.push(new Admin({ name: admin.name, email: admin.email, password: admin.password }))
    })

    await async.each(user_data, async function iteratee(user, next) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await users.push(new User({ firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password, mobileNumber: user.mobileNumber }))
    })

    await async.each(provider_data, async function iteratee(provider, next) {
        const salt = await bcrypt.genSalt(10);
        provider.password = await bcrypt.hash(provider.password, salt);
        await providers.push(new Provider({ firstName: provider.firstName, lastName: provider.lastName, email: provider.email, password: provider.password, mobileNumber: provider.mobileNumber, 
            taxiNumber: provider.taxiNumber, taxiType: provider.taxiType, wheelChair: provider.wheelChair,
            pets: provider.pets, parcel: provider.parcel, parcelType: provider.parcelType, food: provider.food, }))
    })

	await Admin.deleteMany({}).then(function(){  }).catch(function(error){  console.log(error) }); 
	await Admin.insertMany(admins).then(function(){  console.log("Admin Seeded."); }).catch(function(error){  console.log(error); process.exit();  }); 
	
    await User.deleteMany({}).then(function(){  }).catch(function(error){  console.log(error) }); 
	await User.insertMany(users).then(function(){  console.log("User Seeded."); }).catch(function(error){  console.log(error); process.exit();  }); 

    await Provider.deleteMany({}).then(function(){  }).catch(function(error){  console.log(error) }); 
	await Provider.insertMany(providers).then(function(){  console.log("Provider Seeded."); }).catch(function(error){  console.log(error); process.exit();  }); 

    process.exit();
}

seed();