import mongoose from 'mongoose';
// чтобы таскать настройки из .env
import 'dotenv/config';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  created_at: {type: Date, default: Date.now},
  login_at: {type: Date, default: Date.now},
  logout_at: {type: Date, default: Date.now},
  ldapInfo: mongoose.Schema.Types.Mixed,
  role: {
    type: String,
  },
});

userSchema.statics.findByLogin = async function(login) {
    return await this.findOne({
      username: login,
  });
};

userSchema.statics.logout = async function (username) {
    let user = await this.findOne({
        username: username,
    }, async (err, doc)=>{
        if(doc){
            doc.logout_at = new Date();
            await doc.save();
            return doc;
        }
    });
    user = await this.findOne({
        username: username,
    });
    return user;
};

userSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ userId: this._id }, next);
});

userSchema.pre('save', function(next){
    const now = new Date();
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

const User = mongoose.model('User', userSchema);
// console.log(User);

//
User.findOrCreateByLogin = async function(login, ldapInfo)
{
    // искать пользователя
    // если найден, то обновить информацию ldap
    // если не найден, то создать его
    // console.log({ldapInfo});
    let user = await this.findOne({
        username: login,
    }, async (err, doc)=>{
        if(doc){
            doc.ldapInfo = ldapInfo;
            doc.login_at = new Date();
            await doc.save();
        }
    });
    user = await this.findOne({
        username: login,
    });
    if(user) {
        return user;
    }
    let newRole = 'NEW_USER';
    if (process.env.ADMIN_USER_NAME === login) {
        newRole = 'ADMIN'
    }
    const newUser = new User({
        username: login,
        ldapInfo: ldapInfo,
        role: newRole,
    });
    await newUser.save();
    user = await this.findOne({
        username: login,
    });
    return user;
};


export default User;
