import {menu} from './config';
import { combineResolvers, skip } from 'graphql-resolvers';
// контроль доступа
import { ac } from '../accessControl';
// console.log(ac.getGrants());
ac.grant('ADMIN')
    .readAny('route/test')
    .readAny('route/threejsTest');
// console.log(perm.granted);
 console.log(menu);
export default {
    Query: {
        menu: (parent, {user}, context, info) =>{
            return menuBuilder(parent, {user}, context, info);
        }
    }
}
const menuBuilder = (parent, req, context, info) =>{
    const me = context.me;
    const m = JSON.parse(JSON.stringify(menu));
    m.forEach((v, i, a) => {//уровень блоков меню
        // console.log(i);
        for (let key in m[i]) {
            if(m[i].hasOwnProperty(key)){ //
                if (key === 'items'){
                    // console.log(key, m[i][key]);
                    m[i][key].forEach((v1, i1, a1) => {
                        for (let key2 in m[i][key][i1]){
                            if (m[i][key][i1].hasOwnProperty(key2)){
                                if(key2 ==='items'){
                                    m[i][key][i1][key2].forEach((v2, i2, a2)=>{
                                        if( m[i][key][i1][key2][i2].route ){
                                            const r = m[i][key][i1][key2][i2].route;
                                            const role = me.role;
                                            const perm = ac.can(role).readAny('route'+r);
                                            console.log(role, '->', r, perm.granted);
                                            if (!perm.granted) {
                                                m[i][key][i1][key2].splice(i2,1);
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        }
    });
    console.log(JSON.stringify(m));
    return m;
};

function traverse(x) {
    if (isArray(x)) {
        traverseArray(x)
    } else if ((typeof x === 'object') && (x !== null)) {
        traverseObject(x)
    } else {

    }
}

function traverseArray(arr) {
    arr.forEach(function (x) {
        traverse(x)
    })
}

function traverseObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            traverse(obj[key])
        }
    }
}

function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]'
}
