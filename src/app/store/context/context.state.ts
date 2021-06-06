export interface ContextState {
  currentLanguage: Language
  languages: Language[]
  toolbar: Toolbar
}


export interface Language {
  short: string,
  name: string
}

export interface Toolbar {
  title: string,
  hidden: boolean
}

const languages = [
  {short: 'de', name: 'Deutsch'},
  {short: 'en', name: 'English'}
];

export const initialState: ContextState = {
  currentLanguage: languages[0],
  languages: languages,
  toolbar: {
    title: "Welcome",
    hidden: true
  }
};
