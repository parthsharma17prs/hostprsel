import {useEffect} from 'react';

/**
 * Custom hook to manage page metadata (Title & Meta Description)
 * @param {string} title - The title of the page
 * @param {string} description - The meta description for SEO
 */
const useMetadata=(title, description) =>
{
    useEffect(() =>
    {
        // Update Title
        if (title)
        {
            document.title=`${title} | AuraLivings`;
        }

        // Update Description
        if (description)
        {
            let metaDescription=document.querySelector('meta[name="description"]');
            if (metaDescription)
            {
                metaDescription.setAttribute('content', description);
            } else
            {
                // Create if it doesn't exist (though it should be in index.html)
                metaDescription=document.createElement('meta');
                metaDescription.name='description';
                metaDescription.content=description;
                document.head.appendChild(metaDescription);
            }
        }

        // Cleanup (optional but good practice for SPAs)
        return () =>
        {
            // We don't necessarily want to delete it on unmount, 
            // but rather let the next page's metadata overwrite it.
        };
    }, [title, description]);
};

export default useMetadata;
