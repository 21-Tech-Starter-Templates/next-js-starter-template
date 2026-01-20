import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';

export default function CtaGithub() {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <Github className="h-4 w-4" />
        <span className="hidden sm:inline">GitHub</span>
      </Link>
    </Button>
  );
}
