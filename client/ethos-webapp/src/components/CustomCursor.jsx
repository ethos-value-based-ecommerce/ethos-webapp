import { useState, useEffect } from 'react';


// Custom cursor that previews brands and products.
const CustomCursor = () => {
 const [position, setPosition] = useState({ x: 0, y: 0 });
 const [hidden, setHidden] = useState(true);
 const [hovering, setHovering] = useState(false);
 const [hoverContent, setHoverContent] = useState(null);


 useEffect(() => {
   // Show cursor when mouse moves
   const onMouseMove = (e) => {
     setPosition({ x: e.clientX, y: e.clientY });
     setHidden(false);
   };


   // Hide cursor when mouse leaves the window
   const onMouseLeave = () => {
     setHidden(true);
   };


   // Add event listeners
   document.addEventListener('mousemove', onMouseMove);
   document.addEventListener('mouseleave', onMouseLeave);


   // Set up hover detection for product cards
   const setupHoverListeners = () => {
     const productCards = document.querySelectorAll('.ant-card-hoverable');


     productCards.forEach(card => {
       card.addEventListener('mouseenter', () => {
         setHovering(true);


         // Get product image and title for hover content
         const imgElement = card.querySelector('img');
         const titleElement = card.querySelector('.ant-card-meta-title');


         if (imgElement && titleElement) {
           setHoverContent({
             image: imgElement.src,
             title: titleElement.textContent
           });
         }
       });


       card.addEventListener('mouseleave', () => {
         setHovering(false);
         setHoverContent(null);
       });
     });
   };


   // Initial setup
   setupHoverListeners();


   // Re-setup listeners when DOM might have changed
   const observer = new MutationObserver(setupHoverListeners);
   observer.observe(document.body, { childList: true, subtree: true });


   // Cleanup
   return () => {
     document.removeEventListener('mousemove', onMouseMove);
     document.removeEventListener('mouseleave', onMouseLeave);
     observer.disconnect();
   };
 }, []);


 if (hidden) return null;


 return (
   <>
     {/* Main cursor dot */}
     <div
       className={`custom-cursor-dot ${hovering ? 'hovering' : 'default'}`}
       style={{
         left: position.x,
         top: position.y
       }}
     />


     {/* Cursor ring */}
     <div
       className={`custom-cursor-ring ${hovering ? 'hovering' : 'default'}`}
       style={{
         left: position.x,
         top: position.y
       }}
     />


     {/* Preview content when hovering */}
     {hovering && hoverContent && (
       <div
         className="custom-cursor-preview"
         style={{
           left: position.x + 30,
           top: position.y - 30
         }}
       >
         <img
           src={hoverContent.image}
           alt={hoverContent.title}
         />
         <div className="custom-cursor-preview-title">
           {hoverContent.title}
         </div>
       </div>
     )}
   </>
 );
};


export default CustomCursor;
