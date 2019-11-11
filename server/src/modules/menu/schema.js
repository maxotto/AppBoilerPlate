import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        menu(user: String!): [MenuPlace]    
    }
    
    type MenuPoint {
        icon: String!
        text: String!
        route: String!
    }
    
    type MenuSubBlock {
        title: String!
        items: [MenuPoint]
    }
    
    type MenuPlace {
        place: String!
        items: [ MenuSubBlock ]
    }
 
`;
