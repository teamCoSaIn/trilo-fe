import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

interface IPortalProps {
  childComponent: ReactElement;
}

const Portal = ({ childComponent }: IPortalProps) => {
  const targetElement = document.querySelector('#portal');

  if (!targetElement) {
    console.log('Cannot find Dom Element with id portal.');
    return childComponent;
  }

  return createPortal(childComponent, targetElement);
};

export default Portal;
