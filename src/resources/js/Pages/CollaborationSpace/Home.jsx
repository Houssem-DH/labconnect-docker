import Layout from "@/Layouts/CollaborationSpaceLayout";
import React, { useState, useRef } from "react";

const Home = ({
    auth,
    userRole,
    projects_count,
    phd_thesis_count,
    notifications,
    
}) => {
  
  
    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            projects_count={projects_count}
            phd_thesis_count={phd_thesis_count}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <h1>Home</h1>
        </Layout>
    );
};

export default Home;
