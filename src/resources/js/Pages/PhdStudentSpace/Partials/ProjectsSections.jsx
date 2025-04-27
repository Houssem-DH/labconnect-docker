import React from "react";


const ProjectsSection = ({
    projects,

}) => {

    


    return (
        <div className="p-6 relative">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex justify-between items-center">
                <span>Projects</span>
               
            </h3>
            {projects ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-gray-100 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    {project.title}
                                </h4>
                               
                            </div>
                            <img
                                src={`storage/${project.picture}`}
                                alt={project.title}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <p className="text-sm text-gray-700 mt-2">
                                {project.description}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No projects available</p>
            )}
          
        </div>
    );
};

export default ProjectsSection;
