
const modules = import.meta.glob("./**/*.json", { eager: true });

export const getFullAcademicStructure = () => {
  const structure = {};

  Object.keys(modules).forEach((path) => {
    
    const parts = path.split("/");

    if (parts.length === 3) {
      const branch = parts[1]; 
      const semesterId = parts[2].replace(".json", ""); 
      const semesterData = modules[path].default;

      if (!structure[branch]) structure[branch] = {};

      
      structure[branch][semesterId] = semesterData;
    }
  });

  return structure;
};
