import React from 'react';
import Scroll from './Scroll';
import PropTypes from 'prop-types';
 
const dummyText =
   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel neque ac purus tincidunt venenatis. Donec dictum eu augue nec dictum. Phasellus tempus ipsum at imperdiet cursus. Proin sagittis ullamcorper ornare. Aliquam sollicitudin sapien nec nulla mattis, vitae cursus lacus auctor. Nullam in mattis massa. Praesent fringilla nisl in leo ullamcorper molestie. Quisque dui lorem, congue venenatis turpis sed, luctus finibus mauris.';
const dummyParagraph = (
   <div>
      <p>{dummyText}</p>
      <p>{dummyText}</p>
      <p>{dummyText}</p>
      <p>{dummyText}</p>
      <p>{dummyText}</p>
   </div>
);
const defaultChildren = [
   {
      name: 'React Scroll Spy',
      content: (
         <div>
            <h4>React Scroll Spy</h4> 
            Scroll on content and it would automatically highlight buttons in a menu list based on the current scroll position with animated effect. If menu is clicked it would scroll to the selected area with animation.
            
         </div>
      ),
   },
   {
      name: 'item1',
      content: (
         <div>
            <h4>Item1 </h4> {dummyParagraph}
         </div>
      ),
   },
   {
      name: 'item2',
      content: (
         <div>
            <h4>Item2 </h4> {dummyParagraph}
         </div>
      ),
   },
   {
      name: 'item3',
      content: (
         <div>
            <h4>Item3 </h4> {dummyParagraph}
         </div>
      ),
   },
   {
      name: 'item4',
      content: (
         <div>
            <h4>Item4 </h4> {dummyParagraph}
         </div>
      ),
   },
   {
      name: 'item5',
      content: (
         <div>
            <h4>Item5</h4> {dummyParagraph}
         </div>
      ),
   },
   
].map((item) => React.createElement('div', { name: item.name, id: item.name, key: item.name }, item.content));
 
const ScrollSpy = (props) => {
   const { children = defaultChildren } = props;
   return (
      <div className="main">
         <Scroll {...props}>{children}</Scroll>
      </div>
   );
};
 
ScrollSpy.defaultProps = {
   navClass: '',
   contentStyle: {},
};
 
ScrollSpy.propTypes = {
   /**
    *   An array of div to show the menu items. This would pass in as a children.  Each div should have two argument. (name) and (id) name will be shown as the left navigation label and id will be the unique id for the div.
    */
   children: PropTypes.arrayOf(PropTypes.element),
   /**
    * css class for the *left* nav column.  
    *
    */
   navClass: PropTypes.string,
   /**
    * style to overwrite content inline
    */
   contentStyle: PropTypes.object,
};
 
export default ScrollSpy;