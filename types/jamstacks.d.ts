import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// Narrow JSX typing for the hosted Jamstacks contact component.
// The element is a declarative host only: this template never registers it with customElements.define.
// The current shared runtime discovers hosts by these data attributes, so both are required here.
type JamstacksSupportFormProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  'data-jamstacks-component': 'support-form';
  'data-jamstacks-site': string;
  children?: never;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'jamstacks-support-form': JamstacksSupportFormProps;
    }
  }
}
