//where I left off:
//Exercise at bottom of https://www.howtographql.com/graphql-js/3-a-simple-mutation/
//Query link(id: ID) working
//Mutation updateLink() and deleteLink() not working

const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

let idCount = links.length;

const findLinkById = (id) => links.find((link) => link.id === id);
const findLinkIndex = (id) => links.findIndex((link) => link.id === id);

const resolvers = {
  Query: {
    info: () => null,
    feed: () => links,
    link: (parent, args) => {
      const foundLink = findLinkById(args.id);
      if (foundLink) {
        return foundLink;
      }
      return null; //return null if not found (research better error handling)
    },
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const { id, url, description } = args;
      const linkIndex = findLinkIndex(id);

      //checks if linkIndex exists
      if (Math.sign(linkIndex) >= 0) {
        const link = links[linkIndex];
        const updates = {
          ...link,
          ...(url && { url }),
          ...(description && { description }),
        };
        links[linkIndex] = updates;
      }
      return null; //return null if not found
    },
    deleteLink: (parent, args) => {
      const { id } = args;
      const linkIndex = findLinkIndex(args.id);
      if (Math.sign(linkIndex) >= 0) {
        links.splice(linkIndex, 1);
      }
      return null; //return null if not found
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
