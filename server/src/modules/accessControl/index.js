import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';
// контроль доступа
import { AccessControl } from 'accessControl';

export const grantList = {
    ALL:
        {
            'route/test': {
                'read:any': ['*']
            },

        },
    ADMIN:
        {
            video:
                {
                    'create:any': ['*', '!views'],
                    'read:any': ['*'],
                    'update:any': ['*', '!views'],
                    'delete:any': ['*']
                },
            '$extend': [ 'ALL' ]
        },
    NEW_USER:
        {
            video:
                {
                    'create:own': ['*', '!rating', '!views'],
                    'read:own': ['*'],
                    'update:own': ['*', '!rating', '!views'],
                    'delete:own': ['*']
                }
        },
    GUEST:
        {
            video:
                {
                    'create:own': ['*', '!rating', '!views'],
                    'read:own': ['*'],
                    'update:own': ['*', '!rating', '!views'],
                    'delete:own': ['*']
                }
        }
}
;
const AC = new AccessControl(grantList);
// AC.grant('ADMIN').extend('ALL');
export const ac = AC;
