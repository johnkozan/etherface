//  Schema of JSON template

//  a JSON Schema is generated from this file using `npm run jsonschema`
//  That JSON schema is then used by `ajv` to validate templates at runtime

export interface Template {
  name: string;
  templateVersion: string;


  tabs: Tab[];

}

interface Tab {
  name: string;
  slug: string;
  icon?: string; // one of emoji strings
  pages: Page[];
};

interface Page {
  title: string;
  layout: PageLayout;
  components: Component[];
};

interface PageLayout {
  columns: Number[]; // Sum to 12
};

interface Component {
  type: string;   // TODO: ENUM Type
  address: string; // TODO: Eth
};
