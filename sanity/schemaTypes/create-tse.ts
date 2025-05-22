import { Rule } from "sanity";

export default {
  name: "tse",
  title: "Create TSE",  
  type: "document",
  fields: [
    {
      name: "creditClientId",
      title: "Credit Client Id",
      type: "string",
      description: "Credit Client Id",
    },
    {
      name: "creditClientSecret",
      title: "Credit Client Secret",
      type: "string",
      description: "Credit Client Secret",
    },
    {
      name: "metadata",
      title: "Metadata",
      type: "string",
      description: "metadata",
    }
   
  ],
};