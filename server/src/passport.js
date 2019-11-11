import passport from 'passport'
import LdapStrategy from 'passport-ldapauth'
import config from "./config";

const getLDAPConfiguration = function(req, callback) {
    // Fetching things from database or whatever
    // console.log("2 - Inside getLDAPConfiguration");
//	console.log(req.body);
    process.nextTick(function () {
        const opts = {
            server: {
                url: config.ldap.host,
                bindDN: config.ldap.prefix + '\\' + req.body.username,
                bindCredentials: '' + req.body.password,
                searchBase: config.ldap.searchBase,
                searchFilter: "(&(objectClass=user)(sAMAccountName=" + req.body.username + "))",
            },
            passReqToCallback: true,
            usernameField: 'username',
            passwordField: 'password'
        };
        // console.log({opts});
        callback(null, opts);
    });
};
passport.use(new LdapStrategy(getLDAPConfiguration, function (req, ldapInfo, done) {
    // console.log('3 - Inside LdapStrategy');
    // console.log({ldapInfo})
    // console.log("LDAP user ", user.displayName, "is logged in.")
    return done(null, ldapInfo);
}));

passport.serializeUser((user, done) => {
    // console.log('5 - serializeUser', user.sAMAccountName);
    done(null, user.sAMAccountName);
});

passport.deserializeUser(function(user, done) {
    console.log('6 - DeSerializeUser', {user});
    if(user ==='amihailichenko'){
        done(null, user);
    } else {
        done('Not me!', null);
    }
});

export default passport;
