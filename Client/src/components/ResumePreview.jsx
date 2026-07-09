import React from 'react'
import ClassicTemplate from "./templates/ClassicTemplate.jsx"
import MinimalImageTemplate from "./templates/MinimalImageTemplate.jsx"
import ModernTemplate from "./templates/ModernTemplate.jsx"
import MinimalTemplate from "./templates/MinimalTemplate.jsx"
import ATSProCorporateTemplate from './templates/ATSProCorporateTemplate.jsx'
import AcademicResearcherTemplate from './templates/AcademicResearcherTemplate.jsx'
import HybridTimelineTemplate from './templates/HybridTimelineTemplate.jsx'
import PremiumCleanGridTemplate from './templates/PremiumCleanGridTemplate.jsx'
import ExecutiveBoardroomTemplate from './templates/ExecutiveBoardroomTemplate.jsx'
import FinanceConsultantTemplate from './templates/FinanceConsultantTemplate.jsx'
import StartupFounderTemplate from './templates/StartupFounderTemplate.jsx'
import TechnicalEngineerTemplate from './templates/TechnicalEngineerTemplate.jsx'
import HarvardATSResume from './templates/HarvardATSResume.jsx'

const ResumePreview = ({data, template, accentColor, classes=""}) => {

const renderTemplate = ()=>{
    switch(template){
        case "minimal-image":
            return <MinimalImageTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "modern":
            return <ModernTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "minimal":
            return <MinimalTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "ats-pro-corporate":
            return <ATSProCorporateTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "academic-researcher":
            return <AcademicResearcherTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "hybrid-timeline":
            return <HybridTimelineTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "premium-clean-grid":
            return <PremiumCleanGridTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "executive-board-room":
            return <ExecutiveBoardroomTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "finance-consultant":
            return <FinanceConsultantTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "startup-founder":
            return <StartupFounderTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "technical-engineer":
            return <TechnicalEngineerTemplate data={data} accentColor={accentColor} classes={classes}/>;
        case "harvard-ats":
            return <HarvardATSResume data={data} accentColor={accentColor} classes={classes}/>;
        default:
            return <ClassicTemplate data={data} accentColor={accentColor} classes={classes}/>;
    }
}
  return (
    <div className='w-full bg-gray-600'>
        <div id= "resume-preview" className={"border border-gray-200 print:shadow-none print:border-none" + classes}>
            {renderTemplate()}
        </div>
        <style jsx>
         {`
            @page{
                size: letter;
                margin:0;
            }
            @media print{
            html, body{
                width: 8.5in;
                height: 11in;
                overflow: hidden;
                }
                body * {
                    visibility: hidden;
                }
                #resume-preview, #resume-preview *{
                    visibility: visible;
                }
                #resume-preview{
                    position: absolute;
                    top:0;
                    left:0;
                    width: 100%;
                    height: auto;
                    margin: 0;
                    padding: 0;
                    box-shadow: none !important;
                    border: none !important;
                }
            }
        `}
        </style>
    </div>

  )
}

export default ResumePreview