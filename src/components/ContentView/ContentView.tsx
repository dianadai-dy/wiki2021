import React, { useState, useEffect } from 'react';
import { ContentData } from '../_data/Data';
import { ContentMapping } from '../../components/ContentMapping/ContentMapping';
import equal from 'deep-equal';
import './ContentView.css';
import { SideBar } from '../ContentWidgets/SideBar/SideBar';


export type ContentViewProps = {
    contentData: ContentData,
    pageTitle: string
}

/**
 * ContentView shows the content from the data provided. It renders widgets.
 * 
 * Last Modified
 * July 19, 2019
 * William Kwok 
 */
export const ContentView: React.FC<ContentViewProps> = ({ contentData, pageTitle }) => {
    const [content, setContent] = useState<ContentData>({ ...contentData } as ContentData);
    
    useEffect(() => {
        if (!equal(content, contentData)) {
            setContent({ ...contentData } as ContentData)
        }
    }, [contentData]);

    let pageString = pageTitle === "" ? "MAIN_PAGE_DO_NOT_EDIT" :
        pageTitle.substring(1, pageTitle.length);

    if (!contentData || !contentData[pageString]) {
        return <></>
    }

    let options = {
        root: document.querySelector('#scrollArea'),
        rootMargin: '0px',
        threshold: 0.01
      };
    let observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            entry.boundingClientRect
        });
    }
    let observer = new IntersectionObserver(observerCallback, options);

    return <>
        <div className={contentData[pageString].hasSidebar ? "sidebar-content-view" : ""}>
            {/** TODO: Add sidebar here if the page is a sidebar. */
            contentData[pageString].hasSidebar ? 
                <SideBar contentData={contentData} pageTitle={pageString} />
            
            : null
            }
            
            <div id="content-view-container">
                {contentData[pageString].contentOrder &&
                    contentData[pageString].content &&
                    contentData[pageString].contentOrder!.map((contentHash) => {
                        let content = contentData[pageString].content![contentHash];
                        let ContentWidget = ContentMapping[content!.type].widget;
                        return <div id={contentHash} key={contentHash}>
                            <ContentWidget {...content} />
                        </div>
                    })
                }
            </div>
        </div>
    </>
}