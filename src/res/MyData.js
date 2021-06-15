import Experience from "./Experience";
import Skills from "./Skills"
import Modules from "./Modules";
import Personal from "./Personal";
import Awards from "./Awards";
import Projects from "./Projects"

const MyData = {
  bio: Personal.bio,
  workexp: Experience.workexp,
  languages: Skills.languages,
  languageDetails: Skills.languageDetails,
  languageExtra: Skills.languageExtra,
  frameworks: Skills.frameworks,
  education: Experience.education,
  awards: Awards,
  modules: Modules.modules,
  links: Modules.links,
  hobbies: Personal.hobbies,
  projects: Projects,
}

export default MyData;