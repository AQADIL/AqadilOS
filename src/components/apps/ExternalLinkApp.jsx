import React, { useEffect, useRef } from 'react';
import { useSecurity } from '../SecurityGate';

export default function ExternalLinkApp({ url }) {
  const security = useSecurity();
  const hasOpened = useRef(false);

  useEffect(() => {

    if (!hasOpened.current && security && security.openLink && url) {
      security.openLink(url);
      hasOpened.current = true;
    }
  }, [url, security]);



  return null;
}
