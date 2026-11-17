// Neutral starter content. Replace with the owner's real details or a template's fictitious brief.
export interface Business {
  /** Public display name; also update site.config.json's name when renaming. */
  name: string;
  /** Short headline for the home page. */
  tagline: string;
  /** Plain-text introduction used by the page and fallback metadata. */
  introduction: string;
  /** Public contact address, never a private notification destination. */
  email: string;
  /** Public number; blank hides it. */
  phone: string;
  /** Contact copy; the hosted form supports name, email and message only. */
  enquiries: {
    /** Contact page heading. */
    title: string;
    /** No booking, payment or delivery promises. */
    introduction: string;
    /** Suggestions for the message, not additional form inputs. */
    usefulToInclude: string[];
  };
}

export const business: Business = {
  name: 'Jamstacks starter',
  tagline: 'A foundation for your next website.',
  introduction: 'Replace this neutral content with the business story, services and details that matter to its visitors.',
  email: 'hello@example.com',
  phone: '',
  enquiries: {
    title: 'Get in touch',
    introduction: 'Send a question or enquiry. Arrangements are confirmed only when the business replies.',
    usefulToInclude: ['What you would like to discuss', 'Any relevant dates or details'],
  },
};
