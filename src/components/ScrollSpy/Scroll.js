import React, { useState, useEffect, useCallback, useRef, createRef, memo } from 'react';
import { isEqual, throttle } from 'lodash';
import PropTypes from 'prop-types';
/**
* Find Best Match section while scrolling
*/
const spyScroll = (_targetElements) => {
   // create an Object with all children that has data-id attribute
   const targetElements = _targetElements;
   let bestMatch = {};
   for (const sectionName in targetElements) {
      if (Object.prototype.hasOwnProperty.call(targetElements, sectionName)) {
         const domElm = targetElements[sectionName];
         // check length from top while scrolling
         const delta = Math.abs(window.pageYOffset - domElm.offsetTop);
 
         if (!bestMatch.sectionName) {
            bestMatch = { sectionName, delta };
         }
         if (delta <= bestMatch.delta) {
            bestMatch = { sectionName, delta };
         }
      }
   }
   return bestMatch.sectionName;
};
 
/**
* Scroll Component
*
* @param {Object} contentStyle - style for main content.
* @param {Array} children - array of div with argument 'name' and 'id', name will be the label of the nav item/section id will be the key of the section
* @param {String} navClass - css class for the left nav to control the width of the nav area
*/
const Scroll = (props) => {
   const sectionsWrapperRef = useRef();
   const sectionsRefs = {};
   const { children, navClass } = props;
 
   const menuItems = children;
   menuItems.forEach((section) => (sectionsRefs[section?.props?.id] = createRef()));
 
   const scrollToTarget = (e) => {
      const refName = e?.currentTarget?.title;
      if (refName && sectionsRefs[refName] && sectionsRefs[refName].current) {
         sectionsRefs[refName].current.scrollIntoView({ behavior: 'smooth' });
      }
   };
 
   const SideSection = useCallback(
      ({ children, name, ...rest }) => (
         <section ref={sectionsRefs[name]} {...rest}>
            {children}
         </section>
      ),
      [sectionsRefs]
   );
 
   /**
    * pass current section to component and add listener while scroll
    */
   const CurrentScrolledSection = ({ sectionsWrapperRef, children }) => {
      const [currentSection, setCurrentSection] = useState();
      const [targetElements, setTargetElements] = useState(null);
 
      // Enforces a maximum number of time setCurrentSection can be call most once every 100 milliseconds
      const throttledOnScroll = throttle((_targetElements) => {
         setCurrentSection(spyScroll(_targetElements));
      }, 100);
 
      const findScroll = (element) => {
         element.onscroll = () => {
            throttledOnScroll(targetElements);
         };
         // check if element.children is empty for ie11
         element.children && Array.from(element?.children).forEach(findScroll);
      };
 
      // scroll div could be anywhere on the application we will need
      //to find the component and place an onScrolling event on it
      findScroll(document.body);
 
      useEffect(() => {
         if (sectionsWrapperRef.current) {
            const tElements = [...sectionsWrapperRef.current.children].reduce((map, item) => {
               return item.dataset.id ? { [item.dataset.id]: item, ...map } : map;
            }, {});
            setTargetElements(tElements);
         }
      }, [sectionsWrapperRef]);
 
      useEffect(() => {
         setCurrentSection(spyScroll(targetElements));
      }, [throttledOnScroll, sectionsWrapperRef]);
 
      return children(currentSection);
   };
 
   // will scroll to target once user tab to nav and press enter
   const handleEnterKeyPress = (e) => {
      if (e.key === 'Enter') {
         scrollToTarget(e);
      }
   };
 
   let key = 0;
   let contentKey = 0;
   // sectionWrapperRef to store current viewing section.
   const STYLE = {
      overflow: 'auto',
      height: '100%',
      paddingBottom: '400px',
   };
   const MainContent = memo(
      () => {
         return menuItems.map((item) => (
            <SideSection
               key={`sideSection_${item.props?.id}_${contentKey++}`}
               name={item.props?.id}
               data-id={item.props?.id}
               data-testid={item.props?.id}
            >
               {item.props?.children}
            </SideSection>
         ));
      },
      (prev, next) => {
         return isEqual(prev, next);
      }
   );
 
   return (
      <CurrentScrolledSection sectionsWrapperRef={sectionsWrapperRef}>
         {(currentSection) => (
            <div className=" scrollspy">
               {/* Sticky menu on the left  */}
               <div className={navClass}>
                  <nav className="menu-group">
                     {menuItems.map((item) => (
                        <button
                           style={{ textAlign: 'left' }}
                           tabIndex={0}
                           key={`${item.props?.id$}_${key++}`}
                           title={item.props?.id}
                           aria-label={item.props?.id}
                           onKeyPress={handleEnterKeyPress}
                           className={currentSection === item.props?.id ? 'menu-group-item active' : 'menu-group-item '}
                           onClick={(e) => scrollToTarget(e)}
                       >
                          {item.props?.label || item.props?.id}
                        </button>
                     ))}
                  </nav>
               </div>
               {/* Content on the right to scroll */}
               <div className="asideContent" style={{ ...STYLE, ...props.contentStyle }} ref={sectionsWrapperRef}>
                  <MainContent menuItems={menuItems} />
               </div>
            </div>
         )}
      </CurrentScrolledSection>
   );
};
 
Scroll.propTypes = {
   contentStyle: PropTypes.object,
   children: PropTypes.node,
   navClass: PropTypes.string,
};
 
export default Scroll;